/*
  Warnings:

  - You are about to drop the column `imagePerPropertyLimit` on the `SubscriptionPlan` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `SubscriptionPlan` table. All the data in the column will be lost.
  - You are about to drop the column `propertyLimit` on the `SubscriptionPlan` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[value]` on the table `PropertyType` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `country` to the `SubscriptionPlan` table without a default value. This is not possible if the table is not empty.
  - Added the required column `endDate` to the `SubscriptionPlan` table without a default value. This is not possible if the table is not empty.
  - Added the required column `namePlan` to the `SubscriptionPlan` table without a default value. This is not possible if the table is not empty.
  - Added the required column `photosPerAd` to the `SubscriptionPlan` table without a default value. This is not possible if the table is not empty.
  - Added the required column `premiumAds` to the `SubscriptionPlan` table without a default value. This is not possible if the table is not empty.
  - Added the required column `shortVideosPerAd` to the `SubscriptionPlan` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startDate` to the `SubscriptionPlan` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `SubscriptionPlan` table without a default value. This is not possible if the table is not empty.
  - Added the required column `youtubeVideoDuration` to the `SubscriptionPlan` table without a default value. This is not possible if the table is not empty.
  - Added the required column `zoneRadius` to the `SubscriptionPlan` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "SubscriptionPlan" DROP COLUMN "imagePerPropertyLimit",
DROP COLUMN "name",
DROP COLUMN "propertyLimit",
ADD COLUMN     "country" TEXT NOT NULL,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "duration" TEXT NOT NULL DEFAULT 'AN',
ADD COLUMN     "endDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "namePlan" TEXT NOT NULL,
ADD COLUMN     "photosPerAd" INTEGER NOT NULL,
ADD COLUMN     "premiumAds" INTEGER NOT NULL,
ADD COLUMN     "shortVideosPerAd" INTEGER NOT NULL,
ADD COLUMN     "startDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "youtubeVideoDuration" TEXT NOT NULL,
ADD COLUMN     "zoneRadius" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "PropertyType_value_key" ON "PropertyType"("value");
