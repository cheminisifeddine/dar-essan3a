import type { D1Database } from "@cloudflare/workers-types";

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

export function parseProduct(row: Record<string, any>): Product {
  return {
    ...row,
    price: Number(row.price),
    old_price: Number(row.old_price),
    active: Number(row.active),
    sort_order: Number(row.sort_order),
    bullets: JSON.parse(row.bullets || "[]"),
    images: JSON.parse(row.images || "[]"),
  } as Product;
}

export async function listProducts(activeOnly = true): Promise<Product[]> {
  const db = getDB();
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
      `INSERT INTO products (id, slug, name, hook, description, price, old_price, bullets, images, active, sort_order)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
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
      p.sort_order
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
  fields.push("updated_at = strftime('%s','now')");
  values.push(id);
  await db.prepare(`UPDATE products SET ${fields.join(", ")} WHERE id = ?`).bind(...values).run();
}

export async function deleteProduct(id: string): Promise<void> {
  const db = getDB();
  await db.prepare("UPDATE products SET active = 0, updated_at = strftime('%s','now') WHERE id = ?").bind(id).run();
}

export async function createOrder(
  order: Omit<Order, "created_at" | "updated_at" | "items">,
  items: OrderItem[]
): Promise<void> {
  const db = getDB();
  await db
    .prepare(
      `INSERT INTO orders (id, customer_name, phone, wilaya, city, address, delivery_type, shipping_fee, total, status, source_utm)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
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
      order.source_utm || null
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

export async function listOrders(limit = 100, offset = 0, status?: string): Promise<Order[]> {
  const db = getDB();
  let sql = "SELECT * FROM orders";
  const params: any[] = [];
  if (status) {
    sql += " WHERE status = ?";
    params.push(status);
  }
  sql += " ORDER BY created_at DESC LIMIT ? OFFSET ?";
  params.push(limit, offset);
  const { results } = await db.prepare(sql).bind(...params).all();
  return (results || []).map((row) => ({ ...row, shipping_fee: Number(row.shipping_fee), total: Number(row.total) } as Order));
}

export async function countOrders(status?: string): Promise<number> {
  const db = getDB();
  let sql = "SELECT COUNT(*) as c FROM orders";
  const params: any[] = [];
  if (status) { sql += " WHERE status = ?"; params.push(status); }
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

export async function getStats(): Promise<{ totalRevenue: number; totalOrders: number; pendingOrders: number; totalCustomers: number; topWilayas: { wilaya: string; count: number }[] }> {
  const db = getDB();
  const totalOrders = await countOrders();
  const pendingOrders = await countOrders("pending");
  const revenueRow = await db.prepare("SELECT COALESCE(SUM(total),0) as total FROM orders WHERE status != 'cancelled'").first();
  const totalRevenue = Number((revenueRow as any)?.total || 0);
  const customersRow = await db.prepare("SELECT COUNT(*) as c FROM customers").first();
  const totalCustomers = Number((customersRow as any)?.c || 0);
  const { results } = await db
    .prepare("SELECT wilaya, COUNT(*) as count FROM orders GROUP BY wilaya ORDER BY count DESC LIMIT 10")
    .all();
  return {
    totalRevenue,
    totalOrders,
    pendingOrders,
    totalCustomers,
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
