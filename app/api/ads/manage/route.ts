export const runtime = "edge";
import { NextResponse } from "next/server";
import { getSetting } from "@/lib/db";
import { setStatus, getMetaConfig } from "@/lib/fb-ads/metaApi";

// POST /api/ads/manage { action, campaign_id?, adset_id?, ad_id?, daily_budget_dzd? }
// action: activate | pause | kill | scale
// Seller language: شغّل / حبس / زيد الميزانية / احذف — agent maps here.
export async function POST(request: Request) {
  try {
    const b = await request.json();
    const action = String(b.action || "");
    const token = (await getSetting("META_ACCESS_TOKEN")) || (process.env as any).META_ACCESS_TOKEN;
    if (!token) return NextResponse.json({ success: false, error: "Missing META_ACCESS_TOKEN" }, { status: 400 });
    const cfg = getMetaConfig(process.env as any, {
      META_ACCESS_TOKEN: token,
      META_AD_ACCOUNT_ID: (await getSetting("META_AD_ACCOUNT_ID")) || "",
      META_PAGE_ID: "", META_PIXEL_ID: "",
    }).token;

    const id = b.ad_id || b.adset_id || b.campaign_id;
    if (!id && action !== "scale") return NextResponse.json({ success: false, error: "id required" }, { status: 400 });

    if (action === "activate") {
      if (b.campaign_id) await setStatus(cfg, b.campaign_id, "ACTIVE");
      if (b.adset_id) await setStatus(cfg, b.adset_id, "ACTIVE");
      if (b.ad_id) await setStatus(cfg, b.ad_id, "ACTIVE");
      return NextResponse.json({ success: true, status: "ACTIVE" });
    }
    if (action === "pause") {
      if (b.ad_id) await setStatus(cfg, b.ad_id, "PAUSED");
      else if (b.adset_id) await setStatus(cfg, b.adset_id, "PAUSED");
      else await setStatus(cfg, b.campaign_id, "PAUSED");
      return NextResponse.json({ success: true, status: "PAUSED" });
    }
    if (action === "kill") {
      if (b.ad_id) await setStatus(cfg, b.ad_id, "ARCHIVED");
      if (b.adset_id) await setStatus(cfg, b.adset_id, "ARCHIVED");
      if (b.campaign_id) await setStatus(cfg, b.campaign_id, "ARCHIVED");
      return NextResponse.json({ success: true, status: "ARCHIVED" });
    }
    if (action === "scale") {
      // scale = +30% budget on adset (Meta rule: duplicate best practice — here simple update)
      const adsetId = String(b.adset_id || "");
      const newBudget = Number(b.daily_budget_dzd || 0);
      if (!adsetId || !newBudget) return NextResponse.json({ success: false, error: "adset_id + daily_budget_dzd required" }, { status: 400 });
      const r = await fetch(`https://graph.facebook.com/v21.0/${adsetId}`, {
        method: "POST",
        body: new URLSearchParams({ daily_budget: String(Math.round(newBudget * 100)), access_token: cfg }),
      });
      const j = await r.json();
      return NextResponse.json({ success: r.ok, result: j });
    }
    return NextResponse.json({ success: false, error: "unknown action" }, { status: 400 });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}
