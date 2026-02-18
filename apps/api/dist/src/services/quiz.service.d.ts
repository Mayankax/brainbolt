export declare function getNextQuestion(userId: string): Promise<{
    questionId: any;
    difficulty: any;
    prompt: any;
    choices: any;
    currentScore: number;
    currentStreak: number;
    stateVersion: number;
}>;
export declare function submitAnswer(params: {
    userId: string;
    questionId: string;
    answer: string;
    stateVersion: number;
    idempotencyKey: string;
}): Promise<{
    correct: any;
    scoreDelta: any;
    totalScore: any;
    newStreak: any;
    stateVersion: any;
    newDifficulty?: never;
    leaderboardRankScore?: never;
    leaderboardRankStreak?: never;
} | {
    correct: boolean;
    newDifficulty: number;
    newStreak: number;
    scoreDelta: number;
    totalScore: any;
    stateVersion: any;
    leaderboardRankScore: number | null;
    leaderboardRankStreak: number | null;
}>;
//# sourceMappingURL=quiz.service.d.ts.map