/*
  Warnings:

  - Made the column `senderId` on table `Transaction` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Transaction" DROP CONSTRAINT "Transaction_senderId_fkey";

UPDATE "Transaction" SET "senderId" = 1 WHERE "senderId" IS NULL;

-- AlterTable
ALTER TABLE "Transaction" ALTER COLUMN "senderId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

