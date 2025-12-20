import prisma from "@/lib/prisma";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

//Génération d'avatars dynamiques
function generateAvatarUrl(userId: string): string {
  return `https://api.dicebear.com/6.x/identicon/svg?seed=${userId}`;
}

export async function GET(req: NextRequest) {
  try {
    // Obtenez la session et l'utilisateur
    const session = await getKindeServerSession();
    const { getUser } = session;
    const user = await getUser();

    // Vérifiez si l'utilisateur est valide
    if (!user || !user.id)
      throw new Error("Authentication failed: User not found");

    // Cherchez l'utilisateur dans la base de données
    const dbUser = await prisma.user.findUnique({
      where: {
        id: user.id,
      },
    });

    // Si l'utilisateur n'existe pas, créez-le
    if (!dbUser) {
      // Validate required fields
      if (!user.email || user.email.trim() === "") {
        throw new Error("Email is required for user creation");
      }

      const newUser = await prisma.user.create({
        data: {
          id: user.id,
          firstname: user.given_name?.trim() || null,
          lastname: user.family_name?.trim() || null,
          email: user.email.trim(),
          avatarUrl: generateAvatarUrl(user.id),
        },
      });
      console.log("User created:", newUser);
    }

    // Get redirect URL from query params
    const redirectUrl = req.nextUrl.searchParams.get("redirect_url");
    
    // Determine base URL
    const baseUrl =
      process.env.NODE_ENV === "production"
        ? "https://afriqueavenirimmobilier.com"
        : "http://localhost:3000";

    // Extract locale from redirect URL or use default
    let finalRedirect: string;
    let locale = "fr"; // Default locale
    
    if (redirectUrl) {
      try {
        const decodedUrl = decodeURIComponent(redirectUrl);
        
        // Extract locale from URL (e.g., /fr/..., /en/...)
        const localeMatch = decodedUrl.match(/\/(fr|en|pt|ar)(?:\/|$)/);
        if (localeMatch) {
          locale = localeMatch[1];
        }
        
        // Use the provided redirect URL if it's absolute
        if (decodedUrl.startsWith("http")) {
          finalRedirect = decodedUrl;
        } else {
          // Make it absolute
          finalRedirect = `${baseUrl}${decodedUrl.startsWith("/") ? "" : "/"}${decodedUrl}`;
        }
        
        // Add query param to trigger refresh in Appbar
        // Handle both absolute URLs and relative paths
        try {
          const url = new URL(finalRedirect);
          url.searchParams.set("from_auth", "true");
          finalRedirect = url.toString();
        } catch {
          // If URL parsing fails, append query param manually
          const separator = finalRedirect.includes("?") ? "&" : "?";
          finalRedirect = `${finalRedirect}${separator}from_auth=true`;
        }
      } catch {
        // If decode fails, use default
        finalRedirect = `${baseUrl}/${locale}?from_auth=true`;
      }
    } else {
      // Default: redirect to home page with default locale
      finalRedirect = `${baseUrl}/${locale}?from_auth=true`;
    }

    console.log("[Auth Success] Redirecting to:", finalRedirect);
    return NextResponse.redirect(finalRedirect);
  } catch (error) {
    // Gérez les erreurs et retournez une réponse d'erreur
    console.error("Error in GET handler:", error);
    return NextResponse.json(
      { error: (error as Error).message || "Unknown error occurred" },
      { status: 500 }
    );
  }
}
