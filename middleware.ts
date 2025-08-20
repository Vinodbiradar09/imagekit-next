import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const token = req.nextauth.token;
    if (pathname === "/" && token) {
      return NextResponse.redirect(new URL("/allvideos", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized({ req, token }) {
        const { pathname } = req.nextUrl;

 
        if (
          pathname.startsWith("/api/auth") ||
          pathname === "/login" ||
          pathname === "/register" ||
          pathname === "/" ||
          pathname.startsWith("/_next") ||
          pathname.startsWith("/public")
        ) {
          return true;
        }

     
        if (pathname === "/allvideos" || pathname === "/upload") {
          return !!token;
        }

    
        if (pathname.startsWith("/api/video")) {
          return true;
        }

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