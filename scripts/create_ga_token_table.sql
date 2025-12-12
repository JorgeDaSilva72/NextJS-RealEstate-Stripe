-- This script creates only the GoogleAnalyticsToken table
-- Use this if the migration fails due to existing tables
-- Run with: npx prisma db execute --file scripts/create_ga_token_table.sql

-- CreateTable
CREATE TABLE IF NOT EXISTS "GoogleAnalyticsToken" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "accessToken" TEXT NOT NULL,
    "refreshToken" TEXT NOT NULL,
    "expiryDate" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GoogleAnalyticsToken_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "GoogleAnalyticsToken_userId_key" ON "GoogleAnalyticsToken"("userId");

-- AddForeignKey
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'GoogleAnalyticsToken_userId_fkey'
    ) THEN
        ALTER TABLE "GoogleAnalyticsToken" 
        ADD CONSTRAINT "GoogleAnalyticsToken_userId_fkey" 
        FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END $$;

