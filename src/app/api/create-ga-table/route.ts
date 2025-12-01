import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * Public endpoint to create GoogleAnalyticsToken table if it doesn't exist
 * This is a one-time setup endpoint for production
 * 
 * Note: This endpoint is public for convenience, but should be removed or secured
 * after the table is created in production.
 */
export async function GET(req: NextRequest) {
  try {
    // Check if table already exists
    const tableExists = await prisma.$queryRawUnsafe<Array<{ exists: boolean }>>(
      `SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'GoogleAnalyticsToken'
      ) as exists;`
    );

    if (tableExists[0]?.exists) {
      return NextResponse.json({
        success: true,
        message: "GoogleAnalyticsToken table already exists",
        tableExists: true,
      });
    }

    // Create table if it doesn't exist
    const createTableSQL = `
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
    `;

    const createIndexSQL = `
      CREATE UNIQUE INDEX IF NOT EXISTS "GoogleAnalyticsToken_userId_key" 
      ON "GoogleAnalyticsToken"("userId");
    `;

    const createForeignKeySQL = `
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
    `;

    // Execute SQL commands
    await prisma.$executeRawUnsafe(createTableSQL);
    await prisma.$executeRawUnsafe(createIndexSQL);
    await prisma.$executeRawUnsafe(createForeignKeySQL);

    // Verify table was created
    const verifyTable = await prisma.$queryRawUnsafe<Array<{ exists: boolean }>>(
      `SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'GoogleAnalyticsToken'
      ) as exists;`
    );

    if (verifyTable[0]?.exists) {
      return NextResponse.json({
        success: true,
        message: "GoogleAnalyticsToken table created successfully",
        tableExists: true,
      });
    } else {
      return NextResponse.json(
        { 
          success: false,
          error: "Table creation may have failed",
          tableExists: false,
        },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error("Error creating GoogleAnalyticsToken table:", error);
    
    // If table already exists, that's okay
    if (error?.message?.includes("already exists") || error?.code === "42P07") {
      return NextResponse.json({
        success: true,
        message: "Table already exists",
        tableExists: true,
      });
    }

    return NextResponse.json(
      {
        success: false,
        error: "Failed to create table",
        details: process.env.NODE_ENV === "development" ? error.message : "Check server logs for details",
        tableExists: false,
      },
      { status: 500 }
    );
  }
}

