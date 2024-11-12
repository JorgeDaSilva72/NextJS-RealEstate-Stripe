import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const statuses = await prisma.propertyType.findMany();
    return NextResponse.json(statuses, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch types" },
      { status: 500 }
    );
  }
}
