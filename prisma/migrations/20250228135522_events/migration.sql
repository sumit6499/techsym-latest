/*
  Warnings:

  - You are about to drop the column `studentId` on the `Event` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Event" DROP CONSTRAINT "Event_studentId_fkey";

-- AlterTable
ALTER TABLE "Event" DROP COLUMN "studentId";

-- AlterTable
ALTER TABLE "Student" ADD COLUMN     "eventId" TEXT;

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE SET NULL ON UPDATE CASCADE;
