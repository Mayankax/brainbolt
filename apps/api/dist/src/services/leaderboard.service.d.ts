export declare function updateLeaderboards(userId: string, totalScore: number, maxStreak: number): Promise<void>;
export declare function getUserRank(userId: string): Promise<{
    scoreRank: number | null;
    streakRank: number | null;
}>;
export declare function getTopScores(limit?: number): Promise<string[]>;
export declare function getTopStreaks(limit?: number): Promise<string[]>;
//# sourceMappingURL=leaderboard.service.d.ts.map