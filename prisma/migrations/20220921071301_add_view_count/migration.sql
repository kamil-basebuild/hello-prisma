/*
  Warnings:

  - Made the column `bio` on table `Profile` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "viewCount" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "Profile" ALTER COLUMN "bio" SET NOT NULL;
