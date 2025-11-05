export { default } from "next-auth/middleware";

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/profile/:path*",
    "/students/:path*",
    "/classrooms/:path*",
    "/attendance/:path*",
    "/reports/:path*",
    "/messages/:path*",
    "/announcements/:path*"
  ]
};