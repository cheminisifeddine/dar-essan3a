export const runtime = "edge";
// NOTE: no `dynamic = "force-dynamic"` — reading searchParams below already
// opts this route into dynamic rendering (same pattern as /p/[slug], /l/[slug]).

import type { Metadata } from "next";
import AnnouncementBar from "./components/AnnouncementBar";
import Header from "./components/Header";
import Hero from "./components/Hero";
import TrustBar from "./components/TrustBar";
import ProductGrid from "./components/ProductGrid";
import BrandStory from "./components/BrandStory";
import HowToOrder from "./components/HowToOrder";
import FAQ from "./components/FAQ";
import FinalCTA from "./components/FinalCTA";
import Footer from "./components/Footer";
import WhatsAppFloat from "./components/WhatsAppFloat";
import StoreThemeStyle from "./components/StoreThemeStyle";
import { normalizeApiProduct, STORE } from "./data/products";
import {
  getStoreBySubdomain,
  getDefaultStore,
  listProducts,
  Store,
} from "@/lib/db";

// Server-side store resolution: middleware rewrites host-based visits
// (sante.darelsanaa.com/...) to include ?store=sante internally, so the
// FIRST paint already renders the correct store — no flash of the main site.
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

export default async function Home({
  searchParams,
}: {
  searchParams?: { store?: string | string[] };
}) {
  const store = await resolveStore(searchParams?.store);
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
