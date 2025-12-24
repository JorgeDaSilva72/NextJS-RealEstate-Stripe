// import { withAuth } from "@kinde-oss/kinde-auth-nextjs/middleware";
// export default function middleware(req: any) {
//   return withAuth(req);
// }
// export const config = {
//   matcher: ["/user/:path*"],
// };
// middleware.ts
// i18n/routing.ts

// import { NextResponse } from "next/server";
// import { withAuth } from "@kinde-oss/kinde-auth-nextjs/middleware";
// import createIntlMiddleware from "next-intl/middleware";
// import { routing } from "./i18n/routing";

// // Middleware d'internationalisation
// const intlMiddleware = createIntlMiddleware(routing);

// export default async function middleware(req: any) {
//   const pathname = req.nextUrl.pathname;

//   // Routes qui nécessitent une authentification
//   if (pathname.includes("/user")) {
//     return withAuth(req);
//   }

//   // Pour toutes les autres routes, appliquer l'internationalisation
//   return intlMiddleware(req);
// }

// // Configuration des routes
// export const config = {
//   matcher: [
//     // Routes protégées par auth
//     "/user/:path*",
//     // Routes internationalisées
//     "/",
//     "/(fr|en)/:path*",
//   ],
// };

// Recommended middleware configuration
// import { NextResponse } from "next/server";
// import { withAuth } from "@kinde-oss/kinde-auth-nextjs/middleware";
// import createIntlMiddleware from "next-intl/middleware";
// import { routing } from "./i18n/routing";

// const intlMiddleware = createIntlMiddleware(routing);

// export default async function middleware(req: any) {
//   const pathname = req.nextUrl.pathname;

//   // Routes that require authentication
//   if (pathname.startsWith("/user")) {
//     const authResponse = await withAuth(req);

//     // If auth passes, apply internationalization
//     if (authResponse === null || authResponse.status === 200) {
//       return intlMiddleware(req);
//     }

//     return authResponse;
//   }

//   // Apply internationalization for all routes
//   return intlMiddleware(req);
// }

// export const config = {
//   matcher: [
//     // Ensure all routes are covered for internationalization
//     "/((?!api|_next/static|_next/image|favicon.ico).*)",
//   ],
// };

// import { NextResponse } from "next/server";
// import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
// import createIntlMiddleware from "next-intl/middleware";
// import { NextRequest } from "next/server";
// import { routing } from "./i18n/routing";

// const publicRoutes = [
//   "/",
//   "/buy",
//   "/exclusive-rentals",
//   "/faq",
//   "/furnished-rent",
//   "/property",
//   "/rent",
//   "/result",
//   "/seasonal-rent",
// ];

// // Create the next-intl middleware with the routing configuration
// const intlMiddleware = createIntlMiddleware(routing);

// export async function middleware(request: NextRequest) {
//   const { isAuthenticated } = getKindeServerSession();
//   const pathname = request.nextUrl.pathname;

//   // First, let next-intl handle the locale
//   const response = await intlMiddleware(request);

//   // Extract locale from path (it will be either 'fr' or 'en')
//   const locale = pathname.split("/")[1];

//   // Remove locale prefix for route checking
//   const pathnameWithoutLocale = pathname.replace(`/${locale}`, "");

//   // Check if the route needs authentication
//   const isPublicRoute = publicRoutes.some(
//     (route) =>
//       pathnameWithoutLocale === route ||
//       pathnameWithoutLocale.startsWith(route + "/")
//   );

//   if (!isPublicRoute) {
//     // For protected routes, check authentication
//     const authenticated = await isAuthenticated();

//     if (!authenticated) {
//       // Redirect to login while preserving the current locale
//       return NextResponse.redirect(new URL(`/${locale}/login`, request.url));
//     }
//   }

//   return response;
// }

// // Matcher updated to consider locale prefixes
// export const config = {
//   matcher: [
//     // Match all pathnames except for
//     // - /api (API routes)
//     // - /_next (Next.js internals)
//     // - /static (public files)
//     // - /_vercel (Vercel internals)
//     // - all root files inside /public (e.g. /favicon.ico)
//     "/((?!api|_next|_vercel|.*\\..*).*)",
//     // Match all pathnames within /fr and /en
//     "/(fr|en)/:path*",
//   ],
// };

// import { NextResponse } from "next/server";
// import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
// import createIntlMiddleware from "next-intl/middleware";
// import { NextRequest } from "next/server";
// import { routing } from "./i18n/routing";

// const publicRoutes = [
//   "/",
//   "/fr",
//   "/buy",
//   "/exclusive-rentals",
//   "/faq",
//   "/furnished-rent",
//   "/property",
//   "/rent",
//   "/result",
//   "/seasonal-rent",
// ];

// const intlMiddleware = createIntlMiddleware(routing);

// export async function middleware(request: NextRequest) {
//   const { isAuthenticated } = getKindeServerSession();
//   const pathname = request.nextUrl.pathname;

//   // Check if it's a protected route before applying intl middleware
//   const locale = pathname.split("/")[1];
//   const pathnameWithoutLocale = pathname.replace(`/${locale}`, "");

//   const isPublicRoute = publicRoutes.some(
//     (route) =>
//       pathnameWithoutLocale === route ||
//       pathnameWithoutLocale.startsWith(route + "/")
//   );

//   if (!isPublicRoute) {
//     const authenticated = await isAuthenticated();

//     if (!authenticated) {
//       // Create a new URL object based on the current request
//       const redirectUrl = new URL(request.url);
//       // Set the pathname to /login while preserving the locale
//       redirectUrl.pathname = `/${locale || routing.defaultLocale}/login`;

//       return NextResponse.redirect(redirectUrl);
//     }
//   }

//   // Apply the intl middleware last
//   return intlMiddleware(request);
// }

// export const config = {
//   matcher: [
//     // Skip all internal paths (_next)
//     // Skip all API routes (/api)
//     "/((?!api|_next|_vercel|.*\\..*).*)",
//     // Optional: Include specific paths
//     "/(fr|en)/:path*",
//   ],
// };

// import { NextResponse } from "next/server";
// import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
// import createIntlMiddleware from "next-intl/middleware";
// import { NextRequest } from "next/server";
// import { routing } from "./i18n/routing";

// // Définir les routes qui nécessitent une authentification
// const protectedRoutes = [
//   "/user",

//   // Ajoute d'autres routes protégées ici
// ];

// const intlMiddleware = createIntlMiddleware(routing);

// export async function middleware(request: NextRequest) {
//   const { isAuthenticated } = getKindeServerSession();
//   const pathname = request.nextUrl.pathname;

//   // Appliquer d'abord le middleware d'internationalisation
//   const response = await intlMiddleware(request);

//   // Extraire la locale et le chemin sans locale
//   const locale = pathname.split("/")[1];
//   const pathnameWithoutLocale = pathname.replace(`/${locale}`, "");

//   // Vérifier si c'est une route protégée
//   const isProtectedRoute = protectedRoutes.some((route) =>
//     pathnameWithoutLocale.startsWith(route)
//   );

//   if (isProtectedRoute) {
//     const authenticated = await isAuthenticated();

//     if (!authenticated) {
//       // Créer une nouvelle URL pour la redirection
//       const redirectUrl = new URL(request.url);
//       redirectUrl.pathname = `/${locale || routing.defaultLocale}/login`;

//       return NextResponse.redirect(redirectUrl);
//     }
//   }

//   // Pour toutes les autres routes, retourner la réponse du middleware d'internationalisation
//   return response;
// }

// export const config = {
//   matcher: ["/((?!api|_next|_vercel|.*\\..*).*)", "/(fr|en)/:path*"],
// };

// import createMiddleware from "next-intl/middleware";
// import { withAuth } from "@kinde-oss/kinde-auth-nextjs/middleware";
// import { NextResponse } from "next/server";

// // Configuration pour next-intl
// const nextIntlMiddleware = createMiddleware({
//   locales: ["fr", "en"],
//   defaultLocale: "fr",
// });

// // Middleware combiné
// export default async function middleware(request: any) {
//   const pathname = request.nextUrl.pathname;

//   // Vérifier si la route actuelle nécessite une authentification
//   if (pathname.startsWith("/user/")) {
//     // Appliquer l'authentification uniquement pour les routes /user/*
//     const authResult = await withAuth(request);
//     if (authResult instanceof NextResponse) {
//       return authResult;
//     }
//   }

//   // Appliquer next-intl pour toutes les routes
//   return nextIntlMiddleware(request);
// }

// // Configuration des routes où le middleware s'applique
// export const config = {
//   matcher: [
//     // Routes authentifiées
//     "/user/:path*",

//     // Routes pour next-intl (ne pas localiser les images et autres fichiers statiques)
//     "/((?!api|_next|_vercel|.*\\..*).*)",
//   ],
// };

import createMiddleware from "next-intl/middleware";
import { withAuth } from "@kinde-oss/kinde-auth-nextjs/middleware";
import { NextResponse, NextRequest } from "next/server";
import { routing } from "./i18n/routing";

// Internationalization middleware configuration
const nextIntlMiddleware = createMiddleware({
  locales: routing.locales,
  defaultLocale: routing.defaultLocale,
  localePrefix: "always",
});

// Combined middleware: i18n + auth, but NEVER touch /api routes
export default async function middleware(request: NextRequest) {
  let pathname = request.nextUrl.pathname;

  // 1) HARD SKIP: API, auth routes & internal paths must NEVER go through i18n/auth
  if (
    pathname.startsWith("/api") ||
    pathname.startsWith("/auth") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/_vercel") ||
    pathname.match(/\.[^/]+$/) // static files like /favicon.ico, *.png, etc.
  ) {
    return NextResponse.next();
  }

  // 2) Allow oauth2callback without locale/auth (Google redirect)
  if (pathname === "/oauth2callback" || pathname === "/oauth2callback/") {
    return NextResponse.next();
  }

  // 2.5) Fix duplicate locale in pathname (e.g., /fr/fr/result -> /fr/result or /ar/fr/user/properties -> /ar/user/properties)
  // This prevents redirects caused by malformed URLs
  // Match both same locale duplicates (/fr/fr/...) and different locale duplicates (/ar/fr/...)
  const duplicateLocaleMatch = pathname.match(/^\/([a-z]{2})\/([a-z]{2})(\/|$)/);
  if (duplicateLocaleMatch) {
    // Use the first locale (the one that should be there)
    const locale = duplicateLocaleMatch[1];
    const restOfPath = pathname.split('/').slice(3).filter(Boolean).join('/');
    const correctedPathname = `/${locale}${restOfPath ? '/' + restOfPath : ''}`;
    
    // Redirect to the corrected pathname with query params preserved
    const correctedUrl = new URL(request.url);
    correctedUrl.pathname = correctedPathname;
    // Preserve all query parameters from the original request
    return NextResponse.redirect(correctedUrl);
  }

  // 3) Auth only for /user/* routes (after skipping /api)
  if (pathname.includes("/user/")) {
    const authResult = await withAuth(request);
    if (authResult instanceof NextResponse) {
      return authResult;
    }
  }

  // 4) Apply next-intl for all other routes (pages)
  return nextIntlMiddleware(request);
}

// Matcher: do NOT match /api or /auth, only match normal page routes
export const config = {
  matcher: [
    // Authenticated user routes (pages)
    "/user/:path*",
    // i18n routes, excluding api/auth/oauth2callback/_next/_vercel/static (enforced again above)
    "/((?!api|auth|oauth2callback|_next|_vercel|.*\\..*).*)",
    "/(fr|en|pt|ar)/:path*",
  ],
};
