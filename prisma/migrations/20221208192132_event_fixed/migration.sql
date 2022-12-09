/*
  Warnings:

  - The `daysOfWeek` column on the `Event` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Event" ALTER COLUMN "startTime" SET DATA TYPE TEXT,
ALTER COLUMN "endTime" SET DATA TYPE TEXT,
DROP COLUMN "daysOfWeek",
ADD COLUMN     "daysOfWeek" INTEGER[],
ALTER COLUMN "color" SET DEFAULT '#f76e11';
