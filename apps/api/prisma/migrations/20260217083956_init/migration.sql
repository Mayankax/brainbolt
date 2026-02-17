-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Question" (
    "id" TEXT NOT NULL,
    "difficulty" INTEGER NOT NULL,
    "prompt" TEXT NOT NULL,
    "choices" JSONB NOT NULL,
    "correctAnswerHash" TEXT NOT NULL,
    "tags" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Question_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserState" (
    "userId" TEXT NOT NULL,
    "currentDifficulty" INTEGER NOT NULL DEFAULT 1,
    "streak" INTEGER NOT NULL DEFAULT 0,
    "maxStreak" INTEGER NOT NULL DEFAULT 0,
    "totalScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "accuracy" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "totalAttempts" INTEGER NOT NULL DEFAULT 0,
    "correctAttempts" INTEGER NOT NULL DEFAULT 0,
    "lastQuestionId" TEXT,
    "lastAnswerAt" TIMESTAMP(3),
    "stateVersion" INTEGER NOT NULL DEFAULT 1,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserState_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "AnswerLog" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "difficulty" INTEGER NOT NULL,
    "answer" TEXT NOT NULL,
    "correct" BOOLEAN NOT NULL,
    "scoreDelta" DOUBLE PRECISION NOT NULL,
    "streakAtAnswer" INTEGER NOT NULL,
    "answeredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "idempotencyKey" TEXT NOT NULL,

    CONSTRAINT "AnswerLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Question_difficulty_idx" ON "Question"("difficulty");

-- CreateIndex
CREATE INDEX "UserState_totalScore_idx" ON "UserState"("totalScore");

-- CreateIndex
CREATE INDEX "UserState_maxStreak_idx" ON "UserState"("maxStreak");

-- CreateIndex
CREATE INDEX "AnswerLog_userId_idx" ON "AnswerLog"("userId");

-- CreateIndex
CREATE INDEX "AnswerLog_questionId_idx" ON "AnswerLog"("questionId");

-- CreateIndex
CREATE UNIQUE INDEX "AnswerLog_userId_idempotencyKey_key" ON "AnswerLog"("userId", "idempotencyKey");

-- AddForeignKey
ALTER TABLE "UserState" ADD CONSTRAINT "UserState_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AnswerLog" ADD CONSTRAINT "AnswerLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
