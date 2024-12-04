-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_SavedSearch" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "filters" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "SavedSearch_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_SavedSearch" ("createdAt", "filters", "id", "name", "updatedAt", "userId") SELECT "createdAt", "filters", "id", "name", "updatedAt", "userId" FROM "SavedSearch";
DROP TABLE "SavedSearch";
ALTER TABLE "new_SavedSearch" RENAME TO "SavedSearch";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
