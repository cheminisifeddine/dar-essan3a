import type { MetadataRoute } from "next";
import { STORE } from "./data/products";

export const runtime = "edge";

// Sitemap covering the main storefront, sub-store fronts, product pages
// and FB-ads landing pages. DB-backed with static fallback so the build
// never fails when the binding is unavailable.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = `https://${STORE.domain}`;
  const urls: MetadataRoute.Sitemap = [
    { url: `${base}/`, changeFrequency: "daily", priority: 1 },
    { url: `${base}/chapeau-ete`, changeFrequency: "weekly", priority: 0.9 },
  ];

  try {
    const { listStores, listProducts } = await import("@/lib/db");
    const [stores, products] = await Promise.all([listStores(true), listProducts(true)]);
    for (const s of stores) {
      if (s.subdomain === "main") continue;
      const domain = `https://${s.subdomain}.${STORE.domain}`;
      urls.push({ url: domain, changeFrequency: "daily", priority: 0.9 });
      urls.push({ url: `${domain}/s/${s.subdomain}`, changeFrequency: "daily", priority: 0.8 });
    }
    for (const p of products) {
      const sub = (p as any).store_id && (p as any).store_id !== "main" ? (p as any).store_id : null;
      const host = sub ? `https://${sub}.${STORE.domain}` : base;
      urls.push({ url: `${host}/p/${p.slug}`, changeFrequency: "weekly", priority: 0.8 });
      urls.push({ url: `${host}/l/${p.slug}`, changeFrequency: "weekly", priority: 0.7 });
    }
  } catch {
    // static fallback: core pages only (already added above)
  }

  return urls;
}
