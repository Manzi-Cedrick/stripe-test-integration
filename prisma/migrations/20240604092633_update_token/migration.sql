/*
  Warnings:

  - You are about to drop the column `name` on the `TokenCard` table. All the data in the column will be lost.
  - Added the required column `type` to the `TokenCard` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "TokenCard" DROP COLUMN "name",
ADD COLUMN     "type" TEXT NOT NULL;
