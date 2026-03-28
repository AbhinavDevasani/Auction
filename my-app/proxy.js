import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ req, token }) => {
        const pathname = req.nextUrl.pathname;
        const isProtected =
          pathname.startsWith("/dashboard") ||
          pathname.startsWith("/activebids") ||
          pathname.startsWith("/saved") ||
          pathname.startsWith("/sell") ||
          pathname.startsWith("/mylistings") ||
          pathname.startsWith("/search") ||
          (pathname.startsWith("/auction/") && pathname !== "/auction");
        
        if (isProtected) {
          return !!token;
        }
        return true;
      },
    },
    pages: {
      signIn: "/signin",
    },
  }
);

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/activebids/:path*",
    "/saved/:path*",
    "/sell/:path*",
    "/search/:path*",
    "/auction/:path*",
    "/mylistings/:path*",
  ],
};
