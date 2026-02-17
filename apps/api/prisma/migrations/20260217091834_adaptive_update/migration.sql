-- DropForeignKey
ALTER TABLE "AnswerLog" DROP CONSTRAINT "AnswerLog_userId_fkey";

-- DropForeignKey
ALTER TABLE "UserState" DROP CONSTRAINT "UserState_userId_fkey";

-- AlterTable
ALTER TABLE "UserState" ADD COLUMN     "momentum" DOUBLE PRECISION NOT NULL DEFAULT 0;

-- CreateIndex
CREATE INDEX "AnswerLog_answeredAt_idx" ON "AnswerLog"("answeredAt");

-- CreateIndex
CREATE INDEX "UserState_currentDifficulty_idx" ON "UserState"("currentDifficulty");

-- AddForeignKey
ALTER TABLE "UserState" ADD CONSTRAINT "UserState_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AnswerLog" ADD CONSTRAINT "AnswerLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AnswerLog" ADD CONSTRAINT "AnswerLog_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question"("id") ON DELETE CASCADE ON UPDATE CASCADE;
