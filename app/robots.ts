import type { MetadataRoute } from "next";
import { STORE } from "./data/products";

export const runtime = "edge";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/" }],
    sitemap: `https://${STORE.domain}/sitemap.xml`,
  };
}
