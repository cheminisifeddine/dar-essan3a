export const runtime = "edge";

import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { listStores, createStore, getStoreBySubdomain } from "@/lib/db";
import { validateSubdomain } from "@/lib/store";

export async function GET(request: Request) {
  const { authenticated } = await requireAdmin(request);
  if (!authenticated) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }
  try {
    const stores = await listStores(false);
    return NextResponse.json({ success: true, stores });
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

    if (!body.name || !body.name.trim()) {
      return NextResponse.json({ success: false, error: "اسم المتجر مطلوب" }, { status: 400 });
    }

    const rawSubdomain = (body.subdomain || "").toLowerCase().trim();
    const validation = validateSubdomain(rawSubdomain);
    if (!validation.valid) {
      return NextResponse.json({ success: false, error: validation.error }, { status: 400 });
    }

    // Check if subdomain already taken
    const existing = await getStoreBySubdomain(rawSubdomain);
    if (existing) {
      return NextResponse.json(
        { success: false, error: `النطاق الفرعي '${rawSubdomain}' محجوز بالفعل` },
        { status: 400 }
      );
    }

    // Check if name already taken (unique name requirement)
    const { listStores: _listAll } = await import("@/lib/db");
    const allStores = await _listAll(false);
    const nameTaken = allStores.some(
      (s) => s.name.trim().toLowerCase() === body.name.trim().toLowerCase()
    );
    if (nameTaken) {
      return NextResponse.json(
        { success: false, error: `اسم المتجر '${body.name.trim()}' مستخدم بالفعل — اختر اسماً فريداً` },
        { status: 400 }
      );
    }

    const id = body.id || (rawSubdomain === "main" ? "main" : `store_${rawSubdomain}_${Date.now()}`);

    await createStore({
      id,
      name: body.name.trim(),
      subdomain: rawSubdomain,
      domain: rawSubdomain === "main" ? "darelsanaa.com" : `${rawSubdomain}.darelsanaa.com`,
      text_color: body.text_color || "#241F18",
      primary_color: body.primary_color || "#1E3A2A",
      secondary_color: body.secondary_color || "#C19A3D",
      bg_color: body.bg_color || "#F7F2E9",
      hero_title: body.hero_title || "",
      hero_subtitle: body.hero_subtitle || "",
      announcement_bar: body.announcement_bar || "",
      description: body.description || "",
      logo_url: body.logo_url || "",
      whatsapp_number: body.whatsapp_number || "213558522110",
      fb_page: body.fb_page || "",
      pixel_id: body.pixel_id || "1459121952706477",
      currency: body.currency || "دج",
      home_delivery_fee: Number(body.home_delivery_fee ?? 500),
      stopdesk_fee: Number(body.stopdesk_fee ?? 350),
      free_shipping_threshold: Number(body.free_shipping_threshold ?? 6000),
      meta_title: body.meta_title || `${body.name} — دار الصنعة`,
      meta_description: body.meta_description || body.description || "",
      active: body.active === false ? 0 : 1,
    });

    return NextResponse.json({ success: true, id, subdomain: rawSubdomain });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
