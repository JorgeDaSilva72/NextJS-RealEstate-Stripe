import { NextRequest, NextResponse } from "next/server";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

/**
 * Check authentication status
 * GET /api/auth/check
 * Used by client components to check if user is authenticated
 */
export async function GET(req: NextRequest) {
  try {
    const session = await getKindeServerSession();
    const { getUser, isAuthenticated } = session;
    const authenticated = await isAuthenticated();
    const user = authenticated ? await getUser() : null;

    return NextResponse.json({
      isAuthenticated: authenticated,
      user: user
        ? {
            id: user.id,
            email: user.email,
            given_name: user.given_name,
            family_name: user.family_name,
            picture: user.picture,
          }
        : null,
    });
  } catch (error) {
    console.error("Error checking auth status:", error);
    return NextResponse.json(
      {
        isAuthenticated: false,
        user: null,
        error: (error as Error).message,
      },
      { status: 500 }
    );
  }
}





