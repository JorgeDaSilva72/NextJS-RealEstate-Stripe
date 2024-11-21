/*
  Warnings:

  - A unique constraint covering the columns `[value]` on the table `PropertyStatus` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "PropertyStatus_value_key" ON "PropertyStatus"("value");
