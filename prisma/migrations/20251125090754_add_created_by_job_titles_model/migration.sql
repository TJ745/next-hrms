/*
  Warnings:

  - The `status` column on the `jobtitles` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `createdById` to the `jobtitles` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Status" AS ENUM ('ACTIVE', 'INACTIVE');

-- AlterTable
ALTER TABLE "jobtitles" ADD COLUMN     "createdById" TEXT NOT NULL,
DROP COLUMN "status",
ADD COLUMN     "status" "Status" NOT NULL DEFAULT 'ACTIVE';

-- AddForeignKey
ALTER TABLE "jobtitles" ADD CONSTRAINT "jobtitles_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
