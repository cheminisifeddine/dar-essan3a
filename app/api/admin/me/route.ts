export const runtime = "edge";

import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";

export async function GET(request: Request) {
  const { authenticated } = await requireAdmin(request);
  return NextResponse.json({ success: true, authenticated });
}
