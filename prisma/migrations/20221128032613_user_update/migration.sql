/*
  Warnings:

  - Added the required column `password` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "clubType" AS ENUM ('MMGE', 'LFDM', 'MYR');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "club" "clubType",
ADD COLUMN     "password" TEXT NOT NULL;
