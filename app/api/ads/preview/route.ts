export const runtime = "edge";
import { NextResponse } from "next/server";
import { getProductBySlug } from "@/lib/db";
import { generateAdCopy, productUrl } from "@/lib/fb-ads/copyTemplates";
import { buildCreativeBrief } from "@/lib/fb-ads/creativeBrief";

// POST /api/ads/preview { slug, store_subdomain?, budget_dzd? }
// Returns 3 AR variants + creative brief. No Meta call. Free.
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const slug = String(body.slug || "").trim();
    if (!slug) return NextResponse.json({ success: false, error: "slug required" }, { status: 400 });
    const p = await getProductBySlug(slug);
    if (!p) return NextResponse.json({ success: false, error: "product not found" }, { status: 404 });

    const input = {
      name: p.name, hook: p.hook, description: p.description,
      price: p.price, old_price: p.old_price, bullets: p.bullets,
      slug: p.slug, store_subdomain: String(body.store_subdomain || p.store_id || "main"),
    };
    const variants = generateAdCopy(input);
    const url = productUrl(input).replace("{{campaign_id}}", "preview").replace("{{ad_id}}", "preview");
    const brief = buildCreativeBrief(p.name, p.hook, p.price);

    return NextResponse.json({
      success: true,
      product: { slug: p.slug, name: p.name, price: p.price, image: p.images[0] || "" },
      product_url: url,
      variants,
      creative_brief: brief,
      next_step: "Seller replies in Discord: APPROVE v1 + budget (e.g. 1500 DZD/day) → agent publishes PAUSED then ACTIVATES on confirm.",
    });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}
