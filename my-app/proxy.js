import { NextResponse } from "next/server";
export default function proxy(request) {
  const token = request.cookies.get("token")?.value;
  const pathname = request.nextUrl.pathname;

  const isProtected =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/activebids") ||
    pathname.startsWith("/saved") ||
    pathname.startsWith("/sell") ||
    pathname.startsWith("/mylistings") ||
    pathname.startsWith("/search"); 

  const isAuctionDetail =
    pathname.startsWith("/auction/") && pathname !== "/auction";

  if ((isProtected || isAuctionDetail) && !token) {
    return NextResponse.redirect(new URL("/signin", request.url));
  }

  return NextResponse.next();
}

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