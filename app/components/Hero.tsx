import Image from "next/image";
import { Store } from "@/lib/db";

export function Hero({ store }: { store?: Partial<Store> | null }) {
  const heroTitle = store?.hero_title || "من بوسعادة… إلى بيتك";
  const heroSubtitle =
    store?.hero_subtitle ||
    "قطع تقليدية جزائرية أصيلة، تصنعها أيادي حرفيي بوسعادة — توصيل لكل ولايات الوطن، والدفع عند الاستلام.";
  const storeName = store?.name || "دار الصنعة";
  const isCustomStore = store?.subdomain && store?.subdomain !== "main";

  return (
    <section className="relative bg-cream overflow-hidden py-16 md:py-24">
      <div className="absolute inset-0 opacity-[0.04] pointer-events-none">
        {/* Subtle arch motif — CSS pattern */}
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            <pattern id="archPattern" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M10 20 L10 8 Q10 2 14 2 Q18 2 18 8 L18 20" fill="none" stroke="currentColor" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100" height="100" fill="url(#archPattern)" />
        </svg>
      </div>

      <div className="container mx-auto px-4 text-center relative">
        <div className="w-20 h-20 mx-auto mb-6 relative rounded-full overflow-hidden border-2 border-gold/40 shadow-soft">
          <Image
            src={store?.logo_url || "/images/logo.webp"}
            alt={storeName}
            fill
            className="object-cover"
            priority
          />
        </div>

        {isCustomStore && (
          <div className="mb-4">
            <span className="inline-block bg-deepgreen/10 text-deepgreen text-xs font-mono font-bold px-3 py-1 rounded-full" dir="ltr">
              {store.subdomain}.darelsanaa.com
            </span>
          </div>
        )}

        <h2 className="font-amiri text-4xl md:text-6xl text-deepgreen mb-6 leading-tight max-w-3xl mx-auto">
          {heroTitle}
        </h2>
        <p className="font-tajawal text-lg md:text-xl text-ink/80 max-w-2xl mx-auto mb-8 leading-relaxed">
          {heroSubtitle}
        </p>
        <a
          href="#products"
          className="inline-flex items-center gap-2 bg-gold text-deepgreen font-tajawal font-bold text-lg px-8 py-4 rounded-xl hover:bg-gold/90 transition-colors shadow-soft"
        >
          تسوّق منتجات المتجر
          <span>↓</span>
        </a>
      </div>
    </section>
  );
}

export default Hero;
