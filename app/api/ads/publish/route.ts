export const runtime = "edge";
import { NextResponse } from "next/server";
import { getProductBySlug, getSetting } from "@/lib/db";
import { generateAdCopy, productUrl } from "@/lib/fb-ads/copyTemplates";
import { publishFullFunnel, getMetaConfig } from "@/lib/fb-ads/metaApi";

// POST /api/ads/publish { slug, variant_id?, image_url?, daily_budget_dzd?, store_subdomain? }
// Creates Campaign/AdSet/Creative/Ad PAUSED, logs to fb_ads table, returns IDs.
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const slug = String(body.slug || "").trim();
    const variantId = String(body.variant_id || "v1");
    const budget = Number(body.daily_budget_dzd || 1000);
    if (!slug) return NextResponse.json({ success: false, error: "slug required" }, { status: 400 });
    if (budget < 500) return NextResponse.json({ success: false, error: "min budget 500 DZD/day" }, { status: 400 });

    const p: any = await getProductBySlug(slug);
    if (!p) return NextResponse.json({ success: false, error: "product not found" }, { status: 404 });

    const input = {
      name: p.name, hook: p.hook, description: p.description,
      price: Number(p.price), old_price: Number(p.old_price), bullets: p.bullets,
      slug: p.slug, store_subdomain: String(body.store_subdomain || p.store_id || "main"),
    };
    const variants = generateAdCopy(input);
    const v = variants.find((x) => x.id === variantId) || variants[0];
    const imageUrl = String(body.image_url || (Array.isArray(p.images) ? p.images[0] : ""));
    if (!imageUrl) return NextResponse.json({ success: false, error: "image_url required (upload product photo first)" }, { status: 400 });

    const absImage = imageUrl.startsWith("http") ? imageUrl : `https://darelsanaa.com${imageUrl}`;
    const url = productUrl(input);

    const settings: Record<string, string> = {
      META_ACCESS_TOKEN: await getSetting("META_ACCESS_TOKEN"),
      META_AD_ACCOUNT_ID: await getSetting("META_AD_ACCOUNT_ID"),
      META_PAGE_ID: await getSetting("META_PAGE_ID"),
      META_PIXEL_ID: await getSetting("META_PIXEL_ID"),
    };
    const cfg = getMetaConfig(process.env as any, settings);

    const out = await publishFullFunnel(cfg, {
      product_slug: p.slug,
      product_name: p.name,
      product_url: url.replace("{{campaign_id}}", "auto").replace("{{ad_id}}", "auto"),
      image_url: absImage,
      primary_text: v.primary_text,
      headline: v.headline,
      description: v.description,
      cta: (v as any).cta || "SHOP_NOW",
      daily_budget_dzd: budget,
    });

    // log to D1 (best-effort; table created by 0004_ads.sql)
    try {
      const db: any = (process.env as any).DB;
      const id = `ad_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
      await db.prepare(
        `INSERT INTO fb_ads (id, store_id, product_slug, product_name, variant_id, primary_text, headline, image_url, product_url, meta_campaign_id, meta_adset_id, meta_ad_id, meta_creative_id, daily_budget_dzd, status)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'PENDING_APPROVAL')`
      ).bind(id, input.store_subdomain, p.slug, p.name, v.id, v.primary_text, v.headline, absImage, url, out.campaign_id, out.adset_id, out.ad_id, out.creative_id, budget).run();
    } catch {}

    return NextResponse.json({
      success: true,
      variant: v,
      ...out,
      status: "PAUSED (awaiting seller APPROVE to go ACTIVE)",
      activate_hint: "POST /api/ads/manage { action:'activate', ad_id/campaign_id } or say ACTIVATE in Discord",
    });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}
