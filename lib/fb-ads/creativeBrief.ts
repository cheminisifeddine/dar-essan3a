// Dar el Sanaa — creative brief builder for FB Ads Expert
// Seller uploads 1 phone photo → agent outputs ready image prompt + checklist
// Image gen itself runs via Hermes image_gen / FAL, never fabricated stats.

export type CreativeBrief = {
  product_name: string;
  image_prompt: string;
  video_script_15s: string[];
  overlay_text: string[];
  do_not: string[];
};

export function buildCreativeBrief(productName: string, hook: string, price: number): CreativeBrief {
  return {
    product_name: productName,
    image_prompt:
      `UGC-style product photo, ${productName}, natural Algerian home light, ` +
      `hand holding / lifestyle context, warm earth tones (#F7F2E9 bg, #1E3A2A accent), ` +
      `square 1:1, no fake badges, no invented -50% sticker unless true. ` +
      `Hook overlay in Arabic: "${hook}". Price overlay: "${price} دج · الدفع عند الاستلام".`,
    video_script_15s: [
      `0-3s HOOK: close-up + "${hook}" (big Arabic captions)`,
      `3-10s DEMO: hands using product, 3 quick cuts, real texture`,
      `10-15s CTA: price + "الدفع عند الاستلام · 58 ولاية" + Shop Now arrow`,
    ],
    overlay_text: [
      `${hook}`,
      `${price} دج · الدفع عند الاستلام`,
      `صناعة بوسعادة 🤲`,
    ],
    do_not: [
      "No fake before/after",
      "No invented discounts or countdown timers",
      "No French-only text (AR primary, FR secondary)",
      "No stock photos that misrepresent handmade item",
    ],
  };
}
