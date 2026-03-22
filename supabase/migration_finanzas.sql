-- =============================================
-- Módulo de Finanzas - Romero & Co
-- Ejecutar en Supabase SQL Editor
-- =============================================

-- 1. VENTAS (registros individuales de venta)
create table if not exists ventas (
  id uuid default gen_random_uuid() primary key,
  fecha date not null default current_date,
  descripcion text,
  monto numeric(12,2) not null default 0,
  forma_pago text not null default 'efectivo',
  created_at timestamptz default now()
);

alter table ventas enable row level security;

create policy "Authenticated manage ventas" on ventas
  for all to authenticated using (true) with check (true);

-- 2. CAJA CHICA (gastos variables diarios)
create table if not exists caja_chica (
  id uuid default gen_random_uuid() primary key,
  fecha date not null default current_date,
  descripcion text,
  categoria text not null default 'mercaderia',
  -- categorias: mercaderia | servicios | transporte | otros
  monto numeric(12,2) not null default 0,
  created_at timestamptz default now()
);

alter table caja_chica enable row level security;

create policy "Authenticated manage caja_chica" on caja_chica
  for all to authenticated using (true) with check (true);

-- 3. GASTOS FIJOS (por mes, una fila por mes)
create table if not exists gastos_fijos (
  id uuid default gen_random_uuid() primary key,
  mes date not null unique, -- primer día del mes: '2026-03-01'
  luz numeric(12,2) not null default 0,
  agua numeric(12,2) not null default 0,
  nafta numeric(12,2) not null default 0,
  sueldo numeric(12,2) not null default 0,
  internet numeric(12,2) not null default 0,
  seguro numeric(12,2) not null default 0,
  monotributo numeric(12,2) not null default 0,
  contadora numeric(12,2) not null default 0,
  camioneta numeric(12,2) not null default 0,
  telefonos numeric(12,2) not null default 0,
  papeleria numeric(12,2) not null default 0,
  alquiler numeric(12,2) not null default 0,
  created_at timestamptz default now()
);

alter table gastos_fijos enable row level security;

create policy "Authenticated manage gastos_fijos" on gastos_fijos
  for all to authenticated using (true) with check (true);

-- 4. STOCK INTELIGENTE (rentabilidad por producto)
create table if not exists stock_inteligente (
  id uuid default gen_random_uuid() primary key,
  producto text not null,
  proveedor text,
  precio_cajon numeric(12,2),
  kg_por_cajon numeric(8,3),
  cajones_comprados numeric(8,3) not null default 0,
  cajones_vendidos numeric(8,3) not null default 0,
  kg_vendidos numeric(8,3) default 0,
  precio_venta_real numeric(12,2),
  porcentaje_reinversion numeric(5,4) not null default 0.6,
  notas text,
  updated_at timestamptz default now()
);

alter table stock_inteligente enable row level security;

create policy "Authenticated manage stock_inteligente" on stock_inteligente
  for all to authenticated using (true) with check (true);
