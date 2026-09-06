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
import { products as staticProducts } from "./data/products";
import { DEFAULT_STORE } from "@/lib/store";

// Static fallback for the bare "/" path. In production the middleware
// rewrites "/" to "/s/<subdomain>" before rendering, so visitors always
// get the server-rendered store page on first paint. This static version
// only serves direct un-rewritten hits (fully prerendered, never flashes
// wrong content because it never swaps stores client-side).
export default function Home() {
  const store = DEFAULT_STORE;
  return (
    <>
      <StoreThemeStyle store={store} />
      <AnnouncementBar store={store} />
      <Header store={store} />
      <main>
        <Hero store={store} />
        <TrustBar store={store} />
        <ProductGrid products={staticProducts} />
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
