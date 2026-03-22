-- ============================================================
-- Romero & Co — Productos con imágenes de Supabase Storage
-- Ejecutar en el SQL Editor de Supabase
-- ============================================================

-- URL base de las imágenes
-- https://bnnzmpkuiranmvmzvdqj.supabase.co/storage/v1/object/public/product-images/

-- ============================================================
-- UPSERT DE PRODUCTOS
-- Usa ON CONFLICT (slug) para actualizar si ya existen
-- ============================================================

-- ── VERDURAS ────────────────────────────────────────────────

INSERT INTO products (name, slug, description, price, unit_type, stock, is_featured, is_active, category_id, image_url)
SELECT 'Tomate perita', 'tomate-perita', 'Tomate perita fresco, ideal para salsas', 2500, 'kg', 50, true, true,
  (SELECT id FROM categories WHERE slug = 'verduras'),
  'https://bnnzmpkuiranmvmzvdqj.supabase.co/storage/v1/object/public/product-images/tomates-peritas.png'
ON CONFLICT (slug) DO UPDATE SET
  image_url = EXCLUDED.image_url, price = EXCLUDED.price, stock = EXCLUDED.stock;

INSERT INTO products (name, slug, description, price, unit_type, stock, is_featured, is_active, category_id, image_url)
SELECT 'Tomate redondo', 'tomate-redondo', 'Tomate redondo fresco para ensaladas', 2200, 'kg', 40, false, true,
  (SELECT id FROM categories WHERE slug = 'verduras'),
  'https://bnnzmpkuiranmvmzvdqj.supabase.co/storage/v1/object/public/product-images/tomates-redondos.png'
ON CONFLICT (slug) DO UPDATE SET
  image_url = EXCLUDED.image_url, price = EXCLUDED.price, stock = EXCLUDED.stock;

INSERT INTO products (name, slug, description, price, unit_type, stock, is_featured, is_active, category_id, image_url)
SELECT 'Tomate cherry', 'tomate-cherry', 'Tomate cherry dulce, ideal para ensaladas', 3200, 'kg', 25, true, true,
  (SELECT id FROM categories WHERE slug = 'verduras'),
  'https://bnnzmpkuiranmvmzvdqj.supabase.co/storage/v1/object/public/product-images/tomate-cherry.png'
ON CONFLICT (slug) DO UPDATE SET
  image_url = EXCLUDED.image_url, price = EXCLUDED.price, stock = EXCLUDED.stock;

INSERT INTO products (name, slug, description, price, unit_type, stock, is_featured, is_active, category_id, image_url)
SELECT 'Tomate cherry amarillo', 'tomate-cherry-amarillo', 'Tomate cherry amarillo, muy dulce', 3500, 'kg', 20, false, true,
  (SELECT id FROM categories WHERE slug = 'verduras'),
  'https://bnnzmpkuiranmvmzvdqj.supabase.co/storage/v1/object/public/product-images/tomate-cherry-amarillo.png'
ON CONFLICT (slug) DO UPDATE SET
  image_url = EXCLUDED.image_url, price = EXCLUDED.price, stock = EXCLUDED.stock;

INSERT INTO products (name, slug, description, price, unit_type, stock, is_featured, is_active, category_id, image_url)
SELECT 'Morrón rojo', 'morron-rojo', 'Morrón rojo fresco, ideal para asar o comer crudo', 3800, 'kg', 30, false, true,
  (SELECT id FROM categories WHERE slug = 'verduras'),
  'https://bnnzmpkuiranmvmzvdqj.supabase.co/storage/v1/object/public/product-images/morron-rojo.png'
ON CONFLICT (slug) DO UPDATE SET
  image_url = EXCLUDED.image_url, price = EXCLUDED.price, stock = EXCLUDED.stock;

INSERT INTO products (name, slug, description, price, unit_type, stock, is_featured, is_active, category_id, image_url)
SELECT 'Morrón amarillo', 'morron-amarillo', 'Morrón amarillo, dulce y crocante', 4000, 'kg', 20, false, true,
  (SELECT id FROM categories WHERE slug = 'verduras'),
  'https://bnnzmpkuiranmvmzvdqj.supabase.co/storage/v1/object/public/product-images/morron-amarilio.png'
ON CONFLICT (slug) DO UPDATE SET
  image_url = EXCLUDED.image_url, price = EXCLUDED.price, stock = EXCLUDED.stock;

INSERT INTO products (name, slug, description, price, unit_type, stock, is_featured, is_active, category_id, image_url)
SELECT 'Papa blanca', 'papa-blanca', 'Papa blanca seleccionada', 1400, 'kg', 80, false, true,
  (SELECT id FROM categories WHERE slug = 'verduras'),
  'https://bnnzmpkuiranmvmzvdqj.supabase.co/storage/v1/object/public/product-images/papas-blancas.png'
ON CONFLICT (slug) DO UPDATE SET
  image_url = EXCLUDED.image_url, price = EXCLUDED.price, stock = EXCLUDED.stock;

INSERT INTO products (name, slug, description, price, unit_type, stock, is_featured, is_active, category_id, image_url)
SELECT 'Papa negra', 'papa-negra', 'Papa negra con piel, muy cremosa', 1600, 'kg', 60, false, true,
  (SELECT id FROM categories WHERE slug = 'verduras'),
  'https://bnnzmpkuiranmvmzvdqj.supabase.co/storage/v1/object/public/product-images/papas-negras.png'
ON CONFLICT (slug) DO UPDATE SET
  image_url = EXCLUDED.image_url, price = EXCLUDED.price, stock = EXCLUDED.stock;

INSERT INTO products (name, slug, description, price, unit_type, stock, is_featured, is_active, category_id, image_url)
SELECT 'Papín', 'papin', 'Papín andino, ideal para hervir o asar', 2200, 'kg', 30, false, true,
  (SELECT id FROM categories WHERE slug = 'verduras'),
  'https://bnnzmpkuiranmvmzvdqj.supabase.co/storage/v1/object/public/product-images/papin.png'
ON CONFLICT (slug) DO UPDATE SET
  image_url = EXCLUDED.image_url, price = EXCLUDED.price, stock = EXCLUDED.stock;

INSERT INTO products (name, slug, description, price, unit_type, stock, is_featured, is_active, category_id, image_url)
SELECT 'Pepino', 'pepino', 'Pepino fresco para ensaladas', 1800, 'kg', 25, false, true,
  (SELECT id FROM categories WHERE slug = 'verduras'),
  'https://bnnzmpkuiranmvmzvdqj.supabase.co/storage/v1/object/public/product-images/pepinos.png'
ON CONFLICT (slug) DO UPDATE SET
  image_url = EXCLUDED.image_url, price = EXCLUDED.price, stock = EXCLUDED.stock;

INSERT INTO products (name, slug, description, price, unit_type, stock, is_featured, is_active, category_id, image_url)
SELECT 'Rabanito', 'rabanito', 'Rabanito fresco por atado', 900, 'atado', 20, false, true,
  (SELECT id FROM categories WHERE slug = 'verduras'),
  'https://bnnzmpkuiranmvmzvdqj.supabase.co/storage/v1/object/public/product-images/rabanito.png'
ON CONFLICT (slug) DO UPDATE SET
  image_url = EXCLUDED.image_url, price = EXCLUDED.price, stock = EXCLUDED.stock;

INSERT INTO products (name, slug, description, price, unit_type, stock, is_featured, is_active, category_id, image_url)
SELECT 'Remolacha', 'remolacha', 'Remolacha fresca por atado', 1200, 'atado', 25, false, true,
  (SELECT id FROM categories WHERE slug = 'verduras'),
  'https://bnnzmpkuiranmvmzvdqj.supabase.co/storage/v1/object/public/product-images/remolacha-atada.png'
ON CONFLICT (slug) DO UPDATE SET
  image_url = EXCLUDED.image_url, price = EXCLUDED.price, stock = EXCLUDED.stock;

INSERT INTO products (name, slug, description, price, unit_type, stock, is_featured, is_active, category_id, image_url)
SELECT 'Zanahoria', 'zanahoria', 'Zanahoria fresca seleccionada', 1200, 'kg', 60, true, true,
  (SELECT id FROM categories WHERE slug = 'verduras'),
  'https://bnnzmpkuiranmvmzvdqj.supabase.co/storage/v1/object/public/product-images/zanahorias.png'
ON CONFLICT (slug) DO UPDATE SET
  image_url = EXCLUDED.image_url, price = EXCLUDED.price, stock = EXCLUDED.stock;

INSERT INTO products (name, slug, description, price, unit_type, stock, is_featured, is_active, category_id, image_url)
SELECT 'Zapallito largo', 'zapallito-largo', 'Zapallito largo tierno', 1500, 'kg', 35, false, true,
  (SELECT id FROM categories WHERE slug = 'verduras'),
  'https://bnnzmpkuiranmvmzvdqj.supabase.co/storage/v1/object/public/product-images/zapallitos-largos.png'
ON CONFLICT (slug) DO UPDATE SET
  image_url = EXCLUDED.image_url, price = EXCLUDED.price, stock = EXCLUDED.stock;

INSERT INTO products (name, slug, description, price, unit_type, stock, is_featured, is_active, category_id, image_url)
SELECT 'Zapallo anco', 'zapallo-anco', 'Zapallo anco por kg', 1100, 'kg', 40, false, true,
  (SELECT id FROM categories WHERE slug = 'verduras'),
  'https://bnnzmpkuiranmvmzvdqj.supabase.co/storage/v1/object/public/product-images/zapallo-anco.png'
ON CONFLICT (slug) DO UPDATE SET
  image_url = EXCLUDED.image_url, price = EXCLUDED.price, stock = EXCLUDED.stock;

INSERT INTO products (name, slug, description, price, unit_type, stock, is_featured, is_active, category_id, image_url)
SELECT 'Zapallo kabutia', 'zapallo-kabutia', 'Zapallo kabutia de piel verde oscura', 1300, 'kg', 30, false, true,
  (SELECT id FROM categories WHERE slug = 'verduras'),
  'https://bnnzmpkuiranmvmzvdqj.supabase.co/storage/v1/object/public/product-images/zapallo-kabutia.png'
ON CONFLICT (slug) DO UPDATE SET
  image_url = EXCLUDED.image_url, price = EXCLUDED.price, stock = EXCLUDED.stock;

INSERT INTO products (name, slug, description, price, unit_type, stock, is_featured, is_active, category_id, image_url)
SELECT 'Brócoli', 'brocoli', 'Brócoli fresco por unidad', 1800, 'unidad', 20, false, true,
  (SELECT id FROM categories WHERE slug = 'verduras'),
  'https://bnnzmpkuiranmvmzvdqj.supabase.co/storage/v1/object/public/product-images/brocoli.png'
ON CONFLICT (slug) DO UPDATE SET
  image_url = EXCLUDED.image_url, price = EXCLUDED.price, stock = EXCLUDED.stock;

INSERT INTO products (name, slug, description, price, unit_type, stock, is_featured, is_active, category_id, image_url)
SELECT 'Cebolla', 'cebolla', 'Cebolla blanca seleccionada', 1000, 'kg', 70, false, true,
  (SELECT id FROM categories WHERE slug = 'verduras'),
  'https://bnnzmpkuiranmvmzvdqj.supabase.co/storage/v1/object/public/product-images/cebollas.png'
ON CONFLICT (slug) DO UPDATE SET
  image_url = EXCLUDED.image_url, price = EXCLUDED.price, stock = EXCLUDED.stock;

INSERT INTO products (name, slug, description, price, unit_type, stock, is_featured, is_active, category_id, image_url)
SELECT 'Cebolla morada', 'cebolla-morada', 'Cebolla morada, suave y dulce', 1200, 'kg', 40, false, true,
  (SELECT id FROM categories WHERE slug = 'verduras'),
  'https://bnnzmpkuiranmvmzvdqj.supabase.co/storage/v1/object/public/product-images/cebolla-morada.png'
ON CONFLICT (slug) DO UPDATE SET
  image_url = EXCLUDED.image_url, price = EXCLUDED.price, stock = EXCLUDED.stock;

INSERT INTO products (name, slug, description, price, unit_type, stock, is_featured, is_active, category_id, image_url)
SELECT 'Champignones', 'champignones', 'Champignones frescos por kg', 4500, 'kg', 15, false, true,
  (SELECT id FROM categories WHERE slug = 'verduras'),
  'https://bnnzmpkuiranmvmzvdqj.supabase.co/storage/v1/object/public/product-images/champignones.png'
ON CONFLICT (slug) DO UPDATE SET
  image_url = EXCLUDED.image_url, price = EXCLUDED.price, stock = EXCLUDED.stock;

INSERT INTO products (name, slug, description, price, unit_type, stock, is_featured, is_active, category_id, image_url)
SELECT 'Chaucha', 'chaucha', 'Chaucha verde fresca', 2800, 'kg', 20, false, true,
  (SELECT id FROM categories WHERE slug = 'verduras'),
  'https://bnnzmpkuiranmvmzvdqj.supabase.co/storage/v1/object/public/product-images/chauchas.png'
ON CONFLICT (slug) DO UPDATE SET
  image_url = EXCLUDED.image_url, price = EXCLUDED.price, stock = EXCLUDED.stock;

INSERT INTO products (name, slug, description, price, unit_type, stock, is_featured, is_active, category_id, image_url)
SELECT 'Choclo', 'choclo', 'Choclo fresco por unidad', 800, 'unidad', 40, true, true,
  (SELECT id FROM categories WHERE slug = 'verduras'),
  'https://bnnzmpkuiranmvmzvdqj.supabase.co/storage/v1/object/public/product-images/choclos.png'
ON CONFLICT (slug) DO UPDATE SET
  image_url = EXCLUDED.image_url, price = EXCLUDED.price, stock = EXCLUDED.stock;

INSERT INTO products (name, slug, description, price, unit_type, stock, is_featured, is_active, category_id, image_url)
SELECT 'Hinojo', 'hinojo', 'Hinojo fresco por atado', 1500, 'atado', 15, false, true,
  (SELECT id FROM categories WHERE slug = 'verduras'),
  'https://bnnzmpkuiranmvmzvdqj.supabase.co/storage/v1/object/public/product-images/hinojo.png'
ON CONFLICT (slug) DO UPDATE SET
  image_url = EXCLUDED.image_url, price = EXCLUDED.price, stock = EXCLUDED.stock;

INSERT INTO products (name, slug, description, price, unit_type, stock, is_featured, is_active, category_id, image_url)
SELECT 'Lechuga criolla', 'lechuga-criolla', 'Lechuga criolla fresca por unidad', 700, 'unidad', 30, false, true,
  (SELECT id FROM categories WHERE slug = 'verduras'),
  'https://bnnzmpkuiranmvmzvdqj.supabase.co/storage/v1/object/public/product-images/lechuga-criolla.png'
ON CONFLICT (slug) DO UPDATE SET
  image_url = EXCLUDED.image_url, price = EXCLUDED.price, stock = EXCLUDED.stock;

INSERT INTO products (name, slug, description, price, unit_type, stock, is_featured, is_active, category_id, image_url)
SELECT 'Lechuga romana', 'lechuga-romana', 'Lechuga romana por unidad', 900, 'unidad', 25, false, true,
  (SELECT id FROM categories WHERE slug = 'verduras'),
  'https://bnnzmpkuiranmvmzvdqj.supabase.co/storage/v1/object/public/product-images/lechuga-romana.png'
ON CONFLICT (slug) DO UPDATE SET
  image_url = EXCLUDED.image_url, price = EXCLUDED.price, stock = EXCLUDED.stock;

INSERT INTO products (name, slug, description, price, unit_type, stock, is_featured, is_active, category_id, image_url)
SELECT 'Lechuga waldman', 'lechuga-waldman', 'Lechuga waldman por unidad', 900, 'unidad', 20, false, true,
  (SELECT id FROM categories WHERE slug = 'verduras'),
  'https://bnnzmpkuiranmvmzvdqj.supabase.co/storage/v1/object/public/product-images/lechuga-waldman.png'
ON CONFLICT (slug) DO UPDATE SET
  image_url = EXCLUDED.image_url, price = EXCLUDED.price, stock = EXCLUDED.stock;

INSERT INTO products (name, slug, description, price, unit_type, stock, is_featured, is_active, category_id, image_url)
SELECT 'Limón', 'limon', 'Limón fresco por kg', 2000, 'kg', 50, false, true,
  (SELECT id FROM categories WHERE slug = 'verduras'),
  'https://bnnzmpkuiranmvmzvdqj.supabase.co/storage/v1/object/public/product-images/limones.png'
ON CONFLICT (slug) DO UPDATE SET
  image_url = EXCLUDED.image_url, price = EXCLUDED.price, stock = EXCLUDED.stock;

INSERT INTO products (name, slug, description, price, unit_type, stock, is_featured, is_active, category_id, image_url)
SELECT 'Ajíes para vinagre', 'ajies-para-vinagre', 'Ajíes frescos para encurtir', 2500, 'kg', 15, false, true,
  (SELECT id FROM categories WHERE slug = 'verduras'),
  'https://bnnzmpkuiranmvmzvdqj.supabase.co/storage/v1/object/public/product-images/ajies-para-vinagre.png'
ON CONFLICT (slug) DO UPDATE SET
  image_url = EXCLUDED.image_url, price = EXCLUDED.price, stock = EXCLUDED.stock;

INSERT INTO products (name, slug, description, price, unit_type, stock, is_featured, is_active, category_id, image_url)
SELECT 'Ajo', 'ajo', 'Ajo fresco por kg', 5000, 'kg', 20, false, true,
  (SELECT id FROM categories WHERE slug = 'verduras'),
  'https://bnnzmpkuiranmvmzvdqj.supabase.co/storage/v1/object/public/product-images/ajos.png'
ON CONFLICT (slug) DO UPDATE SET
  image_url = EXCLUDED.image_url, price = EXCLUDED.price, stock = EXCLUDED.stock;

INSERT INTO products (name, slug, description, price, unit_type, stock, is_featured, is_active, category_id, image_url)
SELECT 'Apio', 'apio', 'Apio fresco por atado', 1200, 'atado', 20, false, true,
  (SELECT id FROM categories WHERE slug = 'verduras'),
  'https://bnnzmpkuiranmvmzvdqj.supabase.co/storage/v1/object/public/product-images/apio.png'
ON CONFLICT (slug) DO UPDATE SET
  image_url = EXCLUDED.image_url, price = EXCLUDED.price, stock = EXCLUDED.stock;

INSERT INTO products (name, slug, description, price, unit_type, stock, is_featured, is_active, category_id, image_url)
SELECT 'Batata', 'batata', 'Batata dulce seleccionada', 1500, 'kg', 50, false, true,
  (SELECT id FROM categories WHERE slug = 'verduras'),
  'https://bnnzmpkuiranmvmzvdqj.supabase.co/storage/v1/object/public/product-images/batata.png'
ON CONFLICT (slug) DO UPDATE SET
  image_url = EXCLUDED.image_url, price = EXCLUDED.price, stock = EXCLUDED.stock;

INSERT INTO products (name, slug, description, price, unit_type, stock, is_featured, is_active, category_id, image_url)
SELECT 'Berenjena rayada', 'berenjena-rayada', 'Berenjena rayada fresca', 2200, 'kg', 20, false, true,
  (SELECT id FROM categories WHERE slug = 'verduras'),
  'https://bnnzmpkuiranmvmzvdqj.supabase.co/storage/v1/object/public/product-images/berenjena-beteada.png'
ON CONFLICT (slug) DO UPDATE SET
  image_url = EXCLUDED.image_url, price = EXCLUDED.price, stock = EXCLUDED.stock;

INSERT INTO products (name, slug, description, price, unit_type, stock, is_featured, is_active, category_id, image_url)
SELECT 'Berenjena negra', 'berenjena-negra', 'Berenjena negra clásica', 2000, 'kg', 25, false, true,
  (SELECT id FROM categories WHERE slug = 'verduras'),
  'https://bnnzmpkuiranmvmzvdqj.supabase.co/storage/v1/object/public/product-images/berenjena-negra.png'
ON CONFLICT (slug) DO UPDATE SET
  image_url = EXCLUDED.image_url, price = EXCLUDED.price, stock = EXCLUDED.stock;

INSERT INTO products (name, slug, description, price, unit_type, stock, is_featured, is_active, category_id, image_url)
SELECT 'Boniato', 'boniato', 'Boniato dulce y nutritivo', 1400, 'kg', 30, false, true,
  (SELECT id FROM categories WHERE slug = 'verduras'),
  'https://bnnzmpkuiranmvmzvdqj.supabase.co/storage/v1/object/public/product-images/boniato.png'
ON CONFLICT (slug) DO UPDATE SET
  image_url = EXCLUDED.image_url, price = EXCLUDED.price, stock = EXCLUDED.stock;

-- ── FRUTAS ──────────────────────────────────────────────────

INSERT INTO products (name, slug, description, price, unit_type, stock, is_featured, is_active, category_id, image_url)
SELECT 'Banana', 'banana', 'Banana fresca de primera calidad', 1500, 'kg', 60, true, true,
  (SELECT id FROM categories WHERE slug = 'frutas'),
  'https://bnnzmpkuiranmvmzvdqj.supabase.co/storage/v1/object/public/product-images/bananas.png'
ON CONFLICT (slug) DO UPDATE SET
  image_url = EXCLUDED.image_url, price = EXCLUDED.price, stock = EXCLUDED.stock;

INSERT INTO products (name, slug, description, price, unit_type, stock, is_featured, is_active, category_id, image_url)
SELECT 'Palta', 'palta', 'Palta Hass, cremosa y lista para comer', 4000, 'kg', 30, true, true,
  (SELECT id FROM categories WHERE slug = 'frutas'),
  'https://bnnzmpkuiranmvmzvdqj.supabase.co/storage/v1/object/public/product-images/paltas.png'
ON CONFLICT (slug) DO UPDATE SET
  image_url = EXCLUDED.image_url, price = EXCLUDED.price, stock = EXCLUDED.stock;

INSERT INTO products (name, slug, description, price, unit_type, stock, is_featured, is_active, category_id, image_url)
SELECT 'Pomelo', 'pomelo', 'Pomelo rosado fresco', 1200, 'kg', 40, false, true,
  (SELECT id FROM categories WHERE slug = 'frutas'),
  'https://bnnzmpkuiranmvmzvdqj.supabase.co/storage/v1/object/public/product-images/pomelo.png'
ON CONFLICT (slug) DO UPDATE SET
  image_url = EXCLUDED.image_url, price = EXCLUDED.price, stock = EXCLUDED.stock;

INSERT INTO products (name, slug, description, price, unit_type, stock, is_featured, is_active, category_id, image_url)
SELECT 'Sandía', 'sandia', 'Sandía fresca entera', 1800, 'kg', 15, true, true,
  (SELECT id FROM categories WHERE slug = 'frutas'),
  'https://bnnzmpkuiranmvmzvdqj.supabase.co/storage/v1/object/public/product-images/sandia.png'
ON CONFLICT (slug) DO UPDATE SET
  image_url = EXCLUDED.image_url, price = EXCLUDED.price, stock = EXCLUDED.stock;

INSERT INTO products (name, slug, description, price, unit_type, stock, is_featured, is_active, category_id, image_url)
SELECT 'Uva negra', 'uva-negra', 'Uva negra sin semilla', 4500, 'kg', 20, false, true,
  (SELECT id FROM categories WHERE slug = 'frutas'),
  'https://bnnzmpkuiranmvmzvdqj.supabase.co/storage/v1/object/public/product-images/uva.png'
ON CONFLICT (slug) DO UPDATE SET
  image_url = EXCLUDED.image_url, price = EXCLUDED.price, stock = EXCLUDED.stock;

INSERT INTO products (name, slug, description, price, unit_type, stock, is_featured, is_active, category_id, image_url)
SELECT 'Uva verde', 'uva-verde', 'Uva verde sin semilla', 4500, 'kg', 20, false, true,
  (SELECT id FROM categories WHERE slug = 'frutas'),
  'https://bnnzmpkuiranmvmzvdqj.supabase.co/storage/v1/object/public/product-images/uva-verde.png'
ON CONFLICT (slug) DO UPDATE SET
  image_url = EXCLUDED.image_url, price = EXCLUDED.price, stock = EXCLUDED.stock;

INSERT INTO products (name, slug, description, price, unit_type, stock, is_featured, is_active, category_id, image_url)
SELECT 'Durazno', 'durazno', 'Durazno de temporada jugoso y dulce', 3200, 'kg', 25, false, true,
  (SELECT id FROM categories WHERE slug = 'frutas'),
  'https://bnnzmpkuiranmvmzvdqj.supabase.co/storage/v1/object/public/product-images/durazno.png'
ON CONFLICT (slug) DO UPDATE SET
  image_url = EXCLUDED.image_url, price = EXCLUDED.price, stock = EXCLUDED.stock;

INSERT INTO products (name, slug, description, price, unit_type, stock, is_featured, is_active, category_id, image_url)
SELECT 'Frutilla', 'frutilla', 'Frutillas frescas seleccionadas', 3500, 'kg', 20, true, true,
  (SELECT id FROM categories WHERE slug = 'frutas'),
  'https://bnnzmpkuiranmvmzvdqj.supabase.co/storage/v1/object/public/product-images/frutillas.png'
ON CONFLICT (slug) DO UPDATE SET
  image_url = EXCLUDED.image_url, price = EXCLUDED.price, stock = EXCLUDED.stock;

INSERT INTO products (name, slug, description, price, unit_type, stock, is_featured, is_active, category_id, image_url)
SELECT 'Kiwi', 'kiwi', 'Kiwi importado por unidad', 600, 'unidad', 50, false, true,
  (SELECT id FROM categories WHERE slug = 'frutas'),
  'https://bnnzmpkuiranmvmzvdqj.supabase.co/storage/v1/object/public/product-images/kiwi.png'
ON CONFLICT (slug) DO UPDATE SET
  image_url = EXCLUDED.image_url, price = EXCLUDED.price, stock = EXCLUDED.stock;

INSERT INTO products (name, slug, description, price, unit_type, stock, is_featured, is_active, category_id, image_url)
SELECT 'Mandarina', 'mandarina', 'Mandarina dulce y fácil de pelar', 2000, 'kg', 50, true, true,
  (SELECT id FROM categories WHERE slug = 'frutas'),
  'https://bnnzmpkuiranmvmzvdqj.supabase.co/storage/v1/object/public/product-images/mandarinas.png'
ON CONFLICT (slug) DO UPDATE SET
  image_url = EXCLUDED.image_url, price = EXCLUDED.price, stock = EXCLUDED.stock;

INSERT INTO products (name, slug, description, price, unit_type, stock, is_featured, is_active, category_id, image_url)
SELECT 'Manzana roja', 'manzana-roja', 'Manzana roja importada, crujiente y dulce', 2500, 'kg', 40, false, true,
  (SELECT id FROM categories WHERE slug = 'frutas'),
  'https://bnnzmpkuiranmvmzvdqj.supabase.co/storage/v1/object/public/product-images/manzana-roja.png'
ON CONFLICT (slug) DO UPDATE SET
  image_url = EXCLUDED.image_url, price = EXCLUDED.price, stock = EXCLUDED.stock;

INSERT INTO products (name, slug, description, price, unit_type, stock, is_featured, is_active, category_id, image_url)
SELECT 'Manzana verde', 'manzana-verde', 'Manzana verde, ácida y refrescante', 2500, 'kg', 35, false, true,
  (SELECT id FROM categories WHERE slug = 'frutas'),
  'https://bnnzmpkuiranmvmzvdqj.supabase.co/storage/v1/object/public/product-images/manzana-verde.png'
ON CONFLICT (slug) DO UPDATE SET
  image_url = EXCLUDED.image_url, price = EXCLUDED.price, stock = EXCLUDED.stock;

INSERT INTO products (name, slug, description, price, unit_type, stock, is_featured, is_active, category_id, image_url)
SELECT 'Melón', 'melon', 'Melón dulce y jugoso', 2000, 'kg', 20, false, true,
  (SELECT id FROM categories WHERE slug = 'frutas'),
  'https://bnnzmpkuiranmvmzvdqj.supabase.co/storage/v1/object/public/product-images/melon.png'
ON CONFLICT (slug) DO UPDATE SET
  image_url = EXCLUDED.image_url, price = EXCLUDED.price, stock = EXCLUDED.stock;

INSERT INTO products (name, slug, description, price, unit_type, stock, is_featured, is_active, category_id, image_url)
SELECT 'Arándanos', 'arandanos', 'Arándanos frescos por kg', 6000, 'kg', 10, true, true,
  (SELECT id FROM categories WHERE slug = 'frutas'),
  'https://bnnzmpkuiranmvmzvdqj.supabase.co/storage/v1/object/public/product-images/arandanos-2.png'
ON CONFLICT (slug) DO UPDATE SET
  image_url = EXCLUDED.image_url, price = EXCLUDED.price, stock = EXCLUDED.stock;

-- ── DIETÉTICA (Huevos) ──────────────────────────────────────

INSERT INTO products (name, slug, description, price, unit_type, stock, is_featured, is_active, category_id, image_url)
SELECT 'Huevos blancos N°1', 'huevos-blancos-n1', 'Huevos blancos de campo N°1 por docena', 2800, 'docena', 30, false, true,
  (SELECT id FROM categories WHERE slug = 'dietetica'),
  'https://bnnzmpkuiranmvmzvdqj.supabase.co/storage/v1/object/public/product-images/huevos-blancos-n1.png'
ON CONFLICT (slug) DO UPDATE SET
  image_url = EXCLUDED.image_url, price = EXCLUDED.price, stock = EXCLUDED.stock;

INSERT INTO products (name, slug, description, price, unit_type, stock, is_featured, is_active, category_id, image_url)
SELECT 'Huevos colorados', 'huevos-colorados', 'Huevos colorados de campo por docena', 3000, 'docena', 25, false, true,
  (SELECT id FROM categories WHERE slug = 'dietetica'),
  'https://bnnzmpkuiranmvmzvdqj.supabase.co/storage/v1/object/public/product-images/huevos-colorados.png'
ON CONFLICT (slug) DO UPDATE SET
  image_url = EXCLUDED.image_url, price = EXCLUDED.price, stock = EXCLUDED.stock;

-- ── LIMPIEZA: eliminar productos demo sin imagen real ────────
-- (Opcional: comentar si no querés borrar los de prueba)
DELETE FROM products WHERE slug = 'lechuga-mantecosa';
