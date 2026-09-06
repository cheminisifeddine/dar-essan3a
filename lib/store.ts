import { Store } from "./db";

export const MAIN_DOMAIN = "darelsanaa.com";

export const DEFAULT_STORE: Store = {
  id: "main",
  name: "دار الصنعة",
  subdomain: "main",
  domain: MAIN_DOMAIN,
  text_color: "#241F18",
  primary_color: "#1E3A2A",
  secondary_color: "#C19A3D",
  bg_color: "#F7F2E9",
  hero_title: "من بوسعادة… إلى بيتك",
  hero_subtitle: "قطع تقليدية جزائرية أصيلة، تصنعها أيادي حرفيي بوسعادة — توصيل لكل ولايات الوطن، والدفع عند الاستلام.",
  announcement_bar: "الدفع عند الاستلام 💵 | توصيل لـ 58 ولاية 🚚 | صناعة يدوية 100% من بوسعادة 🤲",
  description: "دار الصنعة — قطع تقليدية جزائرية أصلية من بوسعادة: نسيج النخيل، الفخار، النحاس، واللوحات.",
  whatsapp_number: "213558522110",
  fb_page: "https://www.facebook.com/profile.php?id=61592694953321",
  pixel_id: "1459121952706477",
  currency: "دج",
  home_delivery_fee: 500,
  stopdesk_fee: 350,
  free_shipping_threshold: 6000,
  meta_title: "دار الصنعة — منتجات تقليدية جزائرية أصلية من بوسعادة",
  meta_description: "قطع تقليدية جزائرية أصيلة من بوسعادة: نسيج النخيل، الفخار، النحاس، واللوحات. توصيل لـ 58 ولاية، والدفع عند الاستلام.",
  active: 1,
  created_at: 0,
  updated_at: 0,
};

/**
 * Extract subdomain from incoming request hostname.
 * Examples:
 * - sante.darelsanaa.com -> "sante"
 * - sante.localhost:3000 -> "sante"
 * - darelsanaa.com -> "main"
 * - www.darelsanaa.com -> "main"
 * - localhost:3000 -> "main"
 */
export function extractSubdomain(hostHeader: string | null): string {
  if (!hostHeader) return "main";

  // Strip port
  const hostname = hostHeader.split(":")[0].toLowerCase().trim();

  // IP addresses (local dev, direct IP access) have no subdomain
  if (/^\d{1,3}(\.\d{1,3}){3}$/.test(hostname)) return "main";

  // Handle localhost: e.g. sante.localhost
  if (hostname.endsWith(".localhost")) {
    const sub = hostname.replace(/\.localhost$/, "");
    if (sub && sub !== "www" && sub !== "admin") return sub;
    return "main";
  }

  // Handle darelsanaa.com
  if (hostname === MAIN_DOMAIN || hostname === `www.${MAIN_DOMAIN}`) {
    return "main";
  }

  if (hostname.endsWith(`.${MAIN_DOMAIN}`)) {
    const sub = hostname.replace(`.${MAIN_DOMAIN}`, "");
    if (sub && sub !== "www" && sub !== "admin") return sub;
    return "main";
  }

  // Handle generic domain with subdomains (e.g. *.pages.dev)
  const parts = hostname.split(".");
  if (parts.length >= 3) {
    const sub = parts[0];
    if (sub && sub !== "www" && sub !== "admin") return sub;
  }

  return "main";
}

/**
 * Generates the full URL for a store's subdomain under darelsanaa.com.
 * For example, "sante" -> "https://sante.darelsanaa.com"
 * If it's the main store, returns "https://darelsanaa.com"
 */
export function getStoreUrl(subdomain: string, isDev = false, port = "3000"): string {
  const cleanSub = subdomain.toLowerCase().trim();
  if (isDev) {
    if (cleanSub === "main" || !cleanSub) return `http://localhost:${port}`;
    return `http://${cleanSub}.localhost:${port}`;
  }
  if (cleanSub === "main" || !cleanSub) return `https://${MAIN_DOMAIN}`;
  return `https://${cleanSub}.${MAIN_DOMAIN}`;
}

/**
 * Generates preview link (using query parameter) suitable for testing anywhere
 */
export function getStorePreviewUrl(subdomain: string, path = "/"): string {
  const cleanSub = subdomain.toLowerCase().trim();
  const sep = path.includes("?") ? "&" : "?";
  if (cleanSub === "main" || !cleanSub) return path;
  return `${path}${sep}store=${encodeURIComponent(cleanSub)}`;
}

/**
 * Validates a proposed subdomain slug.
 * Must be 2-30 characters, alphanumeric and hyphens, no leading/trailing hyphen.
 */
export function validateSubdomain(subdomain: string): { valid: boolean; error?: string } {
  const s = subdomain.toLowerCase().trim();
  if (!s) return { valid: false, error: "Subdomain is required" };
  if (s.length < 2) return { valid: false, error: "Subdomain must be at least 2 characters" };
  if (s.length > 32) return { valid: false, error: "Subdomain must be 32 characters or fewer" };
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(s)) {
    return {
      valid: false,
      error: "Subdomain can only contain lowercase letters, numbers, and hyphens (cannot start or end with a hyphen)",
    };
  }
  const reserved = ["www", "admin", "api", "app", "mail", "cdn", "static", "assets", "ftp", "cpanel", "webmail"];
  if (reserved.includes(s)) {
    return { valid: false, error: `Subdomain '${s}' is reserved` };
  }
  return { valid: true };
}
