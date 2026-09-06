export const runtime = "edge";

import { NextResponse } from "next/server";
import { listProducts } from "@/lib/db";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const storeParam =
      url.searchParams.get("store") ||
      url.searchParams.get("store_id") ||
      request.headers.get("x-store-subdomain");
    const products = await listProducts(true, storeParam || undefined);
    return NextResponse.json({ success: true, products });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
