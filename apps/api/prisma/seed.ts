import { PrismaClient } from "@prisma/client";
import crypto from "crypto";

const prisma = new PrismaClient();

function hash(answer: string) {
  return crypto.createHash("sha256").update(answer).digest("hex");
}

async function main() {
  const existing = await prisma.question.count();
  if (existing > 0) {
    console.log("Questions already seeded");
    return;
  }

  const questions = [];

  for (let difficulty = 1; difficulty <= 10; difficulty++) {
    for (let i = 1; i <= 5; i++) {
      questions.push({
        difficulty,
        prompt: `Difficulty ${difficulty} Question ${i}`,
        choices: ["A", "B", "C", "D"],
        correctAnswerHash: hash("A"),
        tags: ["general"],
      });
    }
  }

  await prisma.question.createMany({
    data: questions,
  });

  console.log("Questions seeded");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
