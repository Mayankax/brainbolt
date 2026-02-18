import { prisma } from "../lib/prisma.js";
import { computeAdaptiveResult } from "./adaptive.service.js";
import { updateLeaderboards, getUserRank } from "./leaderboard.service.js";
import { redis } from "../lib/redis.js";
import crypto from "crypto";

async function getQuestionPool(difficulty: number) {
  const cacheKey = `questions:difficulty:${difficulty}`;

  const cached = await redis.get(cacheKey);
  if (cached) {
    return JSON.parse(cached);
  }

  const questions = await prisma.question.findMany({
    where: { difficulty },
  });

  await redis.set(cacheKey, JSON.stringify(questions), "EX", 60);

  return questions;
}

export async function getNextQuestion(userId: string) {
  const state = await prisma.userState.findUnique({
    where: { userId },
  });

  if (!state) throw new Error("User state not found");

  let difficulty = state.currentDifficulty;

  let questions = await getQuestionPool(difficulty);

  // fallback if no questions
  while (questions.length === 0 && difficulty > 1) {
    difficulty--;
    questions = await getQuestionPool(difficulty);
  }

  if (questions.length === 0) {
    throw new Error("No questions available");
  }

  const random =
    questions[Math.floor(Math.random() * questions.length)];

  return {
    questionId: random.id,
    difficulty: random.difficulty,
    prompt: random.prompt,
    choices: random.choices,
    currentScore: state.totalScore,
    currentStreak: state.streak,
    stateVersion: state.stateVersion,
  };
}


export async function submitAnswer(params: {
  userId: string;
  questionId: string;
  answer: string;
  stateVersion: number;
  idempotencyKey: string;
}) {
  const { userId, questionId, answer, stateVersion, idempotencyKey } = params;

  return prisma.$transaction(async (tx:any) => {
    const state = await tx.userState.findUnique({
      where: { userId },
    });

    if (!state) throw new Error("User state not found");

    // 🔒 Optimistic Lock Check
    if (state.stateVersion !== stateVersion) {
      const error: any = new Error("State version mismatch");
      error.statusCode = 409;
      throw error;
    }

    // 🔁 Idempotency Check
    const existing = await tx.answerLog.findUnique({
      where: {
        userId_idempotencyKey: {
          userId,
          idempotencyKey,
        },
      },
    });

    if (existing) {
      return {
        correct: existing.correct,
        scoreDelta: existing.scoreDelta,
        totalScore: state.totalScore,
        newStreak: state.streak,
        stateVersion: state.stateVersion,
      };
    }

    // 📉 STREAK DECAY LOGIC
    const now = new Date();
    let effectiveStreak = state.streak;

    if (state.lastAnswerAt) {
      const diffMs = now.getTime() - state.lastAnswerAt.getTime();
      const diffMinutes = diffMs / (1000 * 60);

      if (diffMinutes > 10 && state.streak > 0) {
        effectiveStreak = Math.floor(state.streak / 2);

        // Persist decay
        await tx.userState.update({
          where: { userId },
          data: {
            streak: effectiveStreak,
          },
        });
      }
    }

    // 📘 Fetch Question
    const question = await tx.question.findUnique({
      where: { id: questionId },
    });

    if (!question) throw new Error("Question not found");

    // ✅ Check Correctness
    const correct =
      crypto.createHash("sha256").update(answer).digest("hex") ===
      question.correctAnswerHash;

    // 🧠 Adaptive Logic
    const adaptive = computeAdaptiveResult({
      correct,
      currentDifficulty: state.currentDifficulty,
      streak: effectiveStreak,
      maxStreak: state.maxStreak,
      totalScore: state.totalScore,
      momentum: state.momentum,
    });

    const newTotalScore = state.totalScore + adaptive.scoreDelta;

    const totalAttempts = state.totalAttempts + 1;
    const correctAttempts = correct
      ? state.correctAttempts + 1
      : state.correctAttempts;

    const accuracy =
      totalAttempts === 0
        ? 0
        : (correctAttempts / totalAttempts) * 100;

    // 📝 Insert Answer Log
    await tx.answerLog.create({
      data: {
        userId,
        questionId,
        difficulty: question.difficulty,
        answer,
        correct,
        scoreDelta: adaptive.scoreDelta,
        streakAtAnswer: adaptive.newStreak,
        idempotencyKey,
      },
    });

    // 🔄 Update State
    const updatedState = await tx.userState.update({
      where: { userId },
      data: {
        currentDifficulty: adaptive.newDifficulty,
        streak: adaptive.newStreak,
        maxStreak: adaptive.newMaxStreak,
        totalScore: newTotalScore,
        totalAttempts,
        correctAttempts,
        accuracy,
        momentum: adaptive.newMomentum,
        stateVersion: { increment: 1 },
        lastQuestionId: questionId,
        lastAnswerAt: now,
      },
    });

    // 🏆 Update Leaderboards
    await updateLeaderboards(
      userId,
      updatedState.totalScore,
      updatedState.maxStreak
    );

    const ranks = await getUserRank(userId);

    return {
      correct,
      newDifficulty: adaptive.newDifficulty,
      newStreak: adaptive.newStreak,
      scoreDelta: adaptive.scoreDelta,
      totalScore: updatedState.totalScore,
      stateVersion: updatedState.stateVersion,
      leaderboardRankScore: ranks.scoreRank,
      leaderboardRankStreak: ranks.streakRank,
    };
  });
}

