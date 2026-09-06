export const runtime = "edge";

import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { getStoreById, updateStore, deleteStore, getStoreBySubdomain, listStores } from "@/lib/db";
import { validateSubdomain } from "@/lib/store";

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const { authenticated } = await requireAdmin(request);
  if (!authenticated) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }
  try {
    const store = await getStoreById(params.id);
    if (!store) {
      return NextResponse.json({ success: false, error: "المتجر غير موجود" }, { status: 404 });
    }
    return NextResponse.json({ success: true, store });
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
    const existing = await getStoreById(params.id);
    if (!existing) {
      return NextResponse.json({ success: false, error: "المتجر غير موجود" }, { status: 404 });
    }

    if (body.subdomain !== undefined) {
      const cleanSub = (body.subdomain || "").toLowerCase().trim();
      if (cleanSub !== existing.subdomain) {
        const val = validateSubdomain(cleanSub);
        if (!val.valid) {
          return NextResponse.json({ success: false, error: val.error }, { status: 400 });
        }
        const checkConflict = await getStoreBySubdomain(cleanSub);
        if (checkConflict && checkConflict.id !== params.id) {
          return NextResponse.json(
            { success: false, error: `النطاق الفرعي '${cleanSub}' محجوز لمتجر آخر` },
            { status: 400 }
          );
        }
      }
    }

    if (body.name !== undefined) {
      const cleanName = String(body.name || "").trim();
      if (cleanName && cleanName.toLowerCase() !== existing.name.trim().toLowerCase()) {
        const all = await listStores(false);
        const taken = all.some(
          (s) => s.id !== params.id && s.name.trim().toLowerCase() === cleanName.toLowerCase()
        );
        if (taken) {
          return NextResponse.json(
            { success: false, error: `اسم المتجر '${cleanName}' مستخدم بالفعل — اختر اسماً فريداً` },
            { status: 400 }
          );
        }
      }
    }

    await updateStore(params.id, {
      ...body,
      home_delivery_fee: body.home_delivery_fee !== undefined ? Number(body.home_delivery_fee) : undefined,
      stopdesk_fee: body.stopdesk_fee !== undefined ? Number(body.stopdesk_fee) : undefined,
      free_shipping_threshold: body.free_shipping_threshold !== undefined ? Number(body.free_shipping_threshold) : undefined,
      active: body.active !== undefined ? (body.active ? 1 : 0) : undefined,
    });

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
    if (params.id === "main") {
      return NextResponse.json({ success: false, error: "لا يمكن حذف المتجر الرئيسي" }, { status: 400 });
    }
    await deleteStore(params.id);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
