-- CreateTable
CREATE TABLE "Choice" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "questionId" INTEGER,

    CONSTRAINT "Choice_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Choice" ADD CONSTRAINT "Choice_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question"("id") ON DELETE SET NULL ON UPDATE CASCADE;
