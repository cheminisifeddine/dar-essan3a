export const runtime = "edge";

import type { Metadata } from "next";
import AnnouncementBar from "../../components/AnnouncementBar";
import Header from "../../components/Header";
import Hero from "../../components/Hero";
import TrustBar from "../../components/TrustBar";
import ProductGrid from "../../components/ProductGrid";
import BrandStory from "../../components/BrandStory";
import HowToOrder from "../../components/HowToOrder";
import FAQ from "../../components/FAQ";
import FinalCTA from "../../components/FinalCTA";
import Footer from "../../components/Footer";
import WhatsAppFloat from "../../components/WhatsAppFloat";
import StoreThemeStyle from "../../components/StoreThemeStyle";
import StorePixel from "../../components/StorePixel";
import { normalizeApiProduct, STORE } from "../../data/products";
import {
  getStoreBySubdomain,
  getDefaultStore,
  listProducts,
} from "@/lib/db";
import type { Store } from "@/lib/db";

// Storefront homepage for a specific store: /s/main, /s/sante, ...
// Served when middleware rewrites a host-based visit (e.g.
// sante.darelsanaa.com/ -> /s/sante). Server-rendered so the FIRST
// paint already shows the correct store — no flash of the main site.
async function resolveStore(storeParam?: string | string[]): Promise<Store> {
  try {
    const sub = Array.isArray(storeParam) ? storeParam[0] : storeParam;
    if (sub) {
      const s = await getStoreBySubdomain(sub.toLowerCase().trim());
      if (s) return s;
    }
    return await getDefaultStore();
  } catch {
    return await getDefaultStore();
  }
}

export async function generateMetadata({
  params,
}: {
  params: { store: string };
}): Promise<Metadata> {
  const store = await resolveStore(params.store);
  if (!store.subdomain || store.subdomain === "main") {
    return {
      title: "دار الصنعة — منتجات تقليدية جزائرية أصلية من بوسعادة",
      description:
        "قطع تقليدية جزائرية أصيلة من بوسعادة: نسيج النخيل، الفخار، النحاس، واللوحات. توصيل لـ 58 ولاية، والدفع عند الاستلام.",
      openGraph: {
        title: "دار الصنعة — منتجات تقليدية جزائرية أصلية من بوسعادة",
        description:
          "قطع تقليدية جزائرية أصيلة من بوسعادة، توصيل لكل ولايات الوطن، الدفع عند الاستلام.",
        url: `https://${STORE.domain}`,
        type: "website",
        locale: "ar_DZ",
        images: [`https://${STORE.domain}/images/logo.webp`],
      },
    };
  }
  const domain = `${store.subdomain}.${STORE.domain}`;
  const title = store.meta_title || `${store.name} — ${store.hero_title || ""}`.trim();
  const description =
    store.meta_description ||
    store.hero_subtitle ||
    `${store.name} — منتجات طبيعية مختارة. توصيل لـ 58 ولاية والدفع عند الاستلام.`;
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://${domain}`,
      type: "website",
      locale: "ar_DZ",
      images: [store.logo_url ? `https://${domain}${store.logo_url}` : `https://${domain}/images/logo.webp`],
    },
  };
}

export default async function StoreHome({
  params,
}: {
  params: { store: string };
}) {
  const store = await resolveStore(params.store);
  const storeKey = store.subdomain && store.subdomain !== "main" ? store.subdomain : "main";

  // Strict separation: only this store's products (+ shared 'all').
  let products: ReturnType<typeof normalizeApiProduct>[] = [];
  try {
    const dbProducts = await listProducts(true, storeKey);
    products = dbProducts.map(normalizeApiProduct);
  } catch {
    products = [];
  }

  return (
    <>
      <StoreThemeStyle store={store} />
      <StorePixel pixelId={store.pixel_id} />
      <AnnouncementBar store={store} />
      <Header store={store} />
      <main>
        <Hero store={store} />
        <TrustBar store={store} />
        <ProductGrid products={products} />
        <BrandStory store={store} />
        <HowToOrder />
        <FAQ store={store} />
        <FinalCTA store={store} />
      </main>
      <Footer store={store} />
      <WhatsAppFloat store={store} />
    </>
  );
}
