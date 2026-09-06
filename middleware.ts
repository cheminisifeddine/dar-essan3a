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
  const url = request.nextUrl.clone();
  const host = request.headers.get("host") || "";

  // Explicit ?store= wins (preview links); otherwise resolve from host.
  const explicit = url.searchParams.get("store");
  let subdomain = explicit ? explicit.toLowerCase().trim() : extractSubdomain(host);
  if (!subdomain) subdomain = "main";

  // Clone headers and inject resolved subdomain (API routes read this)
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-store-subdomain", subdomain);

  // SSR first-paint: server components cannot read request headers without
  // next/headers, so expose the host-derived store via the URL for page
  // rendering. Rewrite keeps the browser URL unchanged while searchParams
  // seen by the server include ?store=<subdomain>.
  const isApi = url.pathname.startsWith("/api/");
  const isAdmin = url.pathname.startsWith("/admin");
  if (!explicit && subdomain !== "main" && !isApi && !isAdmin) {
    url.searchParams.set("store", subdomain);
    const response = NextResponse.rewrite(url, {
      request: {
        headers: requestHeaders,
      },
    });
    response.cookies.set("store_subdomain", subdomain, {
      path: "/",
      sameSite: "lax",
    });
    return response;
  }

  // Pass down the request with modified headers
  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  // Also set cookie so client-side navigation can remember active store if visited directly
  if (subdomain !== "main") {
    response.cookies.set("store_subdomain", subdomain, {
      path: "/",
      sameSite: "lax",
    });
  }

  return response;
}
