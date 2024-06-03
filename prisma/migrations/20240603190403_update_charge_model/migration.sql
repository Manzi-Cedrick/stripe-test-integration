/*
  Warnings:

  - Added the required column `account` to the `Charge` table without a default value. This is not possible if the table is not empty.
  - Added the required column `destination_amount` to the `Charge` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Charge" ADD COLUMN     "account" TEXT NOT NULL,
ADD COLUMN     "destination_amount" DECIMAL(65,30) NOT NULL;
