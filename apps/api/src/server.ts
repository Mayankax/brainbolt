import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import rateLimit from "express-rate-limit";
import "./lib/redis.js";
import authRoutes from "./routes/auth.routes.js";
import quizRoutes from "./routes/quiz.routes.js";
import metricsRoutes from "./routes/metrics.routes.js";
import leaderboardRoutes from "./routes/leaderboard.routes.js";


dotenv.config();

const app = express();

/* -------------------- Middleware -------------------- */

app.use(cors());
app.use(express.json());

app.use(
  rateLimit({
    windowMs: 60 * 1000,
    max: 120,
    standardHeaders: true,
    legacyHeaders: false,
  })
);
app.use("/v1/quiz", quizRoutes);
app.use("/v1/quiz/metrics", metricsRoutes);
app.use("/v1/leaderboard", leaderboardRoutes);
/* -------------------- Routes -------------------- */

app.get("/health", (_, res) => {
  res.json({ status: "ok" });
});

app.use("/v1/auth", authRoutes);

/* -------------------- Global Error Handler -------------------- */

app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err);

  const status = err.statusCode || 500;

  res.status(status).json({
    message: err.message || "Internal server error",
  });
});


/* -------------------- Start Server -------------------- */

const PORT = process.env.PORT ?? 4000;

app.listen(PORT, () => {
  console.log(`API running on port ${PORT}`);
});
