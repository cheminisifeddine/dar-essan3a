import Image from "next/image";

export function Hero() {
  return (
    <section className="relative bg-cream overflow-hidden py-16 md:py-24">
      <div className="absolute inset-0 opacity-[0.04] pointer-events-none">
        {/* Subtle arch motif — CSS pattern */}
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            <pattern id="archPattern" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M10 20 L10 8 Q10 2 14 2 Q18 2 18 8 L18 20" fill="none" stroke="#1E3A2A" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100" height="100" fill="url(#archPattern)" />
        </svg>
      </div>

      <div className="container mx-auto px-4 text-center relative">
        <div className="w-20 h-20 mx-auto mb-6 relative rounded-full overflow-hidden border-2 border-gold/40 shadow-soft">
          <Image
            src="/images/logo.webp"
            alt="دار الصنعة"
            fill
            className="object-cover"
            priority
          />
        </div>

        <h2 className="font-amiri text-4xl md:text-6xl text-deepgreen mb-6 leading-tight">
          من بوسعادة… إلى بيتك
        </h2>
        <p className="font-tajawal text-lg md:text-xl text-muted max-w-2xl mx-auto mb-8 leading-relaxed">
          قطع تقليدية جزائرية أصيلة، تصنعها أيادي حرفيي بوسعادة — توصيل لكل ولايات الوطن، والدفع عند الاستلام.
        </p>
        <a
          href="#products"
          className="inline-flex items-center gap-2 bg-gold text-deepgreen font-tajawal font-bold text-lg px-8 py-4 rounded-xl hover:bg-gold/90 transition-colors shadow-soft"
        >
          تسوّق المنتجات
          <span>↓</span>
        </a>
      </div>
    </section>
  );
}

export default Hero;
