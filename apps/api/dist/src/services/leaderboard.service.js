import { redis } from "../lib/redis.js";
const SCORE_KEY = "leaderboard:score";
const STREAK_KEY = "leaderboard:streak";
export async function updateLeaderboards(userId, totalScore, maxStreak) {
    await redis.zadd(SCORE_KEY, totalScore, userId);
    await redis.zadd(STREAK_KEY, maxStreak, userId);
}
export async function getUserRank(userId) {
    const scoreRank = await redis.zrevrank(SCORE_KEY, userId);
    const streakRank = await redis.zrevrank(STREAK_KEY, userId);
    return {
        scoreRank: scoreRank !== null ? scoreRank + 1 : null,
        streakRank: streakRank !== null ? streakRank + 1 : null,
    };
}
export async function getTopScores(limit = 10) {
    return redis.zrevrange(SCORE_KEY, 0, limit - 1, "WITHSCORES");
}
export async function getTopStreaks(limit = 10) {
    return redis.zrevrange(STREAK_KEY, 0, limit - 1, "WITHSCORES");
}
//# sourceMappingURL=leaderboard.service.js.map