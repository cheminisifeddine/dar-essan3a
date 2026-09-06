import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { extractSubdomain } from "./lib/store";

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images/ (public images)
     */
    "/((?!_next/static|_next/image|favicon.ico|images/).*)",
  ],
};

export function middleware(request: NextRequest) {
  const url = request.nextUrl;
  const host = request.headers.get("host") || "";

  // Check if store is explicitly requested via query parameter (e.g. ?store=sante)
  let subdomain = url.searchParams.get("store");

  if (!subdomain) {
    subdomain = extractSubdomain(host);
  } else {
    subdomain = subdomain.toLowerCase().trim();
  }

  // Clone headers and inject resolved subdomain
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-store-subdomain", subdomain || "main");

  // Pass down the request with modified headers
  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  // Also set cookie so client-side navigation can remember active store if visited directly
  if (subdomain && subdomain !== "main") {
    response.cookies.set("store_subdomain", subdomain, {
      path: "/",
      sameSite: "lax",
    });
  }

  return response;
}
