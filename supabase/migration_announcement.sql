-- Agrega los campos de banner de anuncio a la tabla settings
-- Ejecutar en Supabase SQL Editor

INSERT INTO settings (key, value) VALUES
  ('announcement_active', 'false'),
  ('announcement_text',   '')
ON CONFLICT (key) DO NOTHING;
