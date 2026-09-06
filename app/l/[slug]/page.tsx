export const runtime = "edge";

import { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import {
  normalizeApiProduct,
  Product,
  STORE,
  formatPrice,
} from "../../data/products";
import {
  getProductBySlug,
  getStoreBySubdomain,
  getStoreById,
  getDefaultStore,
  Store,
} from "@/lib/db";
import AnnouncementBar from "../../components/AnnouncementBar";
import Header from "../../components/Header";
import OrderForm from "../../components/OrderForm";
import LandingFAQ from "../../components/LandingFAQ";
import WhatsAppFloat from "../../components/WhatsAppFloat";
import StickyCTA from "../../components/StickyCTA";
import StoreThemeStyle from "../../components/StoreThemeStyle";

type LandingCopy = {
  badge: string;
  problemTitle: string;
  problemSub: string;
  problemPoints: { icon: string; text: string }[];
  problemClose: string;
  solutionTitle: string;
  solutionSub: string;
  solutionCards: { icon: string; title: string; text: string }[];
  compareTitle: string;
  compareUs: string[];
  compareThem: string[];
  testimonials: { text: string; name: string }[];
  faqs: { q: string; a: string }[];
  finalTitle: string;
  finalSub: string;
  ctaLabel: string;
};

// Elite per-product landing copy (FB-ads ready). Add more products here as needed.
const LANDING_COPY: Record<string, LandingCopy> = {
  "quwat-tabiaa": {
    badge: "🌿 وصفة طبيعية لزيادة الوزن",
    problemTitle: "تأكل مليح… بصح وزنك ما يتحركش؟",
    problemSub: "إذا كنت تعاني من النحافة، المشكل ماشي في شهيتك — المشكل في السعرات:",
    problemPoints: [
      { icon: "🍽️", text: "تأكل جيداً ولكن الميزان لا يتحرك" },
      { icon: "😮‍💨", text: "تمل بسرعة من الوجبات الكبيرة" },
      { icon: "⏰", text: "ما عندكش الوقت لتحضير وجبات ضخمة كل يوم" },
      { icon: "📉", text: "مدخولك اليومي من السعرات أقل مما يحتاجه جسمك" },
    ],
    problemClose: "الحل ماشي أنك تجبر روحك على الأكل… الحل أنك تزيد السعرات بذكاء.",
    solutionTitle: "علاش تختار قوة الطبيعة؟",
    solutionSub: "وصفة تجمع مكونات طبيعية مختارة في تركيبة لذيذة وسهلة:",
    solutionCards: [
      {
        icon: "🌿",
        title: "مكونات طبيعية مختارة",
        text: "تركيبة غذائية تعتمد على مكونات طبيعية مناسبة لروتينك اليومي.",
      },
      {
        icon: "⚡",
        title: "غنية بالسعرات والطاقة",
        text: "طريقة عملية لرفع مدخولك اليومي من السعرات بدون وجبات ضخمة.",
      },
      {
        icon: "😋",
        title: "لذيذة وسهلة الاستعمال",
        text: "ضيفها للخبز، الحليب، الشوفان، التمر أو العصائر والسموثي.",
      },
    ],
    compareTitle: "الفرق واضح 👇",
    compareUs: ["مكونات طبيعية 100%", "سعرات مركزة في حصة صغيرة", "طعم لذيذ وسهل", "للرجال والنساء"],
    compareThem: ["وجبات ضخمة تُتعبك", "مكملات بمكونات مجهولة", "نتائج بطيئة ومحبطة"],
    testimonials: [
      {
        text: "كنت نأكل بزاف بصح وزني ثابت. مع قوة الطبيعة وليت نزيد السعرات بسهولة في يومي.",
        name: "زبون من الجزائر العاصمة",
      },
      {
        text: "الطعم مليح بزاف، نخلطها مع الحليب والشوفان كل صباح. سهلة وما تملش منها.",
        name: "زبونة من وهران",
      },
      {
        text: "التوصيل كان سريع والدفع عند الاستلام. تجربة مريحة من الأول للآخر.",
        name: "زبون من سطيف",
      },
    ],
    faqs: [
      {
        q: "كيفاش نستعمل قوة الطبيعة؟",
        a: "تناول الكمية الموصى بها على العبوة يومياً — تقدر تضيفها للخبز، الحليب، الشوفان، التمر أو العصائر والسموثي.",
      },
      {
        q: "هل المكونات طبيعية؟",
        a: "نعم، التركيبة تعتمد على مكونات طبيعية مختارة بعناية — غذاء إضافي ضمن نظامك، وليس بديلاً عن الوجبات.",
      },
      {
        q: "شحال مدة التوصيل؟",
        a: "من 24 إلى 72 ساعة حسب الولاية — نوصّل لجميع ولايات الوطن (58 ولاية).",
      },
      {
        q: "هل الدفع عند الاستلام؟",
        a: "نعم، تدفع فقط عندما يصلك المنتج. بدون مخاطرة.",
      },
      {
        q: "عندي مرض مزمن أو حساسية، هل يناسبني؟",
        a: "إذا كان لديك مرض مزمن، حساسية غذائية، أو تتناول أدوية، استشر مختصاً قبل الاستخدام.",
      },
    ],
    finalTitle: "ابدأ رحلتك نحو وزن أفضل اليوم",
    finalSub: "قوة الطبيعة — وصفة التسمين الطبيعية. 🚚 توصيل سريع | 📦 الدفع عند الاستلام",
    ctaLabel: "أطلب قوة الطبيعة الآن",
  },
};

function fallbackCopy(p: Product): LandingCopy {
  return {
    badge: `✨ ${p.hook || p.name}`,
    problemTitle: p.hook || `لماذا ${p.name}؟`,
    problemSub: "صُمم هذا المنتج ليحل مشكلتك اليومية ببساطة:",
    problemPoints: p.bullets.slice(0, 4).map((b) => ({ icon: "⚡", text: b })),
    problemClose: "الحل أبسط مما تتصور — اطلب الآن وجرّب بنفسك.",
    solutionTitle: `تعرف على ${p.name}`,
    solutionSub: "أهم ما يميزه:",
    solutionCards: p.bullets.slice(0, 3).map((b, i) => ({
      icon: ["🌿", "⚡", "😋"][i % 3],
      title: b.split("—")[0].slice(0, 40),
      text: b,
    })),
    compareTitle: "الفرق واضح 👇",
    compareUs: p.bullets.slice(0, 4),
    compareThem: ["جودة عادية", "سعر أعلى في السوق", "بدون توصيل لباب الدار"],
    testimonials: [],
    faqs: [
      {
        q: "هل الدفع عند الاستلام؟",
        a: "نعم، تدفع فقط عندما يصلك المنتج وتعاينه بنفسك.",
      },
      {
        q: "شحال مدة التوصيل؟",
        a: "من 24 إلى 72 ساعة حسب الولاية — نوصّل لجميع الولايات (58 ولاية).",
      },
      {
        q: "كيفاش نطلب؟",
        a: "املأ الاستمارة بالاسم ورقم الهاتف والعنوان، وسنتصل بك للتأكيد قبل الإرسال.",
      },
    ],
    finalTitle: `اطلب ${p.name} الآن`,
    finalSub: "🚚 توصيل سريع لجميع الولايات | 📦 الدفع عند الاستلام",
    ctaLabel: "اطلب الآن — الدفع عند الاستلام",
  };
}

async function getProduct(slug: string): Promise<Product | null> {
  try {
    const dbProduct = await getProductBySlug(slug);
    if (dbProduct) return normalizeApiProduct(dbProduct);
  } catch {}
  return null;
}

async function resolveStore(storeParam?: string, productStoreId?: string): Promise<Store> {
  try {
    if (storeParam) {
      const s = await getStoreBySubdomain(storeParam);
      if (s) return s;
    }
    if (productStoreId && productStoreId !== "main" && productStoreId !== "all") {
      const s = (await getStoreBySubdomain(productStoreId)) || (await getStoreById(productStoreId));
      if (s) return s;
    }
    return await getDefaultStore();
  } catch {
    return await getDefaultStore();
  }
}

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams?: { store?: string };
}): Promise<Metadata> {
  const product = await getProduct(params.slug);
  if (!product) return {};
  const store = await resolveStore(searchParams?.store, product.store_id);
  const domain = store.subdomain === "main" ? STORE.domain : `${store.subdomain}.${STORE.domain}`;
  return {
    title: `${product.name} — ${store.name}`,
    description: product.metaDescription,
    openGraph: {
      title: `${product.name} — ${store.name}`,
      description: product.metaDescription,
      url: `https://${domain}/l/${product.slug}`,
      type: "website",
      locale: "ar_DZ",
      images: [`https://${domain}${product.ogImage}`],
    },
  };
}

export default async function LandingPage({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams?: { store?: string };
}) {
  const product = await getProduct(params.slug);
  if (!product) notFound();
  const store = await resolveStore(searchParams?.store, product.store_id);
  const copy = LANDING_COPY[product.slug] || fallbackCopy(product);
  const priceText = formatPrice(product.price);
  const homeDelivery = store.home_delivery_fee ?? 500;
  const stopdesk = store.stopdesk_fee ?? 350;

  return (
    <>
      <StoreThemeStyle store={store} />
      <AnnouncementBar store={store} />
      <Header store={store} />
      <main className="bg-cream">
        {/* HERO */}
        <section className="relative overflow-hidden py-10 md:py-16">
          <div className="container mx-auto px-4 relative">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
              <div className="text-center lg:text-right order-2 lg:order-1">
                <span className="inline-block bg-terracotta/10 text-terracotta font-tajawal text-sm font-bold px-4 py-1.5 rounded-full mb-5">
                  {copy.badge}
                </span>
                <h1 className="font-amiri text-3xl md:text-5xl text-deepgreen mb-3 leading-tight">
                  {product.name}
                </h1>
                <p className="font-tajawal text-lg text-muted leading-relaxed mb-6 max-w-xl mx-auto lg:mx-0">
                  {product.hook}
                </p>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-right mb-7 max-w-xl mx-auto lg:mx-0">
                  {product.bullets.slice(0, 4).map((b) => (
                    <li key={b} className="flex items-start gap-2 font-tajawal text-ink text-sm">
                      <span className="text-gold mt-1 shrink-0">✓</span>
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
                <div className="mb-6">
                  <p className="font-tajawal text-muted text-sm mb-1">السعر اليوم:</p>
                  <p className="font-amiri text-4xl md:text-5xl text-deepgreen font-bold mb-1">{priceText}</p>
                  <p className="font-tajawal text-sm text-muted line-through mb-3">
                    {formatPrice(product.oldPrice)}
                  </p>
                  <div className="flex flex-wrap justify-center lg:justify-start gap-x-5 gap-y-1 font-tajawal text-sm text-ink">
                    <span>🏠 للدار: +{homeDelivery} دج</span>
                    <span>📦 المكتب: +{stopdesk} دج</span>
                  </div>
                </div>
                <a
                  href="#order"
                  className="inline-block bg-gold text-deepgreen font-tajawal font-bold text-lg px-8 py-4 rounded-xl hover:bg-gold/90 transition-colors shadow-soft"
                >
                  {copy.ctaLabel}
                </a>
                <p className="font-tajawal text-sm text-muted mt-3">الدفع عند الاستلام — بدون مخاطرة</p>
              </div>
              <div className="order-1 lg:order-2">
                <div className="relative aspect-[4/5] md:aspect-square rounded-arch overflow-hidden border border-gold/20 shadow-soft bg-ivory mx-auto max-w-md">
                  <Image
                    src={product.images[0]}
                    alt={product.name}
                    fill
                    priority
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                  <span className="absolute top-4 right-4 bg-deepgreen/90 text-gold text-xs font-tajawal font-bold px-3 py-1.5 rounded-full">
                    🌿 طبيعي 100%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* PROBLEM */}
        <section className="bg-ivory py-14 md:py-20 border-y border-gold/10">
          <div className="container mx-auto px-4 max-w-3xl text-center">
            <h2 className="font-amiri text-2xl md:text-4xl text-deepgreen mb-6">{copy.problemTitle}</h2>
            <p className="font-tajawal text-muted mb-8">{copy.problemSub}</p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-right mb-8">
              {copy.problemPoints.map((p) => (
                <li
                  key={p.text}
                  className="bg-cream border border-gold/10 rounded-xl p-4 flex items-center gap-3 font-tajawal text-ink"
                >
                  <span className="text-xl">{p.icon}</span>
                  <span>{p.text}</span>
                </li>
              ))}
            </ul>
            <p className="font-amiri text-xl md:text-2xl text-deepgreen">{copy.problemClose}</p>
          </div>
        </section>

        {/* SOLUTION */}
        <section className="py-14 md:py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="font-amiri text-2xl md:text-4xl text-deepgreen mb-3">{copy.solutionTitle}</h2>
              <p className="font-tajawal text-muted">{copy.solutionSub}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {copy.solutionCards.map((c) => (
                <div key={c.title} className="bg-ivory border border-gold/10 rounded-2xl p-7 text-center shadow-soft">
                  <div className="text-4xl mb-3">{c.icon}</div>
                  <h3 className="font-amiri text-xl text-deepgreen mb-2">{c.title}</h3>
                  <p className="font-tajawal text-muted leading-relaxed">{c.text}</p>
                </div>
              ))}
            </div>
            <div className="text-center mt-10">
              <a
                href="#order"
                className="inline-block bg-gold text-deepgreen font-tajawal font-bold text-lg px-8 py-4 rounded-xl hover:bg-gold/90 transition-colors shadow-soft"
              >
                {copy.ctaLabel}
              </a>
            </div>
          </div>
        </section>

        {/* COMPARISON */}
        <section className="bg-deepgreen py-14 md:py-20 text-cream">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="font-amiri text-2xl md:text-4xl text-gold mb-2">{copy.compareTitle}</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              <div className="bg-white/5 border border-terracotta/30 rounded-2xl p-7">
                <h3 className="font-amiri text-xl text-cream mb-5 text-center">❌ الطرق التقليدية</h3>
                <ul className="space-y-3 font-tajawal text-cream/80">
                  {copy.compareThem.map((t) => (
                    <li key={t} className="flex items-center gap-2">
                      <span className="text-terracotta">✗</span> {t}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-gold/10 border border-gold/40 rounded-2xl p-7">
                <h3 className="font-amiri text-xl text-gold mb-5 text-center">✅ {store.name}</h3>
                <ul className="space-y-3 font-tajawal text-cream">
                  {copy.compareUs.map((t) => (
                    <li key={t} className="flex items-center gap-2">
                      <span className="text-gold">✓</span> {t}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* TESTIMONIALS */}
        {copy.testimonials.length > 0 && (
          <section className="bg-ivory py-14 md:py-20 border-y border-gold/10">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <div className="text-gold text-xl mb-2">⭐⭐⭐⭐⭐</div>
                <h2 className="font-amiri text-2xl md:text-4xl text-deepgreen">ماذا قال زبائننا؟</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                {copy.testimonials.map((t, i) => (
                  <div key={i} className="bg-cream border border-gold/10 rounded-2xl p-6 shadow-soft">
                    <div className="text-gold text-xl mb-3">⭐⭐⭐⭐⭐</div>
                    <p className="font-tajawal text-ink leading-relaxed mb-4">&ldquo;{t.text}&rdquo;</p>
                    <p className="font-tajawal text-sm text-muted">— {t.name}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* OFFER + ORDER */}
        <section id="order" className="py-14 md:py-20 scroll-mt-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-10">
              <h2 className="font-amiri text-2xl md:text-4xl text-deepgreen mb-2">🎯 {copy.finalTitle}</h2>
              <div className="section-divider mt-2">
                <span className="text-gold text-xl">✦</span>
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start max-w-5xl mx-auto">
              <div className="space-y-5">
                <div className="bg-ivory border border-gold/10 rounded-2xl p-6 shadow-soft text-center">
                  <p className="font-tajawal text-muted text-sm mb-1">السعر:</p>
                  <p className="font-amiri text-4xl text-deepgreen font-bold mb-1">{priceText}</p>
                  <p className="font-tajawal text-sm text-muted line-through mb-4">
                    {formatPrice(product.oldPrice)}
                  </p>
                  <div className="space-y-3 text-right">
                    <div className="flex items-center justify-between bg-cream rounded-xl p-4 border border-gold/10">
                      <span className="font-tajawal text-ink">🏠 توصيل للدار</span>
                      <div className="text-left">
                        <div className="font-tajawal text-sm text-muted">+{homeDelivery} دج</div>
                        <div className="font-amiri text-lg text-deepgreen font-bold">
                          المجموع: {formatPrice(product.price + homeDelivery)}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between bg-cream rounded-xl p-4 border border-gold/10">
                      <span className="font-tajawal text-ink">📦 استلام من المكتب</span>
                      <div className="text-left">
                        <div className="font-tajawal text-sm text-muted">+{stopdesk} دج</div>
                        <div className="font-amiri text-lg text-deepgreen font-bold">
                          المجموع: {formatPrice(product.price + stopdesk)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {product.images[1] && (
                  <div className="rounded-arch overflow-hidden border border-gold/10 shadow-soft bg-ivory">
                    <Image
                      src={product.images[1]}
                      alt={product.name}
                      width={800}
                      height={600}
                      className="w-full h-auto object-cover"
                      sizes="(max-width: 1024px) 100vw, 50vw"
                    />
                  </div>
                )}
              </div>
              <OrderForm initialProduct={product} store={store} />
            </div>
          </div>
        </section>

        {/* GUARANTEE */}
        <section className="bg-gold/10 py-14 md:py-16">
          <div className="container mx-auto px-4 max-w-2xl text-center">
            <h2 className="font-amiri text-2xl md:text-4xl text-deepgreen mb-6">اطلب وأنت مرتاح 🤍</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div className="bg-ivory border border-gold/20 rounded-2xl p-6 shadow-soft">
                <div className="text-3xl mb-2">💵</div>
                <p className="font-tajawal text-ink font-bold">الدفع عند الاستلام</p>
              </div>
              <div className="bg-ivory border border-gold/20 rounded-2xl p-6 shadow-soft">
                <div className="text-3xl mb-2">🚚</div>
                <p className="font-tajawal text-ink font-bold">توصيل 58 ولاية</p>
              </div>
              <div className="bg-ivory border border-gold/20 rounded-2xl p-6 shadow-soft">
                <div className="text-3xl mb-2">🌿</div>
                <p className="font-tajawal text-ink font-bold">مكونات طبيعية</p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="py-14 md:py-20 bg-ivory">
          <div className="container mx-auto px-4 max-w-3xl">
            <div className="text-center mb-10">
              <h2 className="font-amiri text-2xl md:text-4xl text-deepgreen mb-2">الأسئلة الشائعة</h2>
              <div className="section-divider">
                <span className="text-gold text-xl">✦</span>
              </div>
            </div>
            <LandingFAQ faqs={copy.faqs} />
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="bg-gold py-12 md:py-14">
          <div className="container mx-auto px-4 text-center">
            <h2 className="font-amiri text-2xl md:text-4xl text-deepgreen mb-3">{copy.finalTitle}</h2>
            <p className="font-tajawal text-deepgreen/80 mb-6">{copy.finalSub}</p>
            <a
              href="#order"
              className="inline-block bg-deepgreen text-gold font-tajawal font-bold text-lg px-8 py-4 rounded-xl hover:bg-deepgreen/90 transition-colors shadow-soft"
            >
              {copy.ctaLabel}
            </a>
          </div>
        </section>
      </main>
      <WhatsAppFloat store={store} />
      <StickyCTA priceText={priceText} ctaLabel="اطلب الآن" />
    </>
  );
}
