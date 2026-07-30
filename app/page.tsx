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
import { normalizeApiProduct, Product } from "./data/products";

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetch("/api/products")
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