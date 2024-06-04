/*
  Warnings:

  - Added the required column `brand` to the `TokenCard` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cvc_check` to the `TokenCard` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fingerprint` to the `TokenCard` table without a default value. This is not possible if the table is not empty.
  - Added the required column `funding` to the `TokenCard` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "TokenCard" ADD COLUMN     "brand" TEXT NOT NULL,
ADD COLUMN     "cvc_check" TEXT NOT NULL,
ADD COLUMN     "fingerprint" TEXT NOT NULL,
ADD COLUMN     "funding" TEXT NOT NULL;
