import { Router } from "express";
import { authMiddleware, type AuthRequest } from "../middleware/auth.middleware.js";
import { getNextQuestion, submitAnswer } from "../services/quiz.service.js";
import { z } from "zod";

const router = Router();

router.get("/next", authMiddleware, async (req: AuthRequest, res) => {
  const result = await getNextQuestion(req.userId!);
  res.json(result);
});

const answerSchema = z.object({
  questionId: z.string(),
  answer: z.string(),
  stateVersion: z.number(),
  idempotencyKey: z.string(),
});

router.post("/answer", authMiddleware, async (req: AuthRequest, res) => {
  const parsed = answerSchema.parse(req.body);

  const result = await submitAnswer({
    userId: req.userId!,
    ...parsed,
  });

  res.json(result);
});

export default router;
