export const runtime = "edge";

import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { listProducts, createProduct } from "@/lib/db";

export async function GET(request: Request) {
  const { authenticated } = await requireAdmin(request);
  if (!authenticated) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }
  try {
    const products = await listProducts(false);
    return NextResponse.json({ success: true, products });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const { authenticated } = await requireAdmin(request);
  if (!authenticated) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = await request.json();
    const id = body.id || crypto.randomUUID();
    await createProduct({
      id,
      slug: body.slug,
      name: body.name,
      hook: body.hook || "",
      description: body.description || "",
      price: Number(body.price),
      old_price: Number(body.old_price || 0),
      bullets: Array.isArray(body.bullets) ? body.bullets : [],
      images: Array.isArray(body.images) ? body.images : [],
      active: body.active === false ? 0 : 1,
      sort_order: Number(body.sort_order || 0),
    });
    return NextResponse.json({ success: true, id });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
