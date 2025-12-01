import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

/**
 * Emergency DB Fix Route
 * Adds the missing updatedAt column to the User table
 */
export async function GET() {
    try {
        // Raw SQL to add the missing column
        // We use try/catch in case it already exists or fails
        await prisma.$executeRawUnsafe(`
      ALTER TABLE "User" 
      ADD COLUMN IF NOT EXISTS "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
    `);

        return NextResponse.json({
            success: true,
            message: "Successfully added updatedAt column to User table"
        });
    } catch (error: any) {
        console.error("DB Fix Error:", error);
        return NextResponse.json(
            {
                success: false,
                error: error.message,
                details: "Failed to alter table. Check logs."
            },
            { status: 500 }
        );
    }
}
