/*
  Warnings:

  - You are about to alter the column `queryStatus` on the `SavedSearch` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.
  - You are about to alter the column `queryType` on the `SavedSearch` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_SavedSearch" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "queryStatus" INTEGER,
    "queryType" INTEGER,
    "country" TEXT,
    "city" TEXT,
    "sortOrder" TEXT,
    "minPrice" REAL,
    "maxPrice" REAL,
    "minArea" REAL,
    "maxArea" REAL,
    "minRoom" INTEGER,
    "maxRoom" INTEGER,
    "minBathroom" INTEGER,
    "maxBathroom" INTEGER,
    "typeId" INTEGER NOT NULL DEFAULT 1,
    "statusId" INTEGER NOT NULL DEFAULT 1,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "SavedSearch_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "SavedSearch_typeId_fkey" FOREIGN KEY ("typeId") REFERENCES "PropertyType" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "SavedSearch_statusId_fkey" FOREIGN KEY ("statusId") REFERENCES "PropertyStatus" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_SavedSearch" ("city", "country", "createdAt", "id", "maxArea", "maxBathroom", "maxPrice", "maxRoom", "minArea", "minBathroom", "minPrice", "minRoom", "name", "queryStatus", "queryType", "sortOrder", "updatedAt", "userId") SELECT "city", "country", "createdAt", "id", "maxArea", "maxBathroom", "maxPrice", "maxRoom", "minArea", "minBathroom", "minPrice", "minRoom", "name", "queryStatus", "queryType", "sortOrder", "updatedAt", "userId" FROM "SavedSearch";
DROP TABLE "SavedSearch";
ALTER TABLE "new_SavedSearch" RENAME TO "SavedSearch";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
