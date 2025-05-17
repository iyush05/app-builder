/*
  Warnings:

  - Made the column `description` on table `Project` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `type` to the `Prompt` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ProjectType" AS ENUM ('REACT_NATIVE', 'NEXTJS', 'REACT');

-- CreateEnum
CREATE TYPE "PromptType" AS ENUM ('USER', 'SYSTEM');

-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "type" "ProjectType" NOT NULL DEFAULT 'NEXTJS',
ALTER COLUMN "description" SET NOT NULL;

-- AlterTable
ALTER TABLE "Prompt" ADD COLUMN     "type" "PromptType" NOT NULL;

-- CreateTable
CREATE TABLE "Action" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "content" TEXT NOT NULL,
    "promptId" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,

    CONSTRAINT "Action_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Action" ADD CONSTRAINT "Action_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Action" ADD CONSTRAINT "Action_promptId_fkey" FOREIGN KEY ("promptId") REFERENCES "Prompt"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
