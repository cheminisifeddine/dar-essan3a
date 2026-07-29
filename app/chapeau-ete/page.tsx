import type { Metadata } from "next";
import Image from "next/image";
import { products, getProductBySlug, STORE, formatPrice } from "../data/products";
import AnnouncementBar from "../components/AnnouncementBar";
import Header from "../components/Header";
import TrustBar from "../components/TrustBar";
import LandingOrderForm from "../components/LandingOrderForm";
import LandingFAQ from "../components/LandingFAQ";
import StickyCTA from "../components/StickyCTA";
import Footer from "../components/Footer";
import WhatsAppFloat from "../components/WhatsAppFloat";
import PixelEvents from "../components/PixelEvents";

const product = getProductBySlug("chapeau-palmier") || products[0];
const saved = product.oldPrice - product.price;

export const metadata: Metadata = {
  title: "قبعة النخيل شمس بوسعادة — دار الصنعة",
  description: "قبعة نخيل تقليدية من بوسعادة، نسيج يدوي 100%، حماية من الشمس وأناقة صيفية. توصيل 58 ولاية، الدفع عند الاستلام.",
  openGraph: {
    title: "قبعة النخيل شمس بوسعادة — دار الصنعة",
    description: "قبعة نخيل تقليدية من بوسعادة، نسيج يدوي 100%، حماية من الشمس وأناقة صيفية. توصيل 58 ولاية، الدفع عند الاستلام.",
    url: `https://${STORE.domain}/chapeau-ete`,
    type: "website",
    locale: "ar_DZ",
    images: [`https://${STORE.domain}${product.images[0]}`],
  },
};

export default function ChapeauEtePage() {
  return (
    <>
      <PixelEvents />
      <AnnouncementBar />
      <Header />
      <main className="bg-cream">
        <TrustBar compact />
        <section className="container mx-auto px-4 py-10 md:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
            <div>
              <div className="relative aspect-[4/5] rounded-arch overflow-hidden border border-gold/10 shadow-soft mb-4">
                <Image src={product.images[0]} alt={product.name} fill priority className="object-cover" sizes="(max-width: 1024px) 100vw, 50vw" />
              </div>
              {product.images.length > 1 && (
                <div className="grid grid-cols-3 gap-3">
                  {product.images.slice(1).map((img, i) => (
                    <div key={i} className="relative aspect-square rounded-xl overflow-hidden border border-gold/10">
                      <Image src={img} alt={`${product.name} ${i + 2}`} fill className="object-cover" sizes="120px" />
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div>
              <h1 className="font-amiri text-3xl md:text-4xl text-deepgreen mb-2">{product.name}</h1>
              <p className="font-tajawal text-gold text-lg mb-4">{product.hook}</p>

              <div className="flex items-center gap-3 mb-6">
                <span className="font-amiri text-4xl font-bold text-deepgreen">{formatPrice(product.price)}</span>
                <span className="font-tajawal text-lg text-muted line-through">{formatPrice(product.oldPrice)}</span>
                <span className="bg-terracotta text-white text-sm font-tajawal font-bold px-3 py-1 rounded-full">وفّر {formatPrice(saved)}</span>
              </div>

              <ul className="space-y-2 mb-6">
                {product.bullets.map((b, i) => (
                  <li key={i} className="flex items-start gap-2 font-tajawal text-ink">
                    <span className="text-gold mt-1">✦</span>
                    <span>{b}</span>
                  </li>
                ))}
              </ul>

              <p className="font-tajawal text-muted leading-relaxed mb-4">{product.description}</p>
              <p className="text-terracotta font-tajawal text-sm mb-6">⚠️ الكمية محدودة — منتجات يدوية تُصنع بعدد قليل</p>

              <LandingOrderForm productSlug="chapeau-palmier" />
            </div>
          </div>
        </section>

        <LandingFAQ faqs={[]} />
        <StickyCTA text="اطلبي قبعة النخيل الآن — الدفع عند الاستلام" href="#order" />
      </main>
      <Footer />
      <WhatsAppFloat />
    </>
  );
}
