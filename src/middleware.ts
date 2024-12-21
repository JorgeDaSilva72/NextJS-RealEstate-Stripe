import { withAuth } from "@kinde-oss/kinde-auth-nextjs/middleware";

// export default function middleware(req: any) {
//   return withAuth(req);
// }

export default function middleware(req: any) {
  console.log("Middleware request:", req);
  try {
    return withAuth(req);
  } catch (error) {
    console.error("Middleware error:", error);
    return new Response("Authentication failed", { status: 401 });
  }
}

export const config = {
  matcher: ["/user/:path*"],
};
