export const runtime = "edge";

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
import { normalizeApiProduct, Product, STORE } from "./data/products";

async function getProducts(): Promise<Product[]> {
  try {
    const base = process.env.NEXT_PUBLIC_SITE_URL || `https://${STORE.domain}`;
    const res = await fetch(`${base}/api/products`, { next: { revalidate: 60 } });
    const data = await res.json();
    if (data.success && Array.isArray(data.products)) {
      return data.products.map(normalizeApiProduct);
    }
  } catch (e) {
    console.error("Failed to load products:", e);
  }
  return [];
}

export default async function Home() {
  const products = await getProducts();

  return (
    <>
      <AnnouncementBar />
      <Header />
      <main>
        <Hero />
        <TrustBar />
        <ProductGrid products={products} />
        <BrandStory />
        <HowToOrder />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
      <WhatsAppFloat />
    </>
  );
}
