import { Store } from "@/lib/db";

export function BrandStory({ store }: { store?: Partial<Store> | null }) {
  const isNatural = !!store?.subdomain && store.subdomain !== "main";

  if (isNatural) {
    return (
      <section className="bg-deepgreen py-16 md:py-24 text-cream">
        <div className="container mx-auto px-4 text-center">
          <div className="section-divider text-gold/60 mb-4">
            <span className="text-gold text-xl">✦</span>
          </div>
          <h2 className="font-amiri text-3xl md:text-4xl text-gold mb-6">
            من الجزائر… للجزائريين 🇩🇿
          </h2>
          <p className="font-tajawal text-lg md:text-xl leading-relaxed max-w-3xl mx-auto text-cream/90">
            {store?.description ||
              "وصفات طبيعية مختارة بعناية، مصممة لتدعم صحتك وهدفك كل يوم — مكونات طبيعية، جودة مضمونة، وتوصيل سريع لباب دارك."}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 mt-8 font-tajawal text-sm">
            <span className="bg-gold/15 text-gold px-4 py-2 rounded-full font-bold">🌿 مكونات طبيعية</span>
            <span className="bg-gold/15 text-gold px-4 py-2 rounded-full font-bold">📦 توصيل 58 ولاية</span>
            <span className="bg-gold/15 text-gold px-4 py-2 rounded-full font-bold">💵 الدفع عند الاستلام</span>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-deepgreen py-16 md:py-24 text-cream">
      <div className="container mx-auto px-4 text-center">
        <div className="section-divider text-gold/60 mb-4">
          <span className="text-gold text-xl">✦</span>
        </div>
        <h2 className="font-amiri text-3xl md:text-4xl text-gold mb-6">حكاية دار الصنعة</h2>
        <p className="font-tajawal text-lg md:text-xl leading-relaxed max-w-3xl mx-auto text-cream/90">
          من قلب بوسعادة، مدينة السعادة والحرفيين، نجمع لكم أصدق ما تصنعه الأيادي الجزائرية: نسيج النخيل، الفخار، النحاس، والريشة. كل قطعة في دار الصنعة تحمل روح حرفيّ وذاكرة تراث — لا قطعتين متطابقتين، لأن الأصالة لا تُستنسخ.
        </p>
      </div>
    </section>
  );
}

export default BrandStory;
