-- Enable foreign keys
PRAGMA foreign_keys = ON;

-- Products
CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  hook TEXT,
  description TEXT,
  price INTEGER NOT NULL,
  old_price INTEGER,
  bullets TEXT NOT NULL DEFAULT '[]',
  images TEXT NOT NULL DEFAULT '[]',
  active INTEGER DEFAULT 1,
  sort_order INTEGER DEFAULT 0,
  created_at INTEGER DEFAULT (strftime('%s','now')),
  updated_at INTEGER DEFAULT (strftime('%s','now'))
);

-- Orders
CREATE TABLE IF NOT EXISTS orders (
  id TEXT PRIMARY KEY,
  customer_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  wilaya TEXT NOT NULL,
  city TEXT NOT NULL,
  address TEXT,
  delivery_type TEXT CHECK(delivery_type IN ('home','stopdesk')) DEFAULT 'home',
  shipping_fee INTEGER DEFAULT 0,
  total INTEGER NOT NULL,
  status TEXT CHECK(status IN ('pending','confirmed','shipped','delivered','cancelled')) DEFAULT 'pending',
  source_utm TEXT,
  created_at INTEGER DEFAULT (strftime('%s','now')),
  updated_at INTEGER DEFAULT (strftime('%s','now'))
);

-- Order items
CREATE TABLE IF NOT EXISTS order_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  order_id TEXT NOT NULL,
  product_id TEXT,
  product_slug TEXT,
  product_name TEXT NOT NULL,
  qty INTEGER NOT NULL DEFAULT 1,
  price INTEGER NOT NULL,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
);

-- Customers
CREATE TABLE IF NOT EXISTS customers (
  phone TEXT PRIMARY KEY,
  name TEXT,
  total_orders INTEGER DEFAULT 0,
  total_spent INTEGER DEFAULT 0,
  first_seen INTEGER DEFAULT (strftime('%s','now')),
  last_seen INTEGER DEFAULT (strftime('%s','now'))
);

-- Settings
CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY,
  value TEXT
);

-- Admin sessions
CREATE TABLE IF NOT EXISTS admin_sessions (
  token TEXT PRIMARY KEY,
  expires_at INTEGER NOT NULL
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_phone ON orders(phone);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at);
CREATE INDEX IF NOT EXISTS idx_products_active ON products(active);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);

-- Seed default settings
INSERT OR IGNORE INTO settings (key, value) VALUES ('home_delivery_fee', '500');
INSERT OR IGNORE INTO settings (key, value) VALUES ('stopdesk_fee', '350');
INSERT OR IGNORE INTO settings (key, value) VALUES ('free_shipping_threshold', '6000');
INSERT OR IGNORE INTO settings (key, value) VALUES ('whatsapp_number', '213558522110');
INSERT OR IGNORE INTO settings (key, value) VALUES ('pixel_id', '1459121952706477');
INSERT OR IGNORE INTO settings (key, value) VALUES ('domain', 'darelsanaa.com');
INSERT OR IGNORE INTO settings (key, value) VALUES ('store_name', 'دار الصنعة');
INSERT OR IGNORE INTO settings (key, value) VALUES ('meta_title', 'دار الصنعة — منتجات تقليدية جزائرية أصلية من بوسعادة');
INSERT OR IGNORE INTO settings (key, value) VALUES ('meta_description', 'قطع تقليدية جزائرية أصيلة من بوسعادة: نسيج النخيل، الفخار، النحاس، واللوحات. توصيل لـ 58 ولاية، والدفع عند الاستلام.');
INSERT OR IGNORE INTO settings (key, value) VALUES ('hero_title', 'من بوسعادة… إلى بيتك');
INSERT OR IGNORE INTO settings (key, value) VALUES ('hero_subtitle', 'قطع تقليدية جزائرية أصيلة، تصنعها أيادي حرفيي بوسعادة — توصيل لكل ولايات الوطن، والدفع عند الاستلام.');

-- Seed products
INSERT OR IGNORE INTO products (id, slug, name, hook, description, price, old_price, bullets, images, active, sort_order) VALUES
(
  'p1',
  'chapeau-palmier',
  'قبعة النخيل "شمس بوسعادة"',
  'جمالٌ يقيكِ من الشمس',
  'من ليف النخيل الطبيعي، تُنسج يدوياً غرزةً غرزة على أيادي حرفيات بوسعادة. خفيفة، تسمح بمرور الهواء، وتحميكِ من أشعة الشمس بأناقة تراثية لا تمرّ دون أن يسألكِ أحد عنها. رفيقتك للبحر، للنزهات، ولإطلالة صيفية مختلفة.',
  2790,
  3500,
  '["نسيج يدوي 100% من ليف النخيل الطبيعي","حماية فعالة من الشمس مع تهوية مثالية","خفيفة ومريحة طوال اليوم","كل قطعة فريدة — لا توجد نسختان متطابقتان","تناسب الإطلالات الكاجوال والتقليدية"]',
  '["/images/hat-1.webp","/images/hat-2.webp"]',
  1,
  1
),
(
  'p2',
  'qolla-tissage',
  'قلّة بوسعادة المنسوجة + كأسان',
  'ماء بارد… بدون كهرباء',
  '"ثلاجة الجدّات" كما يسمّيها أهلنا. الفخار الطبيعي يحفظ برودة الماء ساعات طويلة ويمنحه مذاقاً نقياً من بيوت أجدادنا، والنسيج الملوّن المضفور يدوياً يجعلها تحفة تزيّن مطبخك قبل أن تخدمه. تأتي مع كأسين فخاريين منسّقين.',
  3900,
  4500,
  '["فخار طبيعي يحفظ برودة الماء لساعات","غطاء ونسيج ملوّن مضفور يدوياً","تأتي مع كأسين فخاريين منسّقين","صحية، طبيعية، وصديقة للبيئة","ديكور أصيل + استعمال يومي"]',
  '["/images/qolla-1.webp","/images/qolla-2.webp"]',
  1,
  2
),
(
  'p3',
  'tableaux-desert',
  'مجموعة لوحات "روح الصحراء"',
  'لمسة تراثية… روح أصيلة لجدران بيتك',
  'لوحات قماشية مستوحاة من التراث الجزائري الأصيل — الفارس، الطوارقي، وكثبان الصحراء — تضيف لبيتك دفئاً وهوية. طباعة عالية الدقة على قماش، جاهزة للتعليق مباشرة، وهدية مثالية لمن تحب.',
  3400,
  4200,
  '["تصاميم تراثية أصلية من الصحراء الجزائرية","طباعة عالية الدقة على قماش","جاهزة للتعليق مباشرة","عدة مقاسات متناسقة","مثالية للديكور والإهداء"]',
  '["/images/canvas-set-1.webp","/images/canvas-set-2.webp"]',
  1,
  3
),
(
  'p4',
  'tableau-enceadre',
  'اللوحة المؤطّرة "فرحة البرّية"',
  'لوحة تحكي قصة… بإطار يليق بها',
  'مشهد جزائري أصيل يفيض براءةً وفرحاً، في إطار ذهبي كلاسيكي فاخر. قطعة فنية تلفت الأنظار من أول نظرة وتضيف فخامة تراثية لأي جدار — في الصالون، المكتب، أو المدخل.',
  2900,
  3600,
  '["إطار ذهبي كلاسيكي فاخر","ألوان دافئة تناسب كل الديكورات","تصلح للصالون، المكتب، والمداخل","هدية راقية لا تُنسى"]',
  '["/images/painting-1.webp","/images/painting-2.webp"]',
  1,
  4
),
(
  'p5',
  'rondins-bois',
  'أقراص خشبية "فارس الصحراء" — 4 قطع',
  'أربع لوحات… حكاية واحدة',
  'جذوع خشبٍ طبيعي رُسم عليها يدوياً فارسُ الصحراء، بأربعة أحجام تتدرّج كأنها حكاية تُروى. ديكور راقٍ للرفوف والطاولات، وهدية تحمل توقيع حرفيّ… لا آلة.',
  2600,
  3200,
  '["رسم يدوي على خشب طبيعي 100%","4 قطع بأحجام متدرّجة","كل قطعة فريدة من نوعها","ديكور راقٍ وهدية مثالية"]',
  '["/images/wood-1.webp"]',
  1,
  5
),
(
  'p6',
  'mortier-cuivre',
  'المِهراس النحاسي "مِهراس العروسة"',
  'نحاس أصيل… لمطبخ يفخر بأصوله',
  'من نحاسٍ خالص مصقول يدوياً، المِهراس التقليدي الذي لا تستغني عنه المطابخ الجزائرية العريقة — للثوم، البهارات، والحناء. ثقيل، متين، ويزداد جمالاً مع الزمن. قطعة تراث تُورَّث ولا تُستهلك.',
  3200,
  3900,
  '["نحاس خالص مصقول يدوياً","متين وثقيل — يدوم لأجيال","مثالي للثوم والبهارات والحناء","قطعة أساسية في جهاز العروسة الجزائرية","لمعة ذهبية تزيّن مطبخك"]',
  '["/images/mortar-1.webp"]',
  1,
  6
);
