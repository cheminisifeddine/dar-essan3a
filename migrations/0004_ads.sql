-- FB Ads tracking for Dar el Sanaa (seller never uses Ads Manager)
CREATE TABLE IF NOT EXISTS fb_ads (
  id TEXT PRIMARY KEY,
  store_id TEXT DEFAULT 'main',
  product_slug TEXT NOT NULL,
  product_name TEXT,
  variant_id TEXT DEFAULT 'v1',
  primary_text TEXT,
  headline TEXT,
  image_url TEXT,
  product_url TEXT,
  meta_campaign_id TEXT,
  meta_adset_id TEXT,
  meta_ad_id TEXT,
  meta_creative_id TEXT,
  daily_budget_dzd INTEGER DEFAULT 1000,
  status TEXT DEFAULT 'DRAFT', -- DRAFT | PENDING_APPROVAL | ACTIVE | PAUSED | ARCHIVED | KILLED
  spend REAL DEFAULT 0,
  impressions INTEGER DEFAULT 0,
  clicks INTEGER DEFAULT 0,
  orders INTEGER DEFAULT 0,
  created_at INTEGER DEFAULT (strftime('%s','now')),
  updated_at INTEGER DEFAULT (strftime('%s','now'))
);
CREATE INDEX IF NOT EXISTS idx_fb_ads_store ON fb_ads(store_id);
CREATE INDEX IF NOT EXISTS idx_fb_ads_product ON fb_ads(product_slug);
CREATE INDEX IF NOT EXISTS idx_fb_ads_status ON fb_ads(status);
