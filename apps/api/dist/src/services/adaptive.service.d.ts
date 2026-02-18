export interface AdaptiveInput {
    correct: boolean;
    currentDifficulty: number;
    streak: number;
    maxStreak: number;
    totalScore: number;
    momentum: number;
}
export interface AdaptiveResult {
    newDifficulty: number;
    newStreak: number;
    newMaxStreak: number;
    scoreDelta: number;
    newMomentum: number;
}
export declare function computeAdaptiveResult(input: AdaptiveInput): AdaptiveResult;
//# sourceMappingURL=adaptive.service.d.ts.map