-- AlterTable
ALTER TABLE "Choice" ADD COLUMN     "correct" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Question" ADD COLUMN     "points" INTEGER NOT NULL DEFAULT 1;
