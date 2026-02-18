import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { prisma } from "../lib/prisma.js";
const router = Router();
router.get("/", authMiddleware, async (req, res) => {
    const state = await prisma.userState.findUnique({
        where: { userId: req.userId },
    });
    res.json({
        currentDifficulty: state?.currentDifficulty,
        streak: state?.streak,
        maxStreak: state?.maxStreak,
        totalScore: state?.totalScore,
        accuracy: state?.accuracy,
    });
});
export default router;
//# sourceMappingURL=metrics.routes.js.map