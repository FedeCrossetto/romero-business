-- ============================================================
-- Seed productos con imágenes verificadas de Pexels
-- IDs probados uno a uno — imágenes confirmadas visualmente
-- Ejecutar completo en Supabase SQL Editor
-- ============================================================

-- ============================================================
-- ACTUALIZAR productos existentes con imágenes verificadas
-- ============================================================
UPDATE products SET image_url = 'https://images.pexels.com/photos/1327838/pexels-photo-1327838.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop' WHERE slug = 'tomate-perita';
UPDATE products SET image_url = 'https://images.pexels.com/photos/2872755/pexels-photo-2872755.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop' WHERE slug = 'banana';
UPDATE products SET image_url = 'https://images.pexels.com/photos/1656666/pexels-photo-1656666.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop' WHERE slug = 'lechuga-mantecosa';
UPDATE products SET image_url = 'https://images.pexels.com/photos/209339/pexels-photo-209339.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop'  WHERE slug = 'manzana-roja';

-- ============================================================
-- VERDURAS
-- ============================================================
INSERT INTO products (name, slug, description, price, unit_type, stock, image_url, category_id, is_featured, is_active)
SELECT 'Papa', 'papa', 'Papa blanca fresca, ideal para todo uso', 900, 'kg', 100,
  'https://images.pexels.com/photos/2286776/pexels-photo-2286776.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop',
  (SELECT id FROM categories WHERE slug = 'verduras'), false, true
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'papa');

INSERT INTO products (name, slug, description, price, unit_type, stock, image_url, category_id, is_featured, is_active)
SELECT 'Cebolla', 'cebolla', 'Cebolla blanca fresca y firme', 700, 'kg', 80,
  'https://images.pexels.com/photos/4197445/pexels-photo-4197445.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop',
  (SELECT id FROM categories WHERE slug = 'verduras'), false, true
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'cebolla');

INSERT INTO products (name, slug, description, price, unit_type, stock, image_url, category_id, is_featured, is_active)
SELECT 'Zanahoria', 'zanahoria', 'Zanahoria fresca y dulce', 800, 'kg', 60,
  'https://images.pexels.com/photos/143133/pexels-photo-143133.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop',
  (SELECT id FROM categories WHERE slug = 'verduras'), false, true
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'zanahoria');

INSERT INTO products (name, slug, description, price, unit_type, stock, image_url, category_id, is_featured, is_active)
SELECT 'Brócoli', 'brocoli', 'Brócoli fresco, lleno de vitaminas', 1100, 'unidad', 25,
  'https://images.pexels.com/photos/399629/pexels-photo-399629.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop',
  (SELECT id FROM categories WHERE slug = 'verduras'), true, true
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'brocoli');

INSERT INTO products (name, slug, description, price, unit_type, stock, image_url, category_id, is_featured, is_active)
SELECT 'Espinaca', 'espinaca', 'Espinaca fresca en atado', 650, 'atado', 30,
  'https://images.pexels.com/photos/2325843/pexels-photo-2325843.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop',
  (SELECT id FROM categories WHERE slug = 'verduras'), false, true
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'espinaca');

INSERT INTO products (name, slug, description, price, unit_type, stock, image_url, category_id, is_featured, is_active)
SELECT 'Morrón rojo', 'morron-rojo', 'Morrón rojo dulce y carnoso', 1300, 'kg', 40,
  'https://images.pexels.com/photos/128536/pexels-photo-128536.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop',
  (SELECT id FROM categories WHERE slug = 'verduras'), false, true
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'morron-rojo');

INSERT INTO products (name, slug, description, price, unit_type, stock, image_url, category_id, is_featured, is_active)
SELECT 'Zapallo cabutia', 'zapallo-cabutia', 'Zapallo tierno, ideal para cremas', 600, 'kg', 35,
  'https://images.pexels.com/photos/3955353/pexels-photo-3955353.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop',
  (SELECT id FROM categories WHERE slug = 'verduras'), false, true
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'zapallo-cabutia');

INSERT INTO products (name, slug, description, price, unit_type, stock, image_url, category_id, is_featured, is_active)
SELECT 'Ajo', 'ajo', 'Cabeza de ajo fresco', 400, 'unidad', 50,
  'https://images.pexels.com/photos/4197488/pexels-photo-4197488.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop',
  (SELECT id FROM categories WHERE slug = 'verduras'), false, true
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'ajo');

INSERT INTO products (name, slug, description, price, unit_type, stock, image_url, category_id, is_featured, is_active)
SELECT 'Choclo', 'choclo', 'Choclo tierno, dulce y fresco', 500, 'unidad', 45,
  'https://images.pexels.com/photos/2286776/pexels-photo-2286776.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop',
  (SELECT id FROM categories WHERE slug = 'verduras'), false, true
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'choclo');

INSERT INTO products (name, slug, description, price, unit_type, stock, image_url, category_id, is_featured, is_active)
SELECT 'Pepino', 'pepino', 'Pepino fresco y crocante', 700, 'unidad', 30,
  'https://images.pexels.com/photos/4397919/pexels-photo-4397919.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop',
  (SELECT id FROM categories WHERE slug = 'verduras'), false, true
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'pepino');

INSERT INTO products (name, slug, description, price, unit_type, stock, image_url, category_id, is_featured, is_active)
SELECT 'Berenjena', 'berenjena', 'Berenjena fresca y brillante', 900, 'unidad', 25,
  'https://images.pexels.com/photos/1435904/pexels-photo-1435904.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop',
  (SELECT id FROM categories WHERE slug = 'verduras'), false, true
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'berenjena');

INSERT INTO products (name, slug, description, price, unit_type, stock, image_url, category_id, is_featured, is_active)
SELECT 'Tomate redondo', 'tomate-redondo', 'Tomate redondo para ensaladas', 1100, 'kg', 45,
  'https://images.pexels.com/photos/1327838/pexels-photo-1327838.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop',
  (SELECT id FROM categories WHERE slug = 'verduras'), false, true
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'tomate-redondo');

-- ============================================================
-- FRUTAS
-- ============================================================
INSERT INTO products (name, slug, description, price, unit_type, stock, image_url, category_id, is_featured, is_active)
SELECT 'Naranja de jugo', 'naranja-de-jugo', 'Naranja dulce, perfecta para jugo', 900, 'kg', 70,
  'https://images.pexels.com/photos/327098/pexels-photo-327098.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop',
  (SELECT id FROM categories WHERE slug = 'frutas'), true, true
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'naranja-de-jugo');

INSERT INTO products (name, slug, description, price, unit_type, stock, image_url, category_id, is_featured, is_active)
SELECT 'Palta Hass', 'palta-hass', 'Palta Hass en su punto justo', 1800, 'unidad', 25,
  'https://images.pexels.com/photos/557659/pexels-photo-557659.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop',
  (SELECT id FROM categories WHERE slug = 'frutas'), true, true
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'palta-hass');

INSERT INTO products (name, slug, description, price, unit_type, stock, image_url, category_id, is_featured, is_active)
SELECT 'Limón', 'limon', 'Limón fresco, cítrico y aromático', 800, 'kg', 55,
  'https://images.pexels.com/photos/952360/pexels-photo-952360.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop',
  (SELECT id FROM categories WHERE slug = 'frutas'), false, true
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'limon');

INSERT INTO products (name, slug, description, price, unit_type, stock, image_url, category_id, is_featured, is_active)
SELECT 'Frutilla', 'frutilla', 'Frutilla fresca de temporada', 2200, 'kg', 20,
  'https://images.pexels.com/photos/1126359/pexels-photo-1126359.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop',
  (SELECT id FROM categories WHERE slug = 'frutas'), true, true
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'frutilla');

INSERT INTO products (name, slug, description, price, unit_type, stock, image_url, category_id, is_featured, is_active)
SELECT 'Uva red globe', 'uva-red-globe', 'Uva roja sin semillas, dulce y grande', 1600, 'kg', 30,
  'https://images.pexels.com/photos/708777/pexels-photo-708777.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop',
  (SELECT id FROM categories WHERE slug = 'frutas'), false, true
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'uva-red-globe');

INSERT INTO products (name, slug, description, price, unit_type, stock, image_url, category_id, is_featured, is_active)
SELECT 'Mango', 'mango', 'Mango maduro y dulce', 2000, 'unidad', 15,
  'https://images.pexels.com/photos/918643/pexels-photo-918643.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop',
  (SELECT id FROM categories WHERE slug = 'frutas'), false, true
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'mango');

INSERT INTO products (name, slug, description, price, unit_type, stock, image_url, category_id, is_featured, is_active)
SELECT 'Mandarina', 'mandarina', 'Mandarina dulce y fácil de pelar', 950, 'kg', 50,
  'https://images.pexels.com/photos/2294477/pexels-photo-2294477.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop',
  (SELECT id FROM categories WHERE slug = 'frutas'), false, true
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'mandarina');

INSERT INTO products (name, slug, description, price, unit_type, stock, image_url, category_id, is_featured, is_active)
SELECT 'Sandía', 'sandia', 'Sandía entera jugosa y dulce', 700, 'kg', 12,
  'https://images.pexels.com/photos/1346347/pexels-photo-1346347.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop',
  (SELECT id FROM categories WHERE slug = 'frutas'), false, true
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'sandia');

INSERT INTO products (name, slug, description, price, unit_type, stock, image_url, category_id, is_featured, is_active)
SELECT 'Durazno', 'durazno', 'Durazno jugoso de temporada', 1400, 'kg', 25,
  'https://images.pexels.com/photos/1650166/pexels-photo-1650166.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop',
  (SELECT id FROM categories WHERE slug = 'frutas'), false, true
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'durazno');

INSERT INTO products (name, slug, description, price, unit_type, stock, image_url, category_id, is_featured, is_active)
SELECT 'Kiwi', 'kiwi', 'Kiwi verde dulce y ácido', 1700, 'unidad', 20,
  'https://images.pexels.com/photos/1132047/pexels-photo-1132047.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop',
  (SELECT id FROM categories WHERE slug = 'frutas'), false, true
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'kiwi');

INSERT INTO products (name, slug, description, price, unit_type, stock, image_url, category_id, is_featured, is_active)
SELECT 'Ananá', 'anana', 'Ananá maduro y dulce', 2200, 'unidad', 10,
  'https://images.pexels.com/photos/947879/pexels-photo-947879.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop',
  (SELECT id FROM categories WHERE slug = 'frutas'), false, true
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'anana');

INSERT INTO products (name, slug, description, price, unit_type, stock, image_url, category_id, is_featured, is_active)
SELECT 'Pera Williams', 'pera-williams', 'Pera madura y jugosa', 1100, 'kg', 35,
  'https://images.pexels.com/photos/1508666/pexels-photo-1508666.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop',
  (SELECT id FROM categories WHERE slug = 'frutas'), false, true
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'pera-williams');

-- ============================================================
-- DIETÉTICA
-- ============================================================
INSERT INTO products (name, slug, description, price, unit_type, stock, image_url, category_id, is_featured, is_active)
SELECT 'Granola artesanal', 'granola-artesanal', 'Granola con avena, miel y frutos secos', 1800, 'bolsa', 20,
  'https://images.pexels.com/photos/1640770/pexels-photo-1640770.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop',
  (SELECT id FROM categories WHERE slug = 'dietetica'), false, true
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'granola-artesanal');

INSERT INTO products (name, slug, description, price, unit_type, stock, image_url, category_id, is_featured, is_active)
SELECT 'Almendras', 'almendras', 'Almendras naturales sin sal, 200g', 2500, 'bolsa', 18,
  'https://images.pexels.com/photos/1295572/pexels-photo-1295572.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop',
  (SELECT id FROM categories WHERE slug = 'dietetica'), false, true
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'almendras');

INSERT INTO products (name, slug, description, price, unit_type, stock, image_url, category_id, is_featured, is_active)
SELECT 'Mix de frutos secos', 'mix-frutos-secos', 'Nueces, almendras y pasas, 200g', 2800, 'bolsa', 15,
  'https://images.pexels.com/photos/1295572/pexels-photo-1295572.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop',
  (SELECT id FROM categories WHERE slug = 'dietetica'), false, true
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'mix-frutos-secos');

INSERT INTO products (name, slug, description, price, unit_type, stock, image_url, category_id, is_featured, is_active)
SELECT 'Semillas de chía', 'semillas-de-chia', 'Chía negra, 250g por bolsa', 1200, 'bolsa', 25,
  'https://images.pexels.com/photos/1393382/pexels-photo-1393382.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop',
  (SELECT id FROM categories WHERE slug = 'dietetica'), false, true
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'semillas-de-chia');

INSERT INTO products (name, slug, description, price, unit_type, stock, image_url, category_id, is_featured, is_active)
SELECT 'Lentejas', 'lentejas', 'Lentejas verdes, 500g', 850, 'bolsa', 22,
  'https://images.pexels.com/photos/1393382/pexels-photo-1393382.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop',
  (SELECT id FROM categories WHERE slug = 'dietetica'), false, true
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'lentejas');

INSERT INTO products (name, slug, description, price, unit_type, stock, image_url, category_id, is_featured, is_active)
SELECT 'Avena integral', 'avena-integral', 'Avena en copos gruesos, 500g', 900, 'bolsa', 30,
  'https://images.pexels.com/photos/7421194/pexels-photo-7421194.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop',
  (SELECT id FROM categories WHERE slug = 'dietetica'), false, true
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'avena-integral');

INSERT INTO products (name, slug, description, price, unit_type, stock, image_url, category_id, is_featured, is_active)
SELECT 'Miel pura', 'miel-pura', 'Miel natural de abeja, 500g', 2200, 'unidad', 12,
  'https://images.pexels.com/photos/1638606/pexels-photo-1638606.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop',
  (SELECT id FROM categories WHERE slug = 'dietetica'), false, true
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'miel-pura');

-- ============================================================
-- OFERTAS
-- ============================================================
INSERT INTO products (name, slug, description, price, unit_type, stock, image_url, category_id, is_featured, is_active)
SELECT 'Pack verduras de semana', 'pack-verduras-semana',
  'Papa 1kg + Cebolla 1kg + Zanahoria 1kg + Tomate 1kg', 2800, 'bolsa', 15,
  'https://images.pexels.com/photos/1435904/pexels-photo-1435904.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop',
  (SELECT id FROM categories WHERE slug = 'ofertas'), true, true
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'pack-verduras-semana');

INSERT INTO products (name, slug, description, price, unit_type, stock, image_url, category_id, is_featured, is_active)
SELECT 'Pack frutas mixtas', 'pack-frutas-mixtas',
  'Banana 1kg + Manzana 1kg + Naranja 1kg', 2600, 'bolsa', 10,
  'https://images.pexels.com/photos/1132047/pexels-photo-1132047.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop',
  (SELECT id FROM categories WHERE slug = 'ofertas'), true, true
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'pack-frutas-mixtas');

INSERT INTO products (name, slug, description, price, unit_type, stock, image_url, category_id, is_featured, is_active)
SELECT 'Pack ensalada completa', 'pack-ensalada-completa',
  'Lechuga + Tomate + Pepino + Morrón. Todo listo para ensalada.', 2200, 'bolsa', 12,
  'https://images.pexels.com/photos/1640770/pexels-photo-1640770.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop',
  (SELECT id FROM categories WHERE slug = 'ofertas'), true, true
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'pack-ensalada-completa');
