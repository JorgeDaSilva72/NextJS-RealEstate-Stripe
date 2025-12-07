/*
  Warnings:

  - Changed the type of `landmark` on the `PropertyLocation` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "PropertyLocation" DROP COLUMN "landmark",
ADD COLUMN     "landmark" JSONB NOT NULL;
