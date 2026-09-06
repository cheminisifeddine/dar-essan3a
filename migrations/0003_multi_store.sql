-- Multi-Store Migration for Dar El Sanaa
-- Allows seller to create multiple stores with unique names, text colors, and subdomains under darelsanaa.com

CREATE TABLE IF NOT EXISTS stores (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  subdomain TEXT UNIQUE NOT NULL,
  domain TEXT,
  text_color TEXT DEFAULT '#241F18',
  primary_color TEXT DEFAULT '#1E3A2A',
  secondary_color TEXT DEFAULT '#C19A3D',
  bg_color TEXT DEFAULT '#F7F2E9',
  hero_title TEXT,
  hero_subtitle TEXT,
  announcement_bar TEXT,
  description TEXT,
  logo_url TEXT,
  whatsapp_number TEXT DEFAULT '213558522110',
  fb_page TEXT,
  pixel_id TEXT DEFAULT '1459121952706477',
  currency TEXT DEFAULT 'دج',
  home_delivery_fee INTEGER DEFAULT 500,
  stopdesk_fee INTEGER DEFAULT 350,
  free_shipping_threshold INTEGER DEFAULT 6000,
  meta_title TEXT,
  meta_description TEXT,
  active INTEGER DEFAULT 1,
  created_at INTEGER DEFAULT (strftime('%s','now')),
  updated_at INTEGER DEFAULT (strftime('%s','now'))
);

CREATE INDEX IF NOT EXISTS idx_stores_subdomain ON stores(subdomain);
CREATE INDEX IF NOT EXISTS idx_stores_active ON stores(active);

-- Seed default main store (darelsanaa.com)
INSERT OR IGNORE INTO stores (
  id, name, subdomain, domain, text_color, primary_color, secondary_color, bg_color,
  hero_title, hero_subtitle, announcement_bar, whatsapp_number, pixel_id,
  home_delivery_fee, stopdesk_fee, free_shipping_threshold,
  meta_title, meta_description, active
) VALUES (
  'main',
  'دار الصنعة',
  'main',
  'darelsanaa.com',
  '#241F18',
  '#1E3A2A',
  '#C19A3D',
  '#F7F2E9',
  'من بوسعادة… إلى بيتك',
  'قطع تقليدية جزائرية أصيلة، تصنعها أيادي حرفيي بوسعادة — توصيل لكل ولايات الوطن، والدفع عند الاستلام.',
  'الدفع عند الاستلام 💵 | توصيل لـ 58 ولاية 🚚 | صناعة يدوية 100% من بوسعادة 🤲',
  '213558522110',
  '1459121952706477',
  500,
  350,
  6000,
  'دار الصنعة — منتجات تقليدية جزائرية أصلية من بوسعادة',
  'قطع تقليدية جزائرية أصيلة من بوسعادة: نسيج النخيل، الفخار، النحاس، واللوحات. توصيل لـ 58 ولاية، والدفع عند الاستلام.',
  1
);

-- Seed Santé store (sante.darelsanaa.com)
INSERT OR IGNORE INTO stores (
  id, name, subdomain, domain, text_color, primary_color, secondary_color, bg_color,
  hero_title, hero_subtitle, announcement_bar, whatsapp_number, pixel_id,
  home_delivery_fee, stopdesk_fee, free_shipping_threshold,
  meta_title, meta_description, active
) VALUES (
  'sante',
  'دار الصنعة — متجر الصحة والعافية',
  'sante',
  'sante.darelsanaa.com',
  '#12372A',
  '#004225',
  '#43766C',
  '#F5FAF5',
  'أصالة الطبيعة لصحتك وعافيتك',
  'أواني الفخار الطبيعي لحفظ نقاء وبرودة الماء، والمهراس النحاسي الصحي — تراث جزائري لحياة صحية ومتوازنة.',
  '🌿 متجر الصحة والعافية — توصيل لـ 58 ولاية | الدفع عند الاستلام',
  '213558522110',
  '1459121952706477',
  500,
  350,
  6000,
  'متجر الصحة والعافية — دار الصنعة',
  'منتجات طبيعية وتراثية صحية من بوسعادة على sante.darelsanaa.com. توصيل متوفر لـ 58 ولاية، والدفع عند الاستلام.',
  1
);

-- Add store_id to products and orders if not exists
-- (SQLite ignores duplicate column if handled or we alter)
ALTER TABLE products ADD COLUMN store_id TEXT DEFAULT 'main';
ALTER TABLE orders ADD COLUMN store_id TEXT DEFAULT 'main';

CREATE INDEX IF NOT EXISTS idx_products_store_id ON products(store_id);
CREATE INDEX IF NOT EXISTS idx_orders_store_id ON orders(store_id);

-- Assign health/natural crafts to Santé store as well or default
UPDATE products SET store_id = 'sante' WHERE slug IN ('qolla-tissage', 'mortier-cuivre');
