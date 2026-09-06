export const runtime = "edge";
import { NextResponse } from "next/server";
import { getSetting } from "@/lib/db";
import { getInsights } from "@/lib/fb-ads/metaApi";

// GET /api/ads/insights?id=<campaign|adset|ad_id>&days=7
// Returns spend/CTR/CPC/ROAS in plain seller language.
export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get("id") || "";
    const days = Number(url.searchParams.get("days") || 7);
    if (!id) return NextResponse.json({ success: false, error: "id required" }, { status: 400 });
    const token = (await getSetting("META_ACCESS_TOKEN")) || (process.env as any).META_ACCESS_TOKEN;
    if (!token) return NextResponse.json({ success: false, error: "Missing META_ACCESS_TOKEN" }, { status: 400 });
    const raw: any = await getInsights(token, id, days);
    const row = raw?.data?.[0] || {};
    const spend = Number(row.spend || 0);
    const ctr = Number(row.ctr || 0);
    const cpc = Number(row.cpc || 0);
    let verdict = "⏸️ لا توجد بيانات كافية بعد — انتظر 48h";
    if (spend > 0 && ctr < 0.8) verdict = "🔴 CTR ضعيف (<0.8%) — بدّل الصورة/الخطاف";
    else if (spend > 0 && ctr >= 1.5) verdict = "🟢 ممتاز — زيد الميزانية 30%";
    else if (spend > 0) verdict = "🟡 متوسط — اختبر variant جديد";
    return NextResponse.json({ success: true, raw: row, seller_summary: { spend, ctr, cpc, verdict } });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}
