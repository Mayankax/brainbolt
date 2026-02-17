import { Router } from "express";
import { createAnonymousUser } from "../services/auth.service.js";

const router = Router();

router.post("/anonymous", async (_, res) => {
  const result = await createAnonymousUser();
  res.json(result);
});

export default router;
