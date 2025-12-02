/*
  Warnings:

  - A unique constraint covering the columns `[code]` on the table `PropertyStatus` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[code]` on the table `PropertyType` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[paymentID]` on the table `Subscriptions` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[email]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `updatedAt` to the `Appointment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Property` table without a default value. This is not possible if the table is not empty.
  - Made the column `code` on table `PropertyStatus` required. This step will fail if there are existing NULL values in that column.
  - Made the column `code` on table `PropertyType` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `updatedAt` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Appointment" DROP CONSTRAINT "Appointment_propertyId_fkey";

-- DropForeignKey
ALTER TABLE "Appointment" DROP CONSTRAINT "Appointment_userId_fkey";

-- DropForeignKey
ALTER TABLE "Property" DROP CONSTRAINT "Property_userId_fkey";

-- DropForeignKey
ALTER TABLE "Subscriptions" DROP CONSTRAINT "Subscriptions_userId_fkey";

-- AlterTable
ALTER TABLE "Appointment" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Property" ADD COLUMN     "currency" TEXT NOT NULL DEFAULT 'XOF',
ADD COLUMN     "expiresAt" TIMESTAMP(3),
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "isFeatured" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "publishedAt" TIMESTAMP(3),
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "viewCount" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "PropertyFeature" ADD COLUMN     "floor" INTEGER,
ADD COLUMN     "totalFloors" INTEGER,
ADD COLUMN     "yearBuilt" INTEGER;

-- AlterTable
ALTER TABLE "PropertyImage" ADD COLUMN     "caption" TEXT,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "displayOrder" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "isMain" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "PropertyStatus" ALTER COLUMN "code" SET NOT NULL;

-- AlterTable
ALTER TABLE "PropertyType" ALTER COLUMN "code" SET NOT NULL;

-- AlterTable
ALTER TABLE "PropertyVideo" ADD COLUMN     "duration" INTEGER,
ADD COLUMN     "title" TEXT;

-- AlterTable
ALTER TABLE "SubscriptionPlan" ADD COLUMN     "displayOrder" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "Subscriptions" ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'active';

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- CreateIndex
CREATE INDEX "Appointment_userId_idx" ON "Appointment"("userId");

-- CreateIndex
CREATE INDEX "Appointment_propertyId_idx" ON "Appointment"("propertyId");

-- CreateIndex
CREATE INDEX "Appointment_start_idx" ON "Appointment"("start");

-- CreateIndex
CREATE INDEX "Appointment_state_idx" ON "Appointment"("state");

-- CreateIndex
CREATE INDEX "City_isActive_isFeatured_idx" ON "City"("isActive", "isFeatured");

-- CreateIndex
CREATE INDEX "CityTranslation_name_idx" ON "CityTranslation"("name");

-- CreateIndex
CREATE INDEX "Country_isActive_displayOrder_idx" ON "Country"("isActive", "displayOrder");

-- CreateIndex
CREATE INDEX "Property_userId_idx" ON "Property"("userId");

-- CreateIndex
CREATE INDEX "Property_typeId_idx" ON "Property"("typeId");

-- CreateIndex
CREATE INDEX "Property_statusId_idx" ON "Property"("statusId");

-- CreateIndex
CREATE INDEX "Property_countryId_idx" ON "Property"("countryId");

-- CreateIndex
CREATE INDEX "Property_isActive_isFeatured_idx" ON "Property"("isActive", "isFeatured");

-- CreateIndex
CREATE INDEX "Property_createdAt_idx" ON "Property"("createdAt" DESC);

-- CreateIndex
CREATE INDEX "Property_price_idx" ON "Property"("price");

-- CreateIndex
CREATE INDEX "PropertyFeature_bedrooms_idx" ON "PropertyFeature"("bedrooms");

-- CreateIndex
CREATE INDEX "PropertyFeature_area_idx" ON "PropertyFeature"("area");

-- CreateIndex
CREATE INDEX "PropertyImage_propertyId_idx" ON "PropertyImage"("propertyId");

-- CreateIndex
CREATE INDEX "PropertyImage_isMain_idx" ON "PropertyImage"("isMain");

-- CreateIndex
CREATE INDEX "PropertyLocation_latitude_longitude_idx" ON "PropertyLocation"("latitude", "longitude");

-- CreateIndex
CREATE UNIQUE INDEX "PropertyStatus_code_key" ON "PropertyStatus"("code");

-- CreateIndex
CREATE INDEX "PropertyStatus_isActive_displayOrder_idx" ON "PropertyStatus"("isActive", "displayOrder");

-- CreateIndex
CREATE UNIQUE INDEX "PropertyType_code_key" ON "PropertyType"("code");

-- CreateIndex
CREATE INDEX "PropertyType_isActive_displayOrder_idx" ON "PropertyType"("isActive", "displayOrder");

-- CreateIndex
CREATE INDEX "PropertyVideo_propertyId_idx" ON "PropertyVideo"("propertyId");

-- CreateIndex
CREATE INDEX "Region_isActive_idx" ON "Region"("isActive");

-- CreateIndex
CREATE INDEX "SubscriptionPlan_countryId_idx" ON "SubscriptionPlan"("countryId");

-- CreateIndex
CREATE INDEX "SubscriptionPlan_isActive_displayOrder_idx" ON "SubscriptionPlan"("isActive", "displayOrder");

-- CreateIndex
CREATE UNIQUE INDEX "Subscriptions_paymentID_key" ON "Subscriptions"("paymentID");

-- CreateIndex
CREATE INDEX "Subscriptions_userId_idx" ON "Subscriptions"("userId");

-- CreateIndex
CREATE INDEX "Subscriptions_planId_idx" ON "Subscriptions"("planId");

-- CreateIndex
CREATE INDEX "Subscriptions_endDate_idx" ON "Subscriptions"("endDate");

-- CreateIndex
CREATE INDEX "Subscriptions_status_idx" ON "Subscriptions"("status");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_createdAt_idx" ON "User"("createdAt");

-- AddForeignKey
ALTER TABLE "Property" ADD CONSTRAINT "Property_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subscriptions" ADD CONSTRAINT "Subscriptions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
