/*
  Warnings:

  - You are about to drop the column `eventId` on the `Student` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[studentId]` on the table `Payment` will be added. If there are existing duplicate values, this will fail.
  - Made the column `studentId` on table `Payment` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Student" DROP CONSTRAINT "Student_eventId_fkey";

-- AlterTable
ALTER TABLE "Payment" ALTER COLUMN "studentId" SET NOT NULL;

-- AlterTable
ALTER TABLE "Student" DROP COLUMN "eventId";

-- CreateTable
CREATE TABLE "_StudentEvents" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_StudentEvents_AB_unique" ON "_StudentEvents"("A", "B");

-- CreateIndex
CREATE INDEX "_StudentEvents_B_index" ON "_StudentEvents"("B");

-- CreateIndex
CREATE UNIQUE INDEX "Payment_studentId_key" ON "Payment"("studentId");

-- AddForeignKey
ALTER TABLE "_StudentEvents" ADD CONSTRAINT "_StudentEvents_A_fkey" FOREIGN KEY ("A") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_StudentEvents" ADD CONSTRAINT "_StudentEvents_B_fkey" FOREIGN KEY ("B") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;
