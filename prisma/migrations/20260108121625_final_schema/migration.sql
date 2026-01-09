/*
  Warnings:

  - The `status` column on the `employees` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- DropForeignKey
ALTER TABLE "InviteToken" DROP CONSTRAINT "InviteToken_userId_fkey";

-- DropForeignKey
ALTER TABLE "jobtitles" DROP CONSTRAINT "jobtitles_createdById_fkey";

-- AlterTable
ALTER TABLE "employees" DROP COLUMN "status",
ADD COLUMN     "status" "Status" NOT NULL DEFAULT 'ACTIVE';

-- AddForeignKey
ALTER TABLE "InviteToken" ADD CONSTRAINT "InviteToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "jobtitles" ADD CONSTRAINT "jobtitles_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
