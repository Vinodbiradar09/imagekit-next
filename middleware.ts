import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const token = req.nextauth.token;

    // Redirect authenticated users from home to allvideos
    if (pathname === "/" && token) {
      return NextResponse.redirect(new URL("/allvideos", req.url));
    }

    // Redirect authenticated users from login/register to allvideos
    if ((pathname === "/login" || pathname === "/register") && token) {
      return NextResponse.redirect(new URL("/allvideos", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized({ req, token }) {
        const { pathname } = req.nextUrl;

        // Always allow these paths
        if (
          pathname.startsWith("/api/auth") ||
          pathname === "/login" ||
          pathname === "/register" ||
          pathname === "/" ||
          pathname.startsWith("/_next") ||
          pathname.startsWith("/public") ||
          pathname === "/favicon.ico"
        ) {
          return true;
        }

        // Protect upload route - requires authentication
        if (pathname === "/upload") {
          return !!token;
        }

        // Allow allvideos for everyone
        if (pathname === "/allvideos") {
          return true;
        }

        // Allow API routes
        if (pathname.startsWith("/api/")) {
          return true;
        }

        // Default to allowing access
        return true;
      },
    },
  }
);

export const config = {
  matcher: [
    "/((?!api/auth|_next/static|_next/image|favicon.ico|public/).*)",
  ],
};