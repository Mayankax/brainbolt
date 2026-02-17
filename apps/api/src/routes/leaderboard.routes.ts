import { Router } from "express";
import { getTopScores, getTopStreaks } from "../services/leaderboard.service.js";

const router = Router();

router.get("/score", async (_, res) => {
  const data = await getTopScores();
  res.json(data);
});

router.get("/streak", async (_, res) => {
  const data = await getTopStreaks();
  res.json(data);
});

export default router;
