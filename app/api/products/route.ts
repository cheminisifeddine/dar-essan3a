export const runtime = "edge";

import { NextResponse } from "next/server";
import { listProducts, getProductBySlug } from "@/lib/db";

export async function GET(request: Request) {
  try {
    const products = await listProducts(true);
    return NextResponse.json({ success: true, products });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
