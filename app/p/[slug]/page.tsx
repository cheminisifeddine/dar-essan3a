import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { products, getProductBySlug, STORE, formatPrice, discountPercent } from "../../data/products";
import AnnouncementBar from "../../components/AnnouncementBar";
import Header from "../../components/Header";
import TrustBar from "../../components/TrustBar";
import OrderForm from "../../components/OrderForm";
import FAQ from "../../components/FAQ";
import Footer from "../../components/Footer";
import WhatsAppFloat from "../../components/WhatsAppFloat";
import ProductCard from "../../components/ProductCard";

export async function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const product = getProductBySlug(params.slug);
  if (!product) return {};
  return {
    title: product.metaTitle,
    description: product.metaDescription,
    openGraph: {
      title: product.metaTitle,
      description: product.metaDescription,
      url: `https://${STORE.domain}/p/${product.slug}`,
      type: "website",
      locale: "ar_DZ",
      images: [`https://${STORE.domain}${product.ogImage}`],
    },
  };
}

export default function ProductPage({ params }: { params: { slug: string } }) {
  const product = getProductBySlug(params.slug);
  if (!product) notFound();

  const disc = discountPercent(product);
  const related = products.filter((p) => p.slug !== product.slug).slice(0, 3);

  return (
    <>
      <AnnouncementBar />
      <Header />
      <main className="bg-cream pb-16">
        <TrustBar compact />
        <section className="container mx-auto px-4 py-8 md:py-12">
          {/* Breadcrumb */}
          <div className="font-tajawal text-sm text-muted mb-6">
            <Link href="/" className="hover:text-gold">الرئيسية</Link>
            <span className="mx-2">/</span>
            <span className="text-ink">{product.name}</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
            {/* Gallery */}
            <div className="space-y-4">
              <div className="relative aspect-[4/5] md:aspect-square rounded-arch overflow-hidden border border-gold/10 shadow-soft bg-ivory">
                <Image
                  src={product.images[0]}
                  alt={product.name}
                  fill
                  priority
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
              {product.images.length > 1 && (
                <div className="grid grid-cols-4 gap-3">
                  {product.images.slice(1).map((img, i) => (
                    <div
                      key={i}
                      className="relative aspect-square rounded-xl overflow-hidden border border-gold/10 bg-ivory"
                    >
                      <Image
                        src={img}
                        alt={`${product.name} ${i + 2}`}
                        fill
                        className="object-cover"
                        sizes="120px"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Info + Order Form */}
            <div>
              <h1 className="font-amiri text-3xl md:text-4xl text-deepgreen mb-2">
                {product.name}
              </h1>
              <p className="font-tajawal text-gold text-lg mb-4">{product.hook}</p>

              <div className="flex items-center gap-4 mb-6">
                <span className="font-amiri text-4xl font-bold text-deepgreen">
                  {formatPrice(product.price)}
                </span>
                <span className="font-tajawal text-lg text-muted line-through">
                  {formatPrice(product.oldPrice)}
                </span>
                <span className="bg-terracotta text-white text-sm font-tajawal font-bold px-3 py-1 rounded-full">
                  وفّر {formatPrice(product.oldPrice - product.price)}
                </span>
              </div>

              <ul className="space-y-2 mb-6">
                {product.bullets.map((b, i) => (
                  <li key={i} className="flex items-start gap-2 font-tajawal text-ink">
                    <span className="text-gold mt-1">✦</span>
                    <span>{b}</span>
                  </li>
                ))}
              </ul>

              <p className="font-tajawal text-muted leading-relaxed mb-6">
                {product.description}
              </p>

              <p className="text-terracotta font-tajawal text-sm mb-6">
                ⚠️ الكمية محدودة — منتجات يدوية تُصنع بعدد قليل
              </p>

              <OrderForm initialProduct={product} />
            </div>
          </div>
        </section>

        <TrustBar />
        <FAQ />

        {related.length > 0 && (
          <section className="container mx-auto px-4 py-16">
            <h2 className="font-amiri text-2xl md:text-3xl text-deepgreen mb-8 text-center">
              منتجات أخرى قد تعجبك
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {related.map((p) => (
                <ProductCard key={p.slug} product={p} />
              ))}
            </div>
          </section>
        )}
      </main>
      <Footer />
      <WhatsAppFloat />
    </>
  );
}
