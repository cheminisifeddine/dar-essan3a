// Dar el Sanaa — FB Ads copy engine
// Generates 3 COD-optimized variants per product (AR Darija + FR mix)
// No Ads Manager jargon. Seller only picks product + budget.

export type ProductInput = {
  name: string;
  hook: string;
  description: string;
  price: number;
  old_price?: number;
  bullets: string[];
  slug: string;
  store_subdomain?: string;
};

export type AdVariant = {
  id: string; // v1 | v2 | v3
  angle: string;
  primary_text: string;
  headline: string;
  description: string;
  cta: string;
};

const SITE = "https://darelsanaa.com";

export function productUrl(p: ProductInput): string {
  const base =
    p.store_subdomain && p.store_subdomain !== "main"
      ? `https://${p.store_subdomain}.darelsanaa.com`
      : SITE;
  return `${base}/p/${p.slug}?utm_source=facebook&utm_medium=cpc&utm_campaign=auto_{{campaign_id}}&utm_content={{ad_id}}`;
}

export function generateAdCopy(p: ProductInput): AdVariant[] {
  const discount = p.old_price && p.old_price > p.price
    ? ` (بدل ${p.old_price} دج، الآن ${p.price} دج)`
    : ` — ${p.price} دج`;
  const bullets = p.bullets.slice(0, 3).map((b) => `✅ ${b}`).join("\n");
  const url_note = `اطلب الآن والدفع عند الاستلام 💵 — التوصيل لـ 58 ولاية 🚚`;

  return [
    {
      id: "v1",
      angle: "problem_agitate_solve",
      primary_text:
        `${p.hook}؟\n${p.name} من بوسعادة — صناعة يدوية 100% 🤲\n\n${bullets}\n\n${p.description.slice(0, 160)}…\n${discount}\n${url_note}`,
      headline: `${p.name} — الدفع عند الاستلام`,
      description: `صناعة بوسعادة الأصيلة · توصيل 58 ولاية`,
      cta: "SHOP_NOW",
    },
    {
      id: "v2",
      angle: "social_proof_craft",
      primary_text:
        `علاش كامل يحبو ${p.name}؟\nلأنها مخدومة باليد، قطعة بقطعة، من حرفيين بوسعادة — ماشي سلعة مصنع.\n\n${bullets}\n${discount}\n${url_note}`,
      headline: `أصلي من بوسعادة 🤲 — ${p.price} دج`,
      description: `كل قطعة فريدة · الكمية محدودة`,
      cta: "SHOP_NOW",
    },
    {
      id: "v3",
      angle: "offer_urgency",
      primary_text:
        `عرض اليوم فقط: ${p.name}${discount}\n${p.hook}\n\n${bullets}\nالدفع كاش كي توصلك السلعة. ما عجبتكش؟ ما تخلصش.\n${url_note}`,
      headline: `تخفيض اليوم — اطلب الآن`,
      description: `الدفع عند الاستلام · إرجاع سهل`,
      cta: "ORDER_NOW",
    },
  ];
}

// French version for FR-speaking buyers (Algiers/Oran/Annaba retargeting)
export function generateAdCopyFR(p: ProductInput): AdVariant[] {
  return generateAdCopy(p).map((v) => ({
    ...v,
    id: v.id + "_fr",
    primary_text:
      `${p.name} — fait main à Bou Saâda 🤲\n${p.hook}\n${p.price} DA · Paiement à la livraison 💵 · 58 wilayas 🚚\nCommandez maintenant.`,
    headline: `${p.name} — Paiement à la livraison`,
    description: `Artisanat authentique de Bou Saâda`,
  }));
}
