export declare function createAnonymousUser(): Promise<{
    token: string;
    user: {
        state: {
            currentDifficulty: number;
            streak: number;
            maxStreak: number;
            totalScore: number;
            accuracy: number;
            totalAttempts: number;
            correctAttempts: number;
            momentum: number;
            lastQuestionId: string | null;
            lastAnswerAt: Date | null;
            stateVersion: number;
            updatedAt: Date;
            userId: string;
        } | null;
    } & {
        id: string;
        createdAt: Date;
    };
}>;
//# sourceMappingURL=auth.service.d.ts.map