/*
  Warnings:

  - A unique constraint covering the columns `[clerkUserId]` on the table `Doctor` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Doctor" ADD COLUMN     "clerkUserId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Doctor_clerkUserId_key" ON "Doctor"("clerkUserId");
