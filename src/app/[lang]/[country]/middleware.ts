import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Obtenir le pays à partir de l'en-tête Geo-Location
  const country = request.geo?.country?.toLowerCase() || "MA"; // maroc par défaut

  // Obtenir la langue du navigateur
  const accept_language = request.headers.get("accept-language");
  const preferred_language =
    accept_language?.split(",")[0].split("-")[0] || "fr";

  // Si l'utilisateur est sur la page d'accueil, rediriger vers sa version locale
  if (request.nextUrl.pathname === "/") {
    return NextResponse.redirect(
      new URL(`/${preferred_language}/${country}`, request.url)
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/(fr|en)/:path*"],
};
