import "dotenv/config";
import { Redis } from "ioredis";
console.log("REDIS_URL:", process.env.REDIS_URL);
export const redis = new Redis(process.env.REDIS_URL, {
    maxRetriesPerRequest: 3,
    enableReadyCheck: true,
});
redis.on("connect", () => {
    console.log("Redis connected");
});
redis.on("error", (err) => {
    console.error("Redis error:", err);
});
//# sourceMappingURL=redis.js.map