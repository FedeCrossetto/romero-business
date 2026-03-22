-- ============================================================
-- Verdulería Romero — Supabase Schema
-- Ejecutar en el SQL Editor de Supabase
-- ============================================================

-- Extensiones
create extension if not exists "pgcrypto";

-- ============================================================
-- TABLAS
-- ============================================================

create table if not exists categories (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  slug       text not null unique,
  sort_order int  not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists products (
  id          uuid    primary key default gen_random_uuid(),
  name        text    not null,
  slug        text    not null unique,
  description text,
  price       numeric(10, 2) not null,
  unit_type   text    not null default 'kg',   -- kg | unidad | bolsa | atado
  stock       numeric(10, 2) not null default 0,
  image_url   text,
  category_id uuid    references categories(id) on delete set null,
  is_featured boolean not null default false,
  is_active   boolean not null default true,
  created_at  timestamptz not null default now()
);

create table if not exists settings (
  id    uuid primary key default gen_random_uuid(),
  key   text not null unique,
  value text not null
);

-- ============================================================
-- DATOS INICIALES
-- ============================================================

insert into categories (name, slug, sort_order) values
  ('Verduras',  'verduras',  1),
  ('Frutas',    'frutas',    2),
  ('Dietética', 'dietetica', 3),
  ('Ofertas',   'ofertas',   4)
on conflict (slug) do nothing;

insert into settings (key, value) values
  ('whatsapp_number', '5491173634746'),
  ('business_name',   'Verdulería Romero'),
  ('delivery_fee',    '500'),
  ('business_address',        ''),
  ('business_hours',          'Lun-Sáb 8:00 a 20:00'),
  ('free_shipping_threshold', '20000')
on conflict (key) do nothing;

-- Productos demo (reemplazar image_url con URLs reales de Supabase Storage)
insert into products (name, slug, description, price, unit_type, stock, is_featured, category_id)
select
  'Tomate perita', 'tomate-perita', 'Tomate perita fresco, ideal para salsas', 1200, 'kg', 50, true,
  (select id from categories where slug = 'verduras')
where not exists (select 1 from products where slug = 'tomate-perita');

insert into products (name, slug, description, price, unit_type, stock, is_featured, category_id)
select
  'Banana', 'banana', 'Banana de primera calidad', 800, 'kg', 30, true,
  (select id from categories where slug = 'frutas')
where not exists (select 1 from products where slug = 'banana');

insert into products (name, slug, description, price, unit_type, stock, is_featured, category_id)
select
  'Lechuga mantecosa', 'lechuga-mantecosa', 'Lechuga fresca hidropónica', 600, 'unidad', 20, false,
  (select id from categories where slug = 'verduras')
where not exists (select 1 from products where slug = 'lechuga-mantecosa');

insert into products (name, slug, description, price, unit_type, stock, is_featured, category_id)
select
  'Manzana roja', 'manzana-roja', 'Manzana roja importada', 1400, 'kg', 40, true,
  (select id from categories where slug = 'frutas')
where not exists (select 1 from products where slug = 'manzana-roja');

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

alter table products   enable row level security;
alter table categories enable row level security;
alter table settings   enable row level security;

-- Lectura pública
create policy "public_read_products"
  on products for select using (true);

create policy "public_read_categories"
  on categories for select using (true);

create policy "public_read_settings"
  on settings for select using (true);

-- Escritura solo autenticados (admin)
create policy "admin_all_products"
  on products for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

create policy "admin_all_categories"
  on categories for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

create policy "admin_all_settings"
  on settings for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- ============================================================
-- STORAGE (ejecutar en Storage settings o desde API)
-- ============================================================
-- Crear bucket público "product-images"
-- insert into storage.buckets (id, name, public) values ('product-images', 'product-images', true);
