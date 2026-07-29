import type { Metadata } from "next";
import Image from "next/image";
import Header from "../components/Header";
import LandingOrderForm from "../components/LandingOrderForm";
import LandingFAQ from "../components/LandingFAQ";
import StickyCTA from "../components/StickyCTA";
import { STORE } from "../data/products";

export const metadata: Metadata = {
  title: "قبعة القش الطبيعية من دار الصنعة — حماية من الشمس وأناقة صيفية",
  description:
    "قبعة صيفية من القش الطبيعي 100%: حواف واسعة للحماية من الشمس، تهوية ممتازة، وتصميم أنيق. توصيل لـ 58 ولاية، الدفع عند الاستلام. افتحي الطرد وتحققي قبل الدفع.",
  keywords: [
    "قبعة قش",
    "قبعة صيفية",
    "قبعة الشمس",
    "دار الصنعة",
    "قبعة نسائية",
    "الجزائر",
    "الدفع عند الاستلام",
  ],
  openGraph: {
    title: "قبعة القش الطبيعية من دار الصنعة 🌾",
    description:
      "احمي بشرتك من الشمس وأناقتك تكمل إطلالتك. قش طبيعي 100%، حواف واسعة، تهوية ممتازة. 2790 دج فقط — توصيل 58 ولاية، الدفع عند الاستلام.",
    url: `https://${STORE.domain}/chapeau-ete`,
    type: "website",
    locale: "ar_DZ",
    images: [`https://${STORE.domain}/images/hat-1.webp`],
  },
};

const benefits = [
  { icon: "🌾", title: "قش طبيعي 100%", text: "خفيفة ومريحة طوال اليوم" },
  { icon: "☀️", title: "حواف واسعة للحماية من الشمس", text: "تساعد على حماية الوجه والرقبة من التعرض المباشر للشمس" },
  { icon: "💨", title: "تهوية ممتازة", text: "رأسك يبقى مرتاح بدون إحساس بالاختناق" },
  { icon: "👒", title: "تصميم أنيق", text: "مناسبة للبحر، السفر، الخرجات، والتصوير" },
  { icon: "🤝", title: "معاينة قبل الدفع", text: "شوفي الجودة بنفسك قبل ما تخلصي" },
];

const problemPoints = [
  { icon: "☀️", text: "الشمس تضرب الوجه مباشرة" },
  { icon: "🔥", text: "الحرارة تزيد التعب وعدم الراحة" },
  { icon: "😓", text: "القبعات العادية تسبب التعرق والاختناق" },
  { icon: "👗", text: "بعض القبعات تخرب الإطلالة بدل ما تكملها" },
];

const testimonials = [
  {
    text: "وصلتني القبعة اليوم، الخامة روعة وخفيفة بزاف. جات كيما في الصورة.",
    name: "زبونة من الجزائر",
  },
  {
    text: "أكثر حاجة عجبتني أنها ما تخنقش الرأس كيما القبعات الأخرى.",
    name: "زبونة من وهران",
  },
  {
    text: "لبستها في البحر وكانت مريحة وأنيقة.",
    name: "زبونة من العاصمة",
  },
];

const faqs = [
  {
    q: "كيفاش نقدر نتأكد من الجودة؟",
    a: "يمكنك فتح الطرد ومعاينة القبعة قبل الدفع.",
  },
  {
    q: "شحال مدة التوصيل؟",
    a: "عادة من 24 إلى 48 ساعة حسب الولاية.",
  },
  {
    q: "هل القبعة تسبب الحرارة؟",
    a: "لا، القش الطبيعي مصمم للسماح بمرور الهواء ويعطي راحة أكبر في الصيف.",
  },
  {
    q: "هل تناسب البحر والخرجات اليومية؟",
    a: "نعم، تصميمها مناسب للشاطئ، السفر، والخرجات الصيفية.",
  },
  {
    q: "هل يمكنني تغيير طريقة التوصيل؟",
    a: "نعم، يمكنك الاختيار بين التوصيل للدار أو الاستلام من المكتب.",
  },
];

export default function ChapeauETEPage() {
  return (
    <>
      {/* SECTION 1 — Announcement Bar */}
      <div className="bg-deepgreen text-gold text-sm py-2.5 text-center font-tajawal font-medium">
        <div className="container mx-auto px-4 flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
          <span>🚚 توصيل متوفر لـ 58 ولاية</span>
          <span className="hidden sm:inline opacity-40">|</span>
          <span>💵 الدفع عند الاستلام</span>
          <span className="hidden sm:inline opacity-40">|</span>
          <span>✅ افتحي الطرد وتحققي قبل الدفع</span>
        </div>
      </div>

      <Header />

      <main className="bg-cream">
        {/* SECTION 2 — Hero */}
        <section className="relative overflow-hidden py-10 md:py-16">
          <div className="absolute inset-0 opacity-[0.04] pointer-events-none">
            <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              <defs>
                <pattern id="archHero" width="20" height="20" patternUnits="userSpaceOnUse">
                  <path
                    d="M10 20 L10 8 Q10 2 14 2 Q18 2 18 8 L18 20"
                    fill="none"
                    stroke="#1E3A2A"
                    strokeWidth="0.5"
                  />
                </pattern>
              </defs>
              <rect width="100" height="100" fill="url(#archHero)" />
            </svg>
          </div>

          <div className="container mx-auto px-4 relative">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
              <div className="text-center lg:text-right order-2 lg:order-1">
                <span className="inline-block bg-terracotta/10 text-terracotta font-tajawal text-sm font-bold px-4 py-1.5 rounded-full mb-5">
                  ☀️ هذا الصيف… احمي بشرتك وتمتعي بالأناقة
                </span>
                <h1 className="font-amiri text-3xl md:text-5xl text-deepgreen mb-3 leading-tight">
                  قبعة القش الطبيعية من دار الصنعة
                </h1>
                <p className="font-tajawal text-lg text-muted leading-relaxed mb-6 max-w-xl mx-auto lg:mx-0">
                  قبعة صيفية تجمع بين <strong className="text-ink">الظل الواسع، التهوية الممتازة، والتصميم الأنيق</strong> باش تبقي مرتاحة وأنيقة حتى في أقوى أيام الحرارة.
                </p>

                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-right mb-7 max-w-xl mx-auto lg:mx-0">
                  {benefits.map((b) => (
                    <li key={b.title} className="flex items-start gap-2 font-tajawal text-ink text-sm">
                      <span className="text-gold mt-1 shrink-0">✓</span>
                      <span>
                        <strong>{b.icon} {b.title}</strong> — {b.text}
                      </span>
                    </li>
                  ))}
                </ul>

                <div className="mb-6">
                  <p className="font-tajawal text-muted text-sm mb-1">السعر اليوم:</p>
                  <p className="font-amiri text-4xl md:text-5xl text-deepgreen font-bold mb-3">2,790 دج</p>
                  <p className="font-tajawal text-sm text-muted mb-1">🚚 اختاري طريقة التوصيل المناسبة:</p>
                  <div className="flex flex-wrap justify-center lg:justify-start gap-x-5 gap-y-1 font-tajawal text-sm text-ink">
                    <span>🏠 للدار: +700 دج</span>
                    <span>📦 المكتب / Stop Desk: +500 دج</span>
                  </div>
                </div>

                <a
                  href="#order"
                  className="inline-block bg-gold text-deepgreen font-tajawal font-bold text-lg px-8 py-4 rounded-xl hover:bg-gold/90 transition-colors shadow-soft"
                >
                  اطلبي قبعتك الآن
                </a>
                <p className="font-tajawal text-sm text-muted mt-3">
                  الدفع عند الاستلام — بدون مخاطرة
                </p>
              </div>

              <div className="order-1 lg:order-2">
                <div className="relative aspect-[4/5] md:aspect-square rounded-arch overflow-hidden border border-gold/20 shadow-soft bg-ivory mx-auto max-w-md">
                  <Image
                    src="/images/hat-1.webp"
                    alt="قبعة القش الطبيعية من دار الصنعة"
                    fill
                    priority
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                  <span className="absolute top-4 right-4 bg-deepgreen/90 text-gold text-xs font-tajawal font-bold px-3 py-1.5 rounded-full">
                    قش طبيعي 100%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 3 — Problem */}
        <section className="bg-ivory py-14 md:py-20 border-y border-gold/10">
          <div className="container mx-auto px-4 max-w-3xl text-center">
            <h2 className="font-amiri text-2xl md:text-4xl text-deepgreen mb-6">
              الشمس الجزائرية ما ترحمش...
            </h2>
            <p className="font-tajawal text-muted mb-8">
              في الصيف، الخروج بدون حماية يجعل:
            </p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-right mb-8">
              {problemPoints.map((p) => (
                <li
                  key={p.text}
                  className="bg-cream border border-gold/10 rounded-xl p-4 flex items-center gap-3 font-tajawal text-ink"
                >
                  <span className="text-xl">{p.icon}</span>
                  <span>{p.text}</span>
                </li>
              ))}
            </ul>
            <p className="font-tajawal text-muted mb-2">لكن الحل ليس أن تبقي داخل البيت...</p>
            <p className="font-amiri text-xl md:text-2xl text-deepgreen">
              الحل هو اختيار قبعة مصممة للصيف الحقيقي.
            </p>
          </div>
        </section>

        {/* SECTION 4 — Solution */}
        <section className="py-14 md:py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="font-amiri text-2xl md:text-4xl text-deepgreen mb-3">
                تعرفي على قبعة القش الطبيعية من دار الصنعة 🌾
              </h2>
              <p className="font-tajawal text-muted mb-2">لم نصممها فقط لتكون جميلة...</p>
              <p className="font-amiri text-lg text-deepgreen">صممناها باش تعطيك:</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-ivory border border-gold/10 rounded-2xl p-7 text-center shadow-soft">
                <div className="text-4xl mb-3">☀️</div>
                <h3 className="font-amiri text-xl text-deepgreen mb-2">راحة تحت الشمس</h3>
                <p className="font-tajawal text-muted leading-relaxed">
                  الحواف الواسعة توفر ظلاً يساعد على حماية الوجه والرقبة أثناء المشي والخروج.
                </p>
              </div>
              <div className="bg-ivory border border-gold/10 rounded-2xl p-7 text-center shadow-soft">
                <div className="text-4xl mb-3">💨</div>
                <h3 className="font-amiri text-xl text-deepgreen mb-2">إحساس بالبرودة</h3>
                <p className="font-tajawal text-muted leading-relaxed">
                  القش الطبيعي يسمح بمرور الهواء، مما يجعلها أخف وأكثر راحة من القبعات الصناعية.
                </p>
              </div>
              <div className="bg-ivory border border-gold/10 rounded-2xl p-7 text-center shadow-soft">
                <div className="text-4xl mb-3">👒</div>
                <h3 className="font-amiri text-xl text-deepgreen mb-2">أناقة في كل مكان</h3>
                <p className="font-tajawal text-muted leading-relaxed">
                  سواء للبحر، السفر، التسوق أو خرجة صيفية... تضيف لمسة راقية لإطلالتك.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 max-w-2xl mx-auto">
              <div className="relative aspect-square rounded-arch overflow-hidden border border-gold/10 shadow-soft bg-ivory">
                <Image
                  src="/images/hat-1.webp"
                  alt="قبعة القش الطبيعية — أمام"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 50vw, 33vw"
                />
              </div>
              <div className="relative aspect-square rounded-arch overflow-hidden border border-gold/10 shadow-soft bg-ivory">
                <Image
                  src="/images/hat-2.webp"
                  alt="قبعة القش الطبيعية — تفصيل"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 50vw, 33vw"
                />
              </div>
            </div>

            <div className="text-center mt-10">
              <a
                href="#order"
                className="inline-block bg-gold text-deepgreen font-tajawal font-bold text-lg px-8 py-4 rounded-xl hover:bg-gold/90 transition-colors shadow-soft"
              >
                أريدها الآن — الدفع عند الاستلام
              </a>
            </div>
          </div>
        </section>

        {/* SECTION 5 — Why natural straw (comparison) */}
        <section className="bg-deepgreen py-14 md:py-20 text-cream">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="font-amiri text-2xl md:text-4xl text-gold mb-2">لماذا القش الطبيعي؟</h2>
              <p className="font-tajawal text-cream/70">الفرق واضح 👇</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              <div className="bg-white/5 border border-terracotta/30 rounded-2xl p-7">
                <h3 className="font-amiri text-xl text-cream mb-5 text-center">❌ القبعات البلاستيكية</h3>
                <ul className="space-y-3 font-tajawal text-cream/80">
                  <li className="flex items-center gap-2"><span className="text-terracotta">✗</span> تحبس الحرارة</li>
                  <li className="flex items-center gap-2"><span className="text-terracotta">✗</span> تزيد التعرق</li>
                  <li className="flex items-center gap-2"><span className="text-terracotta">✗</span> أقل راحة</li>
                </ul>
              </div>
              <div className="bg-gold/10 border border-gold/40 rounded-2xl p-7">
                <h3 className="font-amiri text-xl text-gold mb-5 text-center">✅ قبعة دار الصنعة</h3>
                <ul className="space-y-3 font-tajawal text-cream">
                  <li className="flex items-center gap-2"><span className="text-gold">✓</span> طبيعية</li>
                  <li className="flex items-center gap-2"><span className="text-gold">✓</span> خفيفة</li>
                  <li className="flex items-center gap-2"><span className="text-gold">✓</span> مهوّاة</li>
                  <li className="flex items-center gap-2"><span className="text-gold">✓</span> أنيقة</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 6 — Quality & Craftsmanship */}
        <section className="py-14 md:py-20">
          <div className="container mx-auto px-4 max-w-3xl text-center">
            <div className="section-divider mb-4">
              <span className="text-gold text-xl">✦</span>
            </div>
            <h2 className="font-amiri text-2xl md:text-4xl text-deepgreen mb-6">
              مصنوعة بعناية... لأن التفاصيل تصنع الفرق
            </h2>
            <p className="font-tajawal text-muted mb-8">
              في دار الصنعة نختار منتجات تجمع بين:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div>
                <div className="text-4xl mb-2">🌾</div>
                <p className="font-tajawal text-ink font-bold">الخامة الطبيعية</p>
              </div>
              <div>
                <div className="text-4xl mb-2">🖐️</div>
                <p className="font-tajawal text-ink font-bold">الحرفية الجزائرية</p>
              </div>
              <div>
                <div className="text-4xl mb-2">✨</div>
                <p className="font-tajawal text-ink font-bold">التصميم العصري</p>
              </div>
            </div>
            <p className="font-tajawal text-muted mt-8 leading-relaxed">
              هدفنا أن تحصلين على قطعة تستعملينها وتفتخرين بها.
            </p>
          </div>
        </section>

        {/* SECTION 7 — Testimonials */}
        <section className="bg-ivory py-14 md:py-20 border-y border-gold/10">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <div className="text-gold text-xl mb-2">⭐⭐⭐⭐⭐</div>
              <h2 className="font-amiri text-2xl md:text-4xl text-deepgreen">ماذا قالت زبوناتنا؟</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {testimonials.map((t, i) => (
                <div key={i} className="bg-cream border border-gold/10 rounded-2xl p-6 shadow-soft">
                  <div className="text-gold text-xl mb-3">⭐⭐⭐⭐⭐</div>
                  <p className="font-tajawal text-ink leading-relaxed mb-4">
                    &ldquo;{t.text}&rdquo;
                  </p>
                  <p className="font-tajawal text-sm text-muted">— {t.name}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 8 — Offer & Order */}
        <section className="py-14 md:py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-10">
              <h2 className="font-amiri text-2xl md:text-4xl text-deepgreen mb-2">
                🌞 احصلي على قبعتك الصيفية الآن
              </h2>
              <div className="section-divider mt-2">
                <span className="text-gold text-xl">✦</span>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start max-w-5xl mx-auto">
              <div className="space-y-5">
                <div className="bg-ivory border border-gold/10 rounded-2xl p-6 shadow-soft text-center">
                  <p className="font-tajawal text-muted text-sm mb-1">السعر:</p>
                  <p className="font-amiri text-4xl text-deepgreen font-bold mb-4">2,790 دج</p>
                  <p className="font-tajawal text-sm text-muted mb-4">اختاري التوصيل:</p>
                  <div className="space-y-3 text-right">
                    <div className="flex items-center justify-between bg-cream rounded-xl p-4 border border-gold/10">
                      <span className="font-tajawal text-ink">🏠 توصيل للدار</span>
                      <div className="text-left">
                        <div className="font-tajawal text-sm text-muted">+700 دج</div>
                        <div className="font-amiri text-lg text-deepgreen font-bold">المجموع: 3,490 دج</div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between bg-cream rounded-xl p-4 border border-gold/10">
                      <span className="font-tajawal text-ink">📦 استلام من المكتب (Stop Desk)</span>
                      <div className="text-left">
                        <div className="font-tajawal text-sm text-muted">+500 دج</div>
                        <div className="font-amiri text-lg text-deepgreen font-bold">المجموع: 3,290 دج</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="rounded-arch overflow-hidden border border-gold/10 shadow-soft bg-ivory">
                  <Image
                    src="/images/hat-2.webp"
                    alt="قبعة القش الطبيعية من دار الصنعة"
                    width={800}
                    height={600}
                    className="w-full h-auto object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                </div>
              </div>

              <LandingOrderForm />
            </div>
          </div>
        </section>

        {/* SECTION 9 — Guarantee */}
        <section className="bg-gold/10 py-14 md:py-16">
          <div className="container mx-auto px-4 max-w-2xl text-center">
            <h2 className="font-amiri text-2xl md:text-4xl text-deepgreen mb-6">اشتري وأنتِ مرتاحة 🤍</h2>
            <p className="font-tajawal text-muted mb-8">
              نحن نعرف أن الشراء أونلاين يحتاج ثقة. لهذا:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div className="bg-ivory border border-gold/20 rounded-2xl p-6 shadow-soft">
                <div className="text-3xl mb-2">✅</div>
                <p className="font-tajawal text-ink font-bold">افتحي الطرد قبل الدفع</p>
              </div>
              <div className="bg-ivory border border-gold/20 rounded-2xl p-6 shadow-soft">
                <div className="text-3xl mb-2">🔍</div>
                <p className="font-tajawal text-ink font-bold">تأكدي من الجودة والخامة</p>
              </div>
              <div className="bg-ivory border border-gold/20 rounded-2xl p-6 shadow-soft">
                <div className="text-3xl mb-2">💵</div>
                <p className="font-tajawal text-ink font-bold">ادفعي فقط إذا كانت مناسبة لك</p>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 10 — FAQ */}
        <section id="faq" className="py-14 md:py-20 bg-ivory">
          <div className="container mx-auto px-4 max-w-3xl">
            <div className="text-center mb-10">
              <h2 className="font-amiri text-2xl md:text-4xl text-deepgreen mb-2">الأسئلة الشائعة</h2>
              <div className="section-divider">
                <span className="text-gold text-xl">✦</span>
              </div>
            </div>
            <LandingFAQ faqs={faqs} />
          </div>
        </section>

        {/* Final CTA band */}
        <section className="bg-gold py-12 md:py-14">
          <div className="container mx-auto px-4 text-center">
            <h2 className="font-amiri text-2xl md:text-4xl text-deepgreen mb-3">
              لا تدعي الشمس تفسد إطلالتك الصيفية
            </h2>
            <p className="font-tajawal text-deepgreen/80 mb-6">2,790 دج فقط — الدفع عند الاستلام</p>
            <a
              href="#order"
              className="inline-block bg-deepgreen text-gold font-tajawal font-bold text-lg px-8 py-4 rounded-xl hover:bg-deepgreen/90 transition-colors shadow-soft"
            >
              اطلبي قبعتك الآن
            </a>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="bg-deepgreen text-cream pt-16 pb-24 md:pb-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 items-center mb-10">
            <div className="text-center md:text-right">
              <h3 className="font-amiri text-2xl text-gold mb-2">🌾 دار الصنعة</h3>
              <p className="font-tajawal text-cream/70 text-sm">منتجات جزائرية أصيلة</p>
            </div>
            <div className="text-center">
              <h4 className="font-tajawal font-bold text-gold mb-4">روابط سريعة</h4>
              <div className="flex flex-col gap-2 font-tajawal text-sm">
                <a href={STORE.fbPage} target="_blank" rel="noreferrer" className="text-cream/80 hover:text-gold transition-colors">صفحتنا على فيسبوك</a>
                <a href="#order" className="text-cream/80 hover:text-gold transition-colors">اطلبي الآن</a>
                <a href="#faq" className="text-cream/80 hover:text-gold transition-colors">الأسئلة الشائعة</a>
              </div>
            </div>
            <div className="text-center md:text-left">
              <h4 className="font-tajawal font-bold text-gold mb-4">تواصل معنا</h4>
              <p className="font-tajawal text-cream/80 text-sm mb-3">نجيب يومياً من 9:00 إلى 21:00</p>
              <a
                href={`https://wa.me/${STORE.whatsapp}?text=السلام عليكم، أريد الاستفسار عن قبعة القش الطبيعية`}
                target="_blank"
                rel="noreferrer"
                className="inline-block bg-gold text-deepgreen font-tajawal font-bold px-5 py-2.5 rounded-lg hover:bg-gold/90 transition-colors"
              >
                واتساب
              </a>
            </div>
          </div>
          <div className="border-t border-gold/20 pt-6 text-center font-tajawal text-sm text-cream/60">
            <p>© 2026 دار الصنعة — جميع الحقوق محفوظة</p>
          </div>
        </div>
      </footer>

      <StickyCTA />
    </>
  );
}