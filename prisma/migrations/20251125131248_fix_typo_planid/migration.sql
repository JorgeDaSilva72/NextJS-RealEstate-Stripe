/*
  Warnings:

  - You are about to drop the column `palnId` on the `Subscriptions` table. All the data in the column will be lost.
  - Added the required column `planId` to the `Subscriptions` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Subscriptions" DROP CONSTRAINT "Subscriptions_palnId_fkey";

-- AlterTable
ALTER TABLE "Subscriptions" DROP COLUMN "palnId",
ADD COLUMN     "planId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Subscriptions" ADD CONSTRAINT "Subscriptions_planId_fkey" FOREIGN KEY ("planId") REFERENCES "SubscriptionPlan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
