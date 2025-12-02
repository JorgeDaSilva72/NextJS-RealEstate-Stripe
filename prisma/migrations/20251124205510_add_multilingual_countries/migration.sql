/*
  Warnings:

  - You are about to drop the column `city` on the `PropertyLocation` table. All the data in the column will be lost.
  - You are about to drop the column `region` on the `PropertyLocation` table. All the data in the column will be lost.
  - You are about to drop the column `state` on the `PropertyLocation` table. All the data in the column will be lost.
  - You are about to drop the column `value` on the `PropertyStatus` table. All the data in the column will be lost.
  - You are about to drop the column `value` on the `PropertyType` table. All the data in the column will be lost.
  - You are about to drop the column `country` on the `SubscriptionPlan` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "PropertyStatus_value_key";

-- DropIndex
DROP INDEX "PropertyType_value_key";

-- AlterTable
ALTER TABLE "Property" ADD COLUMN     "countryId" INTEGER;

-- AlterTable
ALTER TABLE "PropertyLocation" DROP COLUMN "city",
DROP COLUMN "region",
DROP COLUMN "state",
ADD COLUMN     "cityId" INTEGER,
ADD COLUMN     "country" TEXT,
ADD COLUMN     "latitude" DOUBLE PRECISION,
ADD COLUMN     "longitude" DOUBLE PRECISION,
ADD COLUMN     "neighborhood" TEXT,
ALTER COLUMN "zip" DROP NOT NULL,
ALTER COLUMN "landmark" DROP NOT NULL;

-- AlterTable
ALTER TABLE "PropertyStatus" DROP COLUMN "value",
ADD COLUMN     "code" TEXT,
ADD COLUMN     "displayOrder" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "PropertyType" DROP COLUMN "value",
ADD COLUMN     "code" TEXT,
ADD COLUMN     "displayOrder" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "SubscriptionPlan" DROP COLUMN "country",
ADD COLUMN     "countryId" INTEGER;

-- CreateTable
CREATE TABLE "Language" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Language_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Country" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "phonePrefix" TEXT NOT NULL,
    "currency" TEXT NOT NULL,
    "currencySymbol" TEXT NOT NULL,
    "flagEmoji" TEXT,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Country_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CountryTranslation" (
    "id" SERIAL NOT NULL,
    "countryId" INTEGER NOT NULL,
    "languageId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "CountryTranslation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Region" (
    "id" SERIAL NOT NULL,
    "countryId" INTEGER NOT NULL,
    "code" TEXT,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Region_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RegionTranslation" (
    "id" SERIAL NOT NULL,
    "regionId" INTEGER NOT NULL,
    "languageId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "RegionTranslation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "City" (
    "id" SERIAL NOT NULL,
    "regionId" INTEGER,
    "countryId" INTEGER NOT NULL,
    "code" TEXT,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "population" INTEGER,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "City_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CityTranslation" (
    "id" SERIAL NOT NULL,
    "cityId" INTEGER NOT NULL,
    "languageId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "CityTranslation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PropertyTypeTranslation" (
    "id" SERIAL NOT NULL,
    "propertyTypeId" INTEGER NOT NULL,
    "languageId" INTEGER NOT NULL,
    "value" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "PropertyTypeTranslation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PropertyStatusTranslation" (
    "id" SERIAL NOT NULL,
    "propertyStatusId" INTEGER NOT NULL,
    "languageId" INTEGER NOT NULL,
    "value" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "PropertyStatusTranslation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Language_code_key" ON "Language"("code");

-- CreateIndex
CREATE UNIQUE INDEX "Country_code_key" ON "Country"("code");

-- CreateIndex
CREATE INDEX "CountryTranslation_languageId_idx" ON "CountryTranslation"("languageId");

-- CreateIndex
CREATE UNIQUE INDEX "CountryTranslation_countryId_languageId_key" ON "CountryTranslation"("countryId", "languageId");

-- CreateIndex
CREATE INDEX "Region_countryId_idx" ON "Region"("countryId");

-- CreateIndex
CREATE INDEX "RegionTranslation_languageId_idx" ON "RegionTranslation"("languageId");

-- CreateIndex
CREATE UNIQUE INDEX "RegionTranslation_regionId_languageId_key" ON "RegionTranslation"("regionId", "languageId");

-- CreateIndex
CREATE INDEX "City_countryId_idx" ON "City"("countryId");

-- CreateIndex
CREATE INDEX "City_regionId_idx" ON "City"("regionId");

-- CreateIndex
CREATE INDEX "CityTranslation_languageId_idx" ON "CityTranslation"("languageId");

-- CreateIndex
CREATE UNIQUE INDEX "CityTranslation_cityId_languageId_key" ON "CityTranslation"("cityId", "languageId");

-- CreateIndex
CREATE INDEX "PropertyTypeTranslation_languageId_idx" ON "PropertyTypeTranslation"("languageId");

-- CreateIndex
CREATE UNIQUE INDEX "PropertyTypeTranslation_propertyTypeId_languageId_key" ON "PropertyTypeTranslation"("propertyTypeId", "languageId");

-- CreateIndex
CREATE INDEX "PropertyStatusTranslation_languageId_idx" ON "PropertyStatusTranslation"("languageId");

-- CreateIndex
CREATE UNIQUE INDEX "PropertyStatusTranslation_propertyStatusId_languageId_key" ON "PropertyStatusTranslation"("propertyStatusId", "languageId");

-- CreateIndex
CREATE INDEX "PropertyLocation_cityId_idx" ON "PropertyLocation"("cityId");

-- AddForeignKey
ALTER TABLE "Property" ADD CONSTRAINT "Property_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES "Country"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CountryTranslation" ADD CONSTRAINT "CountryTranslation_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES "Country"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CountryTranslation" ADD CONSTRAINT "CountryTranslation_languageId_fkey" FOREIGN KEY ("languageId") REFERENCES "Language"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Region" ADD CONSTRAINT "Region_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES "Country"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RegionTranslation" ADD CONSTRAINT "RegionTranslation_regionId_fkey" FOREIGN KEY ("regionId") REFERENCES "Region"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RegionTranslation" ADD CONSTRAINT "RegionTranslation_languageId_fkey" FOREIGN KEY ("languageId") REFERENCES "Language"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "City" ADD CONSTRAINT "City_regionId_fkey" FOREIGN KEY ("regionId") REFERENCES "Region"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "City" ADD CONSTRAINT "City_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES "Country"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CityTranslation" ADD CONSTRAINT "CityTranslation_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES "City"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CityTranslation" ADD CONSTRAINT "CityTranslation_languageId_fkey" FOREIGN KEY ("languageId") REFERENCES "Language"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PropertyTypeTranslation" ADD CONSTRAINT "PropertyTypeTranslation_propertyTypeId_fkey" FOREIGN KEY ("propertyTypeId") REFERENCES "PropertyType"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PropertyTypeTranslation" ADD CONSTRAINT "PropertyTypeTranslation_languageId_fkey" FOREIGN KEY ("languageId") REFERENCES "Language"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PropertyStatusTranslation" ADD CONSTRAINT "PropertyStatusTranslation_propertyStatusId_fkey" FOREIGN KEY ("propertyStatusId") REFERENCES "PropertyStatus"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PropertyStatusTranslation" ADD CONSTRAINT "PropertyStatusTranslation_languageId_fkey" FOREIGN KEY ("languageId") REFERENCES "Language"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PropertyLocation" ADD CONSTRAINT "PropertyLocation_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES "City"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubscriptionPlan" ADD CONSTRAINT "SubscriptionPlan_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES "Country"("id") ON DELETE SET NULL ON UPDATE CASCADE;
