import { NextRequest, NextResponse } from "next/server";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import prisma from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { isAuthenticated, getUser } = await getKindeServerSession();
    if (!(await isAuthenticated())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const kindeUser = await getUser();
    const user = await prisma.user.findUnique({
      where: { id: params.id },
      select: {
        id: true,
        firstname: true,
        lastname: true,
        avatarUrl: true,
        email: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Include Google account image from Kinde if available
    // Prioritize Google account image (user.picture from Kinde) over database avatarUrl
    return NextResponse.json({
      ...user,
      // Add Google account image from Kinde (if user signed in with Google)
      googlePicture: kindeUser?.picture || null,
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}











