export const runtime = "edge";

import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { normalizeApiProduct, Product, STORE, formatPrice, products as staticProducts } from "../../data/products";
import { getProductBySlug, getStoreBySubdomain, getStoreById, getDefaultStore } from "@/lib/db";
import type { Store } from "@/lib/db";
import AnnouncementBar from "../../components/AnnouncementBar";
import Header from "../../components/Header";
import TrustBar from "../../components/TrustBar";
import OrderForm from "../../components/OrderForm";
import FAQ from "../../components/FAQ";
import Footer from "../../components/Footer";
import WhatsAppFloat from "../../components/WhatsAppFloat";
import ProductCard from "../../components/ProductCard";
import StoreThemeStyle from "../../components/StoreThemeStyle";
import StorePixel from "../../components/StorePixel";
import NaturalGuarantee from "../../components/NaturalGuarantee";
import { getStorePreviewUrl } from "@/lib/store";

async function getProduct(slug: string): Promise<Product | null> {
  try {
    const dbProduct = await getProductBySlug(slug);
    if (dbProduct) return normalizeApiProduct(dbProduct);
  } catch (e) {
    // fallback to static list
  }
  const staticFound = staticProducts.find((p) => p.slug === slug);
  return staticFound ? normalizeApiProduct(staticFound) : null;
}

async function resolveStoreForPage(storeParam?: string, productStoreId?: string): Promise<Store> {
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
  const store = await resolveStoreForPage(searchParams?.store, product.store_id);
  const domain = store.subdomain === "main" ? STORE.domain : `${store.subdomain}.${STORE.domain}`;

  return {
    title: `${product.metaTitle} — ${store.name}`,
    description: product.metaDescription,
    openGraph: {
      title: `${product.metaTitle} — ${store.name}`,
      description: product.metaDescription,
      url: `https://${domain}/p/${product.slug}`,
      type: "website",
      locale: "ar_DZ",
      images: [`https://${domain}${product.ogImage}`],
    },
  };
}

export default async function ProductPage({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams?: { store?: string };
}) {
  const product = await getProduct(params.slug);
  if (!product) notFound();

  const store = await resolveStoreForPage(searchParams?.store, product.store_id);
  const homeHref = store.subdomain && store.subdomain !== "main" ? getStorePreviewUrl(store.subdomain, "/") : "/";

  // Related products — same store ONLY (strict separation, no cross-store leak).
  // Santé with a single product shows no related section.
  let related: Product[] = [];
  try {
    const { listProducts } = await import("@/lib/db");
    const storeKey = store.subdomain && store.subdomain !== "main" ? store.subdomain : "main";
    const sameStore = await listProducts(true, storeKey);
    related = sameStore
      .map(normalizeApiProduct)
      .filter((p) => p.slug !== product.slug)
      .slice(0, 3);
  } catch {
    related = [];
  }

  return (
    <>
      <StoreThemeStyle store={store} />
      <StorePixel pixelId={store.pixel_id} />
      <AnnouncementBar store={store} />
      <Header store={store} />
      <main className="bg-cream pb-16">
        <TrustBar compact store={store} />
        <section className="container mx-auto px-4 py-8 md:py-12">
          {/* Breadcrumb */}
          <div className="font-tajawal text-sm text-muted mb-6 flex items-center gap-2">
            <Link href={homeHref} className="hover:text-gold">
              {store.name}
            </Link>
            <span>/</span>
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

              <div className="flex flex-wrap items-center gap-4 mb-6">
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

              {product.store_id && product.store_id !== "main" && (
                <div className="mb-6">
                  <NaturalGuarantee productName={store.name} />
                </div>
              )}

              <p className="text-terracotta font-tajawal text-sm mb-6">
                {product.store_id && product.store_id !== "main"
                  ? "⚠️ الكمية محدودة — اطلب الآن قبل نفاد المخزون"
                  : "⚠️ الكمية محدودة — منتجات يدوية تُصنع بعدد قليل"}
              </p>

              <OrderForm initialProduct={product} store={store} />
            </div>
          </div>
        </section>

        <TrustBar store={store} />
        <FAQ store={store} />

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
      <Footer store={store} />
      <WhatsAppFloat store={store} />
    </>
  );
}
