import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const { pathname } = req.nextUrl;

    if (token && pathname === "/login") {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    if (pathname === "/register") {
      if (!token) {
        return NextResponse.redirect(new URL("/login", req.url));
      }
      if (token.role !== "ADMIN") {
        return NextResponse.redirect(new URL("/dashboard", req.url));
      }
    }

    if (!token && pathname.startsWith("/dashboard")) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;
        
        if (pathname === "/login") {
          return true;
        }

        if (pathname === "/register") {
          return !!token;
        }
        
        return !!token;
      }
    },
    pages: {
      signIn: "/login"
    }
  }
);

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/profile/:path*",
    "/students/:path*",
    "/classrooms/:path*",
    "/attendance/:path*",
    "/reports/:path*",
    "/messages/:path*",
    "/announcements/:path*",
    "/login",
    "/register"
  ]
};