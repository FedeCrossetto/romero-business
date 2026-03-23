-- Migration: add quantity_options to products
-- Stores comma-separated numeric chip values, e.g. "0.25,0.5,1,2" for kg or "1,2,3" for units
-- NULL means use default behaviour (kg chips or +/- spinner)
ALTER TABLE products ADD COLUMN IF NOT EXISTS quantity_options text DEFAULT NULL;
