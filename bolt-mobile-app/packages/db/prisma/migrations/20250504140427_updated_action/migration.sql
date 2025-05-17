/*
  Warnings:

  - You are about to drop the column `promptId` on the `Action` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Action" DROP CONSTRAINT "Action_promptId_fkey";

-- AlterTable
ALTER TABLE "Action" DROP COLUMN "promptId";
