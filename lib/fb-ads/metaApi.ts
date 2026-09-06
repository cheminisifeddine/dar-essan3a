// Dar el Sanaa — Meta Marketing API wrapper (Graph v21.0)
// Seller never touches Ads Manager. All calls go through this file.
// Required settings keys (in D1 `settings` table or env):
//   META_ACCESS_TOKEN (System User, perms: ads_management, ads_read, business_management)
//   META_AD_ACCOUNT_ID (e.g. act_123...)
//   META_PAGE_ID
//   META_PIXEL_ID (default 1459121952706477)

const BASE = "https://graph.facebook.com/v21.0";

async function metaPOST(path: string, token: string, params: Record<string, string>) {
  const body = new URLSearchParams({ ...params, access_token: token });
  const r = await fetch(`${BASE}${path}`, { method: "POST", body });
  const j = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(`Meta POST ${path}: ${r.status} ${JSON.stringify(j).slice(0, 800)}`);
  return j as any;
}

async function metaGET(path: string, token: string, params: Record<string, string>) {
  const q = new URLSearchParams({ ...params, access_token: token }).toString();
  const r = await fetch(`${BASE}${path}?${q}`);
  const j = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(`Meta GET ${path}: ${r.status} ${JSON.stringify(j).slice(0, 800)}`);
  return j as any;
}

export type PublishInput = {
  product_slug: string;
  product_name: string;
  product_url: string;
  image_url: string; // public R2 / darelsanaa.com URL
  primary_text: string;
  headline: string;
  description: string;
  cta?: string;
  daily_budget_dzd: number;
  // Algeria COD defaults
  age_min?: number;
  age_max?: number;
};

const DZD_TO_USD = 1 / 135; // rough; Meta bills in account currency — we pass DZD*1000? No: amount in account currency cents.

export async function publishFullFunnel(cfg: { token: string; adAccount: string; pageId: string; pixelId: string }, inp: PublishInput) {
  const { token, adAccount, pageId, pixelId } = cfg;
  const act = adAccount.startsWith("act_") ? adAccount : `act_${adAccount}`;

  // 1) Campaign — SALES, CAPI + Pixel optimized for Purchase
  const camp: any = await metaPOST(`/${act}/campaigns`, token, {
    name: `DSN - ${inp.product_slug} - ${new Date().toISOString().slice(0, 10)}`,
    objective: "OUTCOME_SALES",
    status: "PAUSED", // seller approves → we activate
    special_ad_categories: "[]",
  });

  // 2) AdSet — Algeria, 18-65+, Advantage placements, COD broad
  const targeting = JSON.stringify({
    geo_locations: { countries: ["DZ"] },
    age_min: inp.age_min ?? 18,
    age_max: inp.age_max ?? 65,
    facebook_positions: ["feed", "reels", "story", "marketplace"],
    instagram_positions: ["stream", "reels", "story"],
    device_platforms: ["mobile"],
  });
  const adset: any = await metaPOST(`/${act}/adsets`, token, {
    name: `DSN - ${inp.product_slug} - DZ Broad`,
    campaign_id: camp.id,
    daily_budget: String(Math.round(inp.daily_budget_dzd * 100)), // if account in DZD cents; adjust if USD
    billing_event: "IMPRESSIONS",
    optimization_goal: "OFFSITE_CONVERSIONS",
    bid_strategy: "LOWEST_COST_WITHOUT_CAP",
    targeting,
    promoted_object: JSON.stringify({ pixel_id: pixelId, custom_event_type: "PURCHASE" }),
    status: "PAUSED",
  });

  // 3) Creative — link_data with image
  const story = JSON.stringify({
    page_id: pageId,
    link_data: {
      message: inp.primary_text,
      link: inp.product_url,
      name: inp.headline,
      description: inp.description,
      image_hash: undefined as any, // set below if uploading by hash
      call_to_action: { type: inp.cta || "SHOP_NOW" },
      picture: inp.image_url, // for URL-based creative
    },
  });
  const creative: any = await metaPOST(`/${act}/adcreatives`, token, {
    name: `DSN - ${inp.product_slug} creative`,
    object_story_spec: story,
  });

  // 4) Ad
  const ad: any = await metaPOST(`/${act}/ads`, token, {
    name: `DSN - ${inp.product_slug} - ad1`,
    adset_id: adset.id,
    creative: JSON.stringify({ creative_id: creative.id }),
    status: "PAUSED",
  });

  return { campaign_id: camp.id, adset_id: adset.id, creative_id: creative.id, ad_id: ad.id };
}

export async function setStatus(token: string, objectId: string, status: "ACTIVE" | "PAUSED" | "ARCHIVED") {
  // works for campaign / adset / ad
  return metaPOST(`/${objectId}`, token, { status });
}

export async function getInsights(token: string, objectId: string, days = 7) {
  return metaGET(`/${objectId}/insights`, token, {
    fields: "spend,impressions,clicks,ctr,cpc,cpm,actions,action_values,roas",
    "date_preset": `last_${days}d`,
  });
}

export function getMetaConfig(env: Record<string, string | undefined>, settings: Record<string, string>) {
  const token = settings["META_ACCESS_TOKEN"] || env["META_ACCESS_TOKEN"] || "";
  const adAccount = settings["META_AD_ACCOUNT_ID"] || env["META_AD_ACCOUNT_ID"] || "";
  const pageId = settings["META_PAGE_ID"] || env["META_PAGE_ID"] || "61592694953321";
  const pixelId = settings["META_PIXEL_ID"] || env["META_PIXEL_ID"] || "1459121952706477";
  if (!token || !adAccount) throw new Error("Missing META_ACCESS_TOKEN / META_AD_ACCOUNT_ID — add in Admin → Settings");
  return { token, adAccount, pageId, pixelId };
}
