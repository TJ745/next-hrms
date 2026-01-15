-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "DocumentType" ADD VALUE 'IQAMA';
ALTER TYPE "DocumentType" ADD VALUE 'CV';
ALTER TYPE "DocumentType" ADD VALUE 'HIGH_SCHOOL_CERTIFICATE';
ALTER TYPE "DocumentType" ADD VALUE 'UNIVERSITY_CERTIFICATE';
ALTER TYPE "DocumentType" ADD VALUE 'OTHER_CERTIFICATE';
