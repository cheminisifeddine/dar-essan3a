import type { D1Database } from "@cloudflare/workers-types";

export type Store = {
  id: string;
  name: string;
  subdomain: string;
  domain?: string;
  text_color: string;
  primary_color: string;
  secondary_color: string;
  bg_color: string;
  hero_title?: string;
  hero_subtitle?: string;
  announcement_bar?: string;
  description?: string;
  logo_url?: string;
  whatsapp_number: string;
  fb_page?: string;
  pixel_id: string;
  currency: string;
  home_delivery_fee: number;
  stopdesk_fee: number;
  free_shipping_threshold: number;
  meta_title?: string;
  meta_description?: string;
  active: number;
  created_at: number;
  updated_at: number;
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  hook: string;
  description: string;
  price: number;
  old_price: number;
  bullets: string[];
  images: string[];
  meta_title?: string;
  meta_description?: string;
  og_image?: string;
  store_id?: string;
  active: number;
  sort_order: number;
  created_at: number;
  updated_at: number;
};

export type OrderItem = {
  product_id?: string;
  product_slug?: string;
  product_name: string;
  qty: number;
  price: number;
};

export type Order = {
  id: string;
  customer_name: string;
  phone: string;
  wilaya: string;
  city: string;
  address?: string;
  delivery_type: "home" | "stopdesk";
  shipping_fee: number;
  total: number;
  status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";
  source_utm?: string;
  store_id?: string;
  created_at: number;
  updated_at: number;
  items?: OrderItem[];
};

export type Customer = {
  phone: string;
  name?: string;
  total_orders: number;
  total_spent: number;
  first_seen: number;
  last_seen: number;
};

function getDB(): D1Database {
  const db = (process.env as any).DB as D1Database | undefined;
  if (!db) throw new Error("D1 database binding not found");
  return db;
}

export function parseStore(row: Record<string, any>): Store {
  return {
    id: String(row.id),
    name: String(row.name || ""),
    subdomain: String(row.subdomain || ""),
    domain: row.domain ? String(row.domain) : undefined,
    text_color: String(row.text_color || "#241F18"),
    primary_color: String(row.primary_color || "#1E3A2A"),
    secondary_color: String(row.secondary_color || "#C19A3D"),
    bg_color: String(row.bg_color || "#F7F2E9"),
    hero_title: row.hero_title ? String(row.hero_title) : undefined,
    hero_subtitle: row.hero_subtitle ? String(row.hero_subtitle) : undefined,
    announcement_bar: row.announcement_bar ? String(row.announcement_bar) : undefined,
    description: row.description ? String(row.description) : undefined,
    logo_url: row.logo_url ? String(row.logo_url) : undefined,
    whatsapp_number: row.whatsapp_number ? String(row.whatsapp_number) : "213558522110",
    fb_page: row.fb_page ? String(row.fb_page) : undefined,
    pixel_id: row.pixel_id ? String(row.pixel_id) : "1459121952706477",
    currency: String(row.currency || "دج"),
    home_delivery_fee: Number(row.home_delivery_fee || 500),
    stopdesk_fee: Number(row.stopdesk_fee || 350),
    free_shipping_threshold: Number(row.free_shipping_threshold || 6000),
    meta_title: row.meta_title ? String(row.meta_title) : undefined,
    meta_description: row.meta_description ? String(row.meta_description) : undefined,
    active: Number(row.active ?? 1),
    created_at: Number(row.created_at || 0),
    updated_at: Number(row.updated_at || 0),
  };
}

export function parseProduct(row: Record<string, any>): Product {
  return {
    ...row,
    price: Number(row.price),
    old_price: Number(row.old_price),
    active: Number(row.active),
    sort_order: Number(row.sort_order),
    store_id: row.store_id || "main",
    bullets: JSON.parse(row.bullets || "[]"),
    images: JSON.parse(row.images || "[]"),
  } as Product;
}

// ==========================================
// Stores Functions
// ==========================================

export async function listStores(activeOnly = true): Promise<Store[]> {
  const db = getDB();
  const sql = activeOnly
    ? "SELECT * FROM stores WHERE active = 1 ORDER BY (id = 'main') DESC, created_at ASC"
    : "SELECT * FROM stores ORDER BY (id = 'main') DESC, created_at ASC";
  const { results } = await db.prepare(sql).all();
  return (results || []).map(parseStore);
}

export async function getStoreById(id: string): Promise<Store | null> {
  const db = getDB();
  const row = await db.prepare("SELECT * FROM stores WHERE id = ?").bind(id).first();
  return row ? parseStore(row) : null;
}

export async function getStoreBySubdomain(subdomain: string): Promise<Store | null> {
  const db = getDB();
  const clean = subdomain.toLowerCase().trim();
  const row = await db
    .prepare("SELECT * FROM stores WHERE subdomain = ? COLLATE NOCASE AND active = 1")
    .bind(clean)
    .first();
  return row ? parseStore(row) : null;
}

export async function getDefaultStore(): Promise<Store> {
  try {
    const main = await getStoreBySubdomain("main");
    if (main) return main;
    const stores = await listStores(true);
    if (stores.length > 0) return stores[0];
  } catch (e) {
    console.error("Failed to query stores from DB, using fallback", e);
  }

  // Hardcoded default fallback
  return {
    id: "main",
    name: "دار الصنعة",
    subdomain: "main",
    domain: "darelsanaa.com",
    text_color: "#241F18",
    primary_color: "#1E3A2A",
    secondary_color: "#C19A3D",
    bg_color: "#F7F2E9",
    hero_title: "من بوسعادة… إلى بيتك",
    hero_subtitle: "قطع تقليدية جزائرية أصيلة، تصنعها أيادي حرفيي بوسعادة — توصيل لكل ولايات الوطن، والدفع عند الاستلام.",
    announcement_bar: "الدفع عند الاستلام 💵 | توصيل لـ 58 ولاية 🚚 | صناعة يدوية 100% من بوسعادة 🤲",
    description: "دار الصنعة — قطع تقليدية جزائرية أصلية من بوسعادة.",
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
}

export async function createStore(s: Omit<Store, "created_at" | "updated_at">): Promise<void> {
  const db = getDB();
  const domain = s.domain || (s.subdomain === "main" ? "darelsanaa.com" : `${s.subdomain}.darelsanaa.com`);
  await db
    .prepare(
      `INSERT INTO stores (
        id, name, subdomain, domain, text_color, primary_color, secondary_color, bg_color,
        hero_title, hero_subtitle, announcement_bar, description, logo_url, whatsapp_number,
        fb_page, pixel_id, currency, home_delivery_fee, stopdesk_fee, free_shipping_threshold,
        meta_title, meta_description, active
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    )
    .bind(
      s.id,
      s.name,
      s.subdomain.toLowerCase().trim(),
      domain,
      s.text_color || "#241F18",
      s.primary_color || "#1E3A2A",
      s.secondary_color || "#C19A3D",
      s.bg_color || "#F7F2E9",
      s.hero_title || null,
      s.hero_subtitle || null,
      s.announcement_bar || null,
      s.description || null,
      s.logo_url || null,
      s.whatsapp_number || "213558522110",
      s.fb_page || null,
      s.pixel_id || "1459121952706477",
      s.currency || "دج",
      s.home_delivery_fee ?? 500,
      s.stopdesk_fee ?? 350,
      s.free_shipping_threshold ?? 6000,
      s.meta_title || null,
      s.meta_description || null,
      s.active ?? 1
    )
    .run();
}

export async function updateStore(id: string, s: Partial<Omit<Store, "id" | "created_at" | "updated_at">>): Promise<void> {
  const db = getDB();
  const fields: string[] = [];
  const values: any[] = [];

  if (s.name !== undefined) { fields.push("name = ?"); values.push(s.name); }
  if (s.subdomain !== undefined) {
    fields.push("subdomain = ?");
    values.push(s.subdomain.toLowerCase().trim());
    fields.push("domain = ?");
    values.push(s.subdomain === "main" ? "darelsanaa.com" : `${s.subdomain.toLowerCase().trim()}.darelsanaa.com`);
  }
  if (s.text_color !== undefined) { fields.push("text_color = ?"); values.push(s.text_color); }
  if (s.primary_color !== undefined) { fields.push("primary_color = ?"); values.push(s.primary_color); }
  if (s.secondary_color !== undefined) { fields.push("secondary_color = ?"); values.push(s.secondary_color); }
  if (s.bg_color !== undefined) { fields.push("bg_color = ?"); values.push(s.bg_color); }
  if (s.hero_title !== undefined) { fields.push("hero_title = ?"); values.push(s.hero_title); }
  if (s.hero_subtitle !== undefined) { fields.push("hero_subtitle = ?"); values.push(s.hero_subtitle); }
  if (s.announcement_bar !== undefined) { fields.push("announcement_bar = ?"); values.push(s.announcement_bar); }
  if (s.description !== undefined) { fields.push("description = ?"); values.push(s.description); }
  if (s.logo_url !== undefined) { fields.push("logo_url = ?"); values.push(s.logo_url); }
  if (s.whatsapp_number !== undefined) { fields.push("whatsapp_number = ?"); values.push(s.whatsapp_number); }
  if (s.fb_page !== undefined) { fields.push("fb_page = ?"); values.push(s.fb_page); }
  if (s.pixel_id !== undefined) { fields.push("pixel_id = ?"); values.push(s.pixel_id); }
  if (s.currency !== undefined) { fields.push("currency = ?"); values.push(s.currency); }
  if (s.home_delivery_fee !== undefined) { fields.push("home_delivery_fee = ?"); values.push(s.home_delivery_fee); }
  if (s.stopdesk_fee !== undefined) { fields.push("stopdesk_fee = ?"); values.push(s.stopdesk_fee); }
  if (s.free_shipping_threshold !== undefined) { fields.push("free_shipping_threshold = ?"); values.push(s.free_shipping_threshold); }
  if (s.meta_title !== undefined) { fields.push("meta_title = ?"); values.push(s.meta_title); }
  if (s.meta_description !== undefined) { fields.push("meta_description = ?"); values.push(s.meta_description); }
  if (s.active !== undefined) { fields.push("active = ?"); values.push(s.active); }

  fields.push("updated_at = strftime('%s','now')");
  values.push(id);

  await db.prepare(`UPDATE stores SET ${fields.join(", ")} WHERE id = ?`).bind(...values).run();
}

export async function deleteStore(id: string): Promise<void> {
  const db = getDB();
  if (id === "main") {
    throw new Error("Cannot delete main store");
  }
  await db.prepare("UPDATE stores SET active = 0, updated_at = strftime('%s','now') WHERE id = ?").bind(id).run();
}

// ==========================================
// Products Functions
// ==========================================

export async function listProducts(activeOnly = true, storeId?: string): Promise<Product[]> {
  const db = getDB();

  // Strict store separation: a store ONLY sees its own products (+ those
  // explicitly shared with store_id = 'all'). No cross-store leakage.
  if (storeId && storeId !== "all") {
    const sql = activeOnly
      ? "SELECT * FROM products WHERE active = 1 AND (store_id = ? OR store_id = 'all') ORDER BY sort_order, name"
      : "SELECT * FROM products WHERE (store_id = ? OR store_id = 'all') ORDER BY sort_order, name";
    const { results } = await db.prepare(sql).bind(storeId).all();
    return (results || []).map(parseProduct);
  }

  const sql = activeOnly
    ? "SELECT * FROM products WHERE active = 1 ORDER BY sort_order, name"
    : "SELECT * FROM products ORDER BY sort_order, name";
  const { results } = await db.prepare(sql).all();
  return (results || []).map(parseProduct);
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const db = getDB();
  const row = await db.prepare("SELECT * FROM products WHERE slug = ?").bind(slug).first();
  return row ? parseProduct(row) : null;
}

export async function getProductById(id: string): Promise<Product | null> {
  const db = getDB();
  const row = await db.prepare("SELECT * FROM products WHERE id = ?").bind(id).first();
  return row ? parseProduct(row) : null;
}

export async function createProduct(p: Omit<Product, "created_at" | "updated_at">): Promise<void> {
  const db = getDB();
  await db
    .prepare(
      `INSERT INTO products (id, slug, name, hook, description, price, old_price, bullets, images, active, sort_order, store_id)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    )
    .bind(
      p.id,
      p.slug,
      p.name,
      p.hook,
      p.description,
      p.price,
      p.old_price,
      JSON.stringify(p.bullets),
      JSON.stringify(p.images),
      p.active,
      p.sort_order,
      p.store_id || "main"
    )
    .run();
}

export async function updateProduct(id: string, p: Partial<Omit<Product, "id" | "created_at" | "updated_at">>): Promise<void> {
  const db = getDB();
  const fields: string[] = [];
  const values: any[] = [];
  if (p.slug !== undefined) { fields.push("slug = ?"); values.push(p.slug); }
  if (p.name !== undefined) { fields.push("name = ?"); values.push(p.name); }
  if (p.hook !== undefined) { fields.push("hook = ?"); values.push(p.hook); }
  if (p.description !== undefined) { fields.push("description = ?"); values.push(p.description); }
  if (p.price !== undefined) { fields.push("price = ?"); values.push(p.price); }
  if (p.old_price !== undefined) { fields.push("old_price = ?"); values.push(p.old_price); }
  if (p.bullets !== undefined) { fields.push("bullets = ?"); values.push(JSON.stringify(p.bullets)); }
  if (p.images !== undefined) { fields.push("images = ?"); values.push(JSON.stringify(p.images)); }
  if (p.active !== undefined) { fields.push("active = ?"); values.push(p.active); }
  if (p.sort_order !== undefined) { fields.push("sort_order = ?"); values.push(p.sort_order); }
  if (p.store_id !== undefined) { fields.push("store_id = ?"); values.push(p.store_id); }
  fields.push("updated_at = strftime('%s','now')");
  values.push(id);
  await db.prepare(`UPDATE products SET ${fields.join(", ")} WHERE id = ?`).bind(...values).run();
}

export async function deleteProduct(id: string): Promise<void> {
  const db = getDB();
  await db.prepare("UPDATE products SET active = 0, updated_at = strftime('%s','now') WHERE id = ?").bind(id).run();
}

// ==========================================
// Orders Functions
// ==========================================

export async function createOrder(
  order: Omit<Order, "created_at" | "updated_at" | "items">,
  items: OrderItem[]
): Promise<void> {
  const db = getDB();
  await db
    .prepare(
      `INSERT INTO orders (id, customer_name, phone, wilaya, city, address, delivery_type, shipping_fee, total, status, source_utm, store_id)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    )
    .bind(
      order.id,
      order.customer_name,
      order.phone,
      order.wilaya,
      order.city,
      order.address || null,
      order.delivery_type,
      order.shipping_fee,
      order.total,
      order.status,
      order.source_utm || null,
      order.store_id || "main"
    )
    .run();

  const itemStmt = db.prepare(
    "INSERT INTO order_items (order_id, product_id, product_slug, product_name, qty, price) VALUES (?, ?, ?, ?, ?, ?)"
  );
  for (const item of items) {
    await itemStmt.bind(order.id, item.product_id || null, item.product_slug || null, item.product_name, item.qty, item.price).run();
  }

  // upsert customer
  const existing = await db.prepare("SELECT * FROM customers WHERE phone = ?").bind(order.phone).first();
  if (existing) {
    await db
      .prepare(
        "UPDATE customers SET name = ?, total_orders = total_orders + 1, total_spent = total_spent + ?, last_seen = strftime('%s','now') WHERE phone = ?"
      )
      .bind(order.customer_name, order.total, order.phone)
      .run();
  } else {
    await db
      .prepare("INSERT INTO customers (phone, name, total_orders, total_spent) VALUES (?, ?, 1, ?)")
      .bind(order.phone, order.customer_name, order.total)
      .run();
  }
}

export async function listOrders(limit = 100, offset = 0, status?: string, storeId?: string): Promise<Order[]> {
  const db = getDB();
  let sql = "SELECT * FROM orders";
  const conditions: string[] = [];
  const params: any[] = [];
  if (status) {
    conditions.push("status = ?");
    params.push(status);
  }
  if (storeId && storeId !== "all") {
    conditions.push("store_id = ?");
    params.push(storeId);
  }
  if (conditions.length > 0) {
    sql += " WHERE " + conditions.join(" AND ");
  }
  sql += " ORDER BY created_at DESC LIMIT ? OFFSET ?";
  params.push(limit, offset);
  const { results } = await db.prepare(sql).bind(...params).all();
  return (results || []).map((row) => ({ ...row, shipping_fee: Number(row.shipping_fee), total: Number(row.total) } as Order));
}

export async function countOrders(status?: string, storeId?: string): Promise<number> {
  const db = getDB();
  let sql = "SELECT COUNT(*) as c FROM orders";
  const conditions: string[] = [];
  const params: any[] = [];
  if (status) { conditions.push("status = ?"); params.push(status); }
  if (storeId && storeId !== "all") { conditions.push("store_id = ?"); params.push(storeId); }
  if (conditions.length > 0) {
    sql += " WHERE " + conditions.join(" AND ");
  }
  const row = await db.prepare(sql).bind(...params).first();
  return Number((row as any)?.c || 0);
}

export async function getOrderById(id: string): Promise<Order | null> {
  const db = getDB();
  const row = await db.prepare("SELECT * FROM orders WHERE id = ?").bind(id).first();
  if (!row) return null;
  const items = await db.prepare("SELECT * FROM order_items WHERE order_id = ?").bind(id).all();
  return { ...row, shipping_fee: Number(row.shipping_fee), total: Number(row.total), items: (items.results || []) as OrderItem[] } as Order;
}

export async function updateOrderStatus(id: string, status: Order["status"]): Promise<void> {
  const db = getDB();
  await db
    .prepare("UPDATE orders SET status = ?, updated_at = strftime('%s','now') WHERE id = ?")
    .bind(status, id)
    .run();
}

export async function updateOrder(id: string, data: Partial<Order>): Promise<void> {
  const db = getDB();
  const fields: string[] = [];
  const values: any[] = [];
  if (data.customer_name !== undefined) { fields.push("customer_name = ?"); values.push(data.customer_name); }
  if (data.phone !== undefined) { fields.push("phone = ?"); values.push(data.phone); }
  if (data.wilaya !== undefined) { fields.push("wilaya = ?"); values.push(data.wilaya); }
  if (data.city !== undefined) { fields.push("city = ?"); values.push(data.city); }
  if (data.address !== undefined) { fields.push("address = ?"); values.push(data.address); }
  if (data.delivery_type !== undefined) { fields.push("delivery_type = ?"); values.push(data.delivery_type); }
  if (data.shipping_fee !== undefined) { fields.push("shipping_fee = ?"); values.push(data.shipping_fee); }
  if (data.total !== undefined) { fields.push("total = ?"); values.push(data.total); }
  if (data.status !== undefined) { fields.push("status = ?"); values.push(data.status); }
  if (data.store_id !== undefined) { fields.push("store_id = ?"); values.push(data.store_id); }
  fields.push("updated_at = strftime('%s','now')");
  values.push(id);
  await db.prepare(`UPDATE orders SET ${fields.join(", ")} WHERE id = ?`).bind(...values).run();
}

export async function deleteOrder(id: string): Promise<void> {
  const db = getDB();
  await db.prepare("DELETE FROM orders WHERE id = ?").bind(id).run();
}

export async function listCustomers(): Promise<Customer[]> {
  const db = getDB();
  const { results } = await db.prepare("SELECT * FROM customers ORDER BY last_seen DESC").all();
  return (results || []).map((row) => ({
    ...row,
    total_orders: Number(row.total_orders),
    total_spent: Number(row.total_spent),
  } as Customer));
}

export async function getStats(storeId?: string): Promise<{
  totalRevenue: number;
  totalOrders: number;
  pendingOrders: number;
  totalCustomers: number;
  totalStores: number;
  topWilayas: { wilaya: string; count: number }[];
}> {
  const db = getDB();
  const totalOrders = await countOrders(undefined, storeId);
  const pendingOrders = await countOrders("pending", storeId);

  let revSql = "SELECT COALESCE(SUM(total),0) as total FROM orders WHERE status != 'cancelled'";
  const revParams: any[] = [];
  if (storeId && storeId !== "all") {
    revSql += " AND store_id = ?";
    revParams.push(storeId);
  }
  const revenueRow = await db.prepare(revSql).bind(...revParams).first();
  const totalRevenue = Number((revenueRow as any)?.total || 0);

  const customersRow = await db.prepare("SELECT COUNT(*) as c FROM customers").first();
  const totalCustomers = Number((customersRow as any)?.c || 0);

  const storesRow = await db.prepare("SELECT COUNT(*) as c FROM stores WHERE active = 1").first();
  const totalStores = Number((storesRow as any)?.c || 1);

  let wilayaSql = "SELECT wilaya, COUNT(*) as count FROM orders";
  const wilayaParams: any[] = [];
  if (storeId && storeId !== "all") {
    wilayaSql += " WHERE store_id = ?";
    wilayaParams.push(storeId);
  }
  wilayaSql += " GROUP BY wilaya ORDER BY count DESC LIMIT 10";

  const { results } = await db.prepare(wilayaSql).bind(...wilayaParams).all();
  return {
    totalRevenue,
    totalOrders,
    pendingOrders,
    totalCustomers,
    totalStores,
    topWilayas: (results || []).map((row) => ({ wilaya: row.wilaya as string, count: Number(row.count) })),
  };
}

export async function getSettings(): Promise<Record<string, string>> {
  const db = getDB();
  const { results } = await db.prepare("SELECT key, value FROM settings").all();
  const map: Record<string, string> = {};
  (results || []).forEach((row: any) => {
    map[row.key] = row.value;
  });
  return map;
}

export async function getSetting(key: string, defaultValue = ""): Promise<string> {
  const db = getDB();
  const row = await db.prepare("SELECT value FROM settings WHERE key = ?").bind(key).first();
  return (row as any)?.value || defaultValue;
}

export async function setSetting(key: string, value: string): Promise<void> {
  const db = getDB();
  await db.prepare("INSERT INTO settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value").bind(key, value).run();
}

export async function setSettingsBatch(settings: Record<string, string>): Promise<void> {
  const db = getDB();
  const stmt = db.prepare("INSERT INTO settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value");
  for (const [key, value] of Object.entries(settings)) {
    await stmt.bind(key, value).run();
  }
}
