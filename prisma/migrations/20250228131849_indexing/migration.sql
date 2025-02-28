/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `Student` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `email` to the `Student` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Payment" DROP CONSTRAINT "Payment_studentId_fkey";

-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "studentId" TEXT;

-- AlterTable
ALTER TABLE "Student" ADD COLUMN     "email" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "Event_title_date_idx" ON "Event"("title", "date");

-- CreateIndex
CREATE UNIQUE INDEX "Student_email_key" ON "Student"("email");

-- CreateIndex
CREATE INDEX "Student_email_name_idx" ON "Student"("email", "name");

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE SET NULL ON UPDATE CASCADE;
