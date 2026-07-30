export const runtime = "edge";

import { NextResponse } from "next/server";
import { verifyPassword, generateToken, createAdminSession, setAdminSession } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const { password } = await request.json();
    if (!password) {
      return NextResponse.json({ success: false, error: "Password required" }, { status: 400 });
    }
    const valid = await verifyPassword(password);
    if (!valid) {
      return NextResponse.json({ success: false, error: "Invalid password" }, { status: 401 });
    }
    const token = generateToken();
    await createAdminSession(token);
    const response = NextResponse.json({ success: true, message: "Logged in" });
    setAdminSession(response, token);
    return response;
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
