import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { PropertyStatus } from "@prisma/client";

export async function GET() {
  try {
    const statuses = await prisma.propertyStatus.findMany();
    return NextResponse.json(statuses, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch statuses" },
      { status: 500 }
    );
  }
}
