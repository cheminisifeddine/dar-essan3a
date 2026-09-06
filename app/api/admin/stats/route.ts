export const runtime = "edge";

import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { getStats } from "@/lib/db";

export async function GET(request: Request) {
  const { authenticated } = await requireAdmin(request);
  if (!authenticated) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }
  try {
    const url = new URL(request.url);
    const store = url.searchParams.get("store") || url.searchParams.get("store_id") || undefined;
    const stats = await getStats(store);
    return NextResponse.json({ success: true, stats });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
