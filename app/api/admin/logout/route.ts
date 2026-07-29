export const runtime = "edge";

import { NextResponse } from "next/server";
import { requireAdmin, clearAdminSession, deleteAdminSession, getAdminSessionToken } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const token = getAdminSessionToken();
    if (token) await deleteAdminSession(token);
    clearAdminSession();
    return NextResponse.json({ success: true, message: "Logged out" });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
