const MIN_DIFFICULTY = 1;
const MAX_DIFFICULTY = 10;
const BASE_SCORE = 10;
const STREAK_CAP = 5;
const HYSTERESIS_THRESHOLD = 2; // minimum streak before difficulty increases
const MOMENTUM_DECAY = 0.5;
export function computeAdaptiveResult(input) {
    let { correct, currentDifficulty, streak, maxStreak, totalScore, momentum, } = input;
    let newDifficulty = currentDifficulty;
    let newStreak = streak;
    let newMaxStreak = maxStreak;
    let scoreDelta = 0;
    let newMomentum = momentum;
    // ---------------- STREAK LOGIC ----------------
    if (correct) {
        newStreak += 1;
        newMaxStreak = Math.max(newMaxStreak, newStreak);
    }
    else {
        newStreak = 0;
    }
    // ---------------- STREAK MULTIPLIER ----------------
    const streakMultiplier = 1 + Math.min(newStreak, STREAK_CAP) * 0.1;
    // ---------------- DIFFICULTY WEIGHT ----------------
    const difficultyWeight = 1 + currentDifficulty * 0.2;
    // ---------------- SCORE CALCULATION ----------------
    if (correct) {
        scoreDelta = BASE_SCORE * difficultyWeight * streakMultiplier;
    }
    else {
        scoreDelta = -BASE_SCORE * 0.25;
    }
    // ---------------- MOMENTUM SYSTEM ----------------
    if (correct) {
        newMomentum += 1;
    }
    else {
        newMomentum -= 1;
    }
    newMomentum = newMomentum * MOMENTUM_DECAY;
    // ---------------- DIFFICULTY ADJUSTMENT ----------------
    if (correct) {
        if (newStreak >= HYSTERESIS_THRESHOLD && newMomentum > 0.5) {
            newDifficulty += 1;
            newMomentum = 0;
        }
    }
    else {
        if (newMomentum < -0.5) {
            newDifficulty -= 1;
            newMomentum = 0;
        }
    }
    // ---------------- BOUNDARY PROTECTION ----------------
    newDifficulty = Math.max(MIN_DIFFICULTY, Math.min(MAX_DIFFICULTY, newDifficulty));
    return {
        newDifficulty,
        newStreak,
        newMaxStreak,
        scoreDelta,
        newMomentum,
    };
}
//# sourceMappingURL=adaptive.service.js.map