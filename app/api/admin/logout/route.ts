export const runtime = "edge";

import { NextResponse } from "next/server";
import { clearAdminSession, deleteAdminSession, getAdminSessionToken } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const token = getAdminSessionToken(request);
    if (token) await deleteAdminSession(token);
    const response = NextResponse.json({ success: true, message: "Logged out" });
    clearAdminSession(response);
    return response;
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
