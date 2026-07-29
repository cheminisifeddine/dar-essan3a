export const runtime = "edge";

import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { getProductById, updateProduct, deleteProduct } from "@/lib/db";

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const { authenticated } = await requireAdmin(request);
  if (!authenticated) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }
  try {
    const product = await getProductById(params.id);
    if (!product) {
      return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, product });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const { authenticated } = await requireAdmin(request);
  if (!authenticated) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = await request.json();
    const update: any = {};
    if (body.slug !== undefined) update.slug = body.slug;
    if (body.name !== undefined) update.name = body.name;
    if (body.hook !== undefined) update.hook = body.hook;
    if (body.description !== undefined) update.description = body.description;
    if (body.price !== undefined) update.price = Number(body.price);
    if (body.old_price !== undefined) update.old_price = Number(body.old_price);
    if (body.bullets !== undefined) update.bullets = Array.isArray(body.bullets) ? body.bullets : [];
    if (body.images !== undefined) update.images = Array.isArray(body.images) ? body.images : [];
    if (body.active !== undefined) update.active = body.active ? 1 : 0;
    if (body.sort_order !== undefined) update.sort_order = Number(body.sort_order);
    await updateProduct(params.id, update);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const { authenticated } = await requireAdmin(request);
  if (!authenticated) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }
  try {
    await deleteProduct(params.id);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
