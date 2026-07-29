export const runtime = "edge";

import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { getSetting } from "@/lib/db";

export async function POST(request: Request) {
  const { authenticated } = await requireAdmin(request);
  if (!authenticated) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    if (!file) {
      return NextResponse.json({ success: false, error: "No file" }, { status: 400 });
    }

    const allowedTypes = ["image/webp", "image/jpeg", "image/png", "image/jpg"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ success: false, error: "Invalid file type" }, { status: 400 });
    }
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ success: false, error: "File too large (max 5MB)" }, { status: 400 });
    }

    const bucket = (process.env as any).PRODUCT_IMAGES as any;
    if (!bucket) {
      return NextResponse.json({ success: false, error: "R2 binding not found" }, { status: 500 });
    }

    const slug = (formData.get("slug") as string) || "uploads";
    const ext = file.type === "image/webp" ? "webp" : file.type === "image/png" ? "png" : "jpg";
    const key = `products/${slug}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
    const arrayBuffer = await file.arrayBuffer();

    await bucket.put(key, arrayBuffer, {
      httpMetadata: { contentType: file.type },
    });

    const r2PublicBase = await getSetting("r2_public_url", "https://pub-ecabff8d21801908882cdb68b6fb1363.r2.dev");
    const url = `${r2PublicBase}/${key}`;

    return NextResponse.json({ success: true, url, key });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
