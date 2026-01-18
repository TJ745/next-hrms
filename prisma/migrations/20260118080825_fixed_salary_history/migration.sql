/*
  Warnings:

  - You are about to drop the column `salary` on the `SalaryHistory` table. All the data in the column will be lost.
  - Added the required column `basicSalary` to the `SalaryHistory` table without a default value. This is not possible if the table is not empty.
  - Added the required column `foodAllowance` to the `SalaryHistory` table without a default value. This is not possible if the table is not empty.
  - Added the required column `housingAllowance` to the `SalaryHistory` table without a default value. This is not possible if the table is not empty.
  - Added the required column `mobileAllowance` to the `SalaryHistory` table without a default value. This is not possible if the table is not empty.
  - Added the required column `otherAllowance` to the `SalaryHistory` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalSalary` to the `SalaryHistory` table without a default value. This is not possible if the table is not empty.
  - Added the required column `transportationAllowance` to the `SalaryHistory` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "SalaryHistory" DROP COLUMN "salary",
ADD COLUMN     "basicSalary" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "foodAllowance" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "housingAllowance" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "mobileAllowance" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "otherAllowance" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "totalSalary" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "transportationAllowance" DOUBLE PRECISION NOT NULL;
