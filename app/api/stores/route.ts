export const runtime = "edge";

import { NextResponse } from "next/server";
import { listStores, getStoreBySubdomain, getDefaultStore } from "@/lib/db";
import { extractSubdomain } from "@/lib/store";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const storeParam = url.searchParams.get("store");
    const subParam = url.searchParams.get("subdomain");
    const host = request.headers.get("host") || "";
    const headerSub = request.headers.get("x-store-subdomain");

    // If a specific store query was requested
    const targetSub = storeParam || subParam || headerSub || extractSubdomain(host);

    if (url.searchParams.get("single") === "true" || storeParam || subParam) {
      let store = null;
      if (targetSub) {
        store = await getStoreBySubdomain(targetSub);
      }
      if (!store) {
        store = await getDefaultStore();
      }
      return NextResponse.json({ success: true, store });
    }

    const stores = await listStores(true);
    return NextResponse.json({
      success: true,
      stores,
      currentSubdomain: targetSub || "main",
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
