-- Add SEO / social meta fields to products
ALTER TABLE products ADD COLUMN meta_title TEXT;
ALTER TABLE products ADD COLUMN meta_description TEXT;
ALTER TABLE products ADD COLUMN og_image TEXT;

-- Seed defaults from existing data
UPDATE products
SET
  meta_title = name || ' — دار الصنعة',
  meta_description = COALESCE(description, name),
  og_image = COALESCE(json_extract(images, '$[0]'), '');
