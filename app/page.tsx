"use client";

import { useEffect, useState } from "react";
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
import { normalizeApiProduct, Product } from "./data/products";
import type { Store } from "@/lib/db";

function detectSubdomain(): string {
  if (typeof window === "undefined") return "main";
  const params = new URLSearchParams(window.location.search);
  const q = params.get("store");
  if (q) return q.toLowerCase().trim();
  const host = window.location.hostname.toLowerCase();
  if (host.endsWith(".localhost")) {
    const sub = host.replace(/\.localhost$/, "");
    if (sub && sub !== "www" && sub !== "localhost") return sub;
    return "main";
  }
  if (host === "darelsanaa.com" || host === "www.darelsanaa.com" || host === "localhost" || host.endsWith(".pages.dev") || host.endsWith(".vercel.app")) {
    // pages.dev preview: try first label as store? only if 3+ parts and not www
    const parts = host.split(".");
    if ((host.endsWith(".pages.dev") || host.endsWith(".vercel.app")) && parts.length >= 4) return parts[0];
    return "main";
  }
  if (host.endsWith(".darelsanaa.com")) {
    const sub = host.replace(".darelsanaa.com", "");
    if (sub && sub !== "www") return sub;
  }
  return "main";
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [store, setStore] = useState<Store | null>(null);

  useEffect(() => {
    const sub = detectSubdomain();
    // Resolve store config for theming (name, colors, hero, announcement)
    fetch(`/api/stores?subdomain=${encodeURIComponent(sub)}&single=true`)
      .then((r) => r.json())
      .then((data) => {
        if (data.success && data.store) setStore(data.store);
      })
      .catch(() => {});
    // Load products for this store (API also reads x-store-subdomain via middleware)
    const q = sub && sub !== "main" ? `?store=${encodeURIComponent(sub)}` : "";
    fetch(`/api/products${q}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.success && Array.isArray(data.products)) {
          setProducts(data.products.map(normalizeApiProduct));
        }
      })
      .catch(() => {});
  }, []);

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