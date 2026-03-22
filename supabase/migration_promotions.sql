-- Add promotion fields to products table
-- Run this in Supabase SQL Editor

ALTER TABLE products
  ADD COLUMN IF NOT EXISTS discount_price numeric(10,2),
  ADD COLUMN IF NOT EXISTS promo_until timestamptz;

-- Optional: verify
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'products'
  AND column_name IN ('discount_price', 'promo_until');
