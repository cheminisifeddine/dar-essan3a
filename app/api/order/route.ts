import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    // Stub: in the future this will forward to a Google Apps Script webhook.
    // For now, the order is sent directly via WhatsApp on the client side.
    console.log("Order received (stub):", body);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
}

export async function GET() {
  return NextResponse.json({ ok: true, message: "Order stub endpoint" });
}
