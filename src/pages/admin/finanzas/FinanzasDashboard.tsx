import { useState, useEffect, useMemo } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
  AreaChart, Area, CartesianGrid,
} from 'recharts'
import { TrendingUp, TrendingDown, Target, AlertTriangle, Star, ChevronLeft, ChevronRight } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { formatPrice } from '@/lib/utils'
import { FinanzasLayout } from './FinanzasLayout'

interface Venta { id: string; fecha: string; monto: number; forma_pago: string }
interface GastoVar { id: string; fecha: string; monto: number }
interface GastosFijos {
  luz: number; agua: number; nafta: number; sueldo: number; internet: number
  seguro: number; monotributo: number; contadora: number; camioneta: number
  telefonos: number; papeleria: number; alquiler: number
}
interface StockItem {
  id: string; producto: string; precio_cajon: number | null; kg_por_cajon: number | null
  cajones_comprados: number; cajones_vendidos: number; kg_vendidos: number
  precio_venta_real: number | null; porcentaje_reinversion: number
}

const OBJETIVO_MENSUAL = 6_000_000
const PAGO_LABELS: Record<string, string> = {
  efectivo: 'Efectivo', debito: 'Débito', transferencia: 'Transferencia',
  cuenta_dni: 'Cta. DNI', credito: 'Crédito',
}
const PAGO_COLORS: Record<string, string> = {
  efectivo: '#10b981', debito: '#3b82f6', transferencia: '#8b5cf6',
  cuenta_dni: '#f59e0b', credito: '#ec4899',
}
const GF_LABELS: Record<string, string> = {
  luz: 'Luz', agua: 'Agua', nafta: 'Nafta', sueldo: 'Sueldo',
  internet: 'Internet', seguro: 'Seguro', monotributo: 'Monotributo',
  contadora: 'Contadora', camioneta: 'Camioneta', telefonos: 'Teléfonos',
  papeleria: 'Papelería', alquiler: 'Alquiler',
}
const MONTH_NAMES = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre']

function KpiCard({ label, value, sub, color = 'gray', icon }: {
  label: string; value: string; sub?: string; color?: 'green' | 'red' | 'blue' | 'orange' | 'gray'; icon?: React.ReactNode
}) {
  const colors = {
    green: 'bg-emerald-50 border-emerald-200 text-emerald-700',
    red: 'bg-red-50 border-red-200 text-red-700',
    blue: 'bg-blue-50 border-blue-200 text-blue-700',
    orange: 'bg-orange-50 border-orange-200 text-orange-700',
    gray: 'bg-white border-gray-100 text-gray-700',
  }
  return (
    <div className={`rounded-2xl border p-4 ${colors[color]}`}>
      <div className="flex items-start justify-between gap-2">
        <p className="text-xs font-semibold uppercase tracking-wide opacity-70">{label}</p>
        {icon && <div className="opacity-60">{icon}</div>}
      </div>
      <p className="text-2xl font-extrabold mt-1 leading-tight">{value}</p>
      {sub && <p className="text-xs mt-1 opacity-60">{sub}</p>}
    </div>
  )
}

function ChartTooltipPrice({ active, payload, label }: any) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white border border-gray-100 shadow-lg rounded-xl px-3 py-2 text-xs">
      <p className="font-semibold text-gray-600 mb-1">{label}</p>
      {payload.map((p: any) => (
        <p key={p.dataKey} style={{ color: p.color }} className="font-bold">{formatPrice(p.value)}</p>
      ))}
    </div>
  )
}

export function FinanzasDashboard() {
  const now = new Date()
  const [year, setYear] = useState(now.getFullYear())
  const [month, setMonth] = useState(now.getMonth() + 1)

  const [ventas, setVentas] = useState<Venta[]>([])
  const [gastoVar, setGastoVar] = useState<GastoVar[]>([])
  const [gastosFijos, setGastosFijos] = useState<GastosFijos | null>(null)
  const [stock, setStock] = useState<StockItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      setLoading(true)
      const from = `${year}-${String(month).padStart(2, '0')}-01`
      const lastDay = new Date(year, month, 0).getDate()
      const to = `${year}-${String(month).padStart(2, '0')}-${lastDay}`

      const [v, g, gf, s] = await Promise.all([
        supabase.from('ventas').select('id,fecha,monto,forma_pago').gte('fecha', from).lte('fecha', to),
        supabase.from('caja_chica').select('id,fecha,monto').gte('fecha', from).lte('fecha', to),
        supabase.from('gastos_fijos').select('*').eq('mes', from).maybeSingle(),
        supabase.from('stock_inteligente').select('id,producto,precio_cajon,kg_por_cajon,cajones_comprados,cajones_vendidos,kg_vendidos,precio_venta_real,porcentaje_reinversion'),
      ])
      setVentas(v.data ?? [])
      setGastoVar(g.data ?? [])
      setGastosFijos(gf.data ?? null)
      setStock(s.data ?? [])
      setLoading(false)
    }
    load()
  }, [year, month])

  const metrics = useMemo(() => {
    const totalVentas = ventas.reduce((s, v) => s + v.monto, 0)
    const reinversion60 = totalVentas * 0.6
    const totalCajaChica = gastoVar.reduce((s, g) => s + g.monto, 0)
    const gfValues = gastosFijos ? Object.entries(gastosFijos).filter(([k]) => k in GF_LABELS).map(([, v]) => Number(v) || 0) : []
    const gfTotal = gfValues.reduce((s, v) => s + v, 0)
    const totalGastos = gfTotal + totalCajaChica
    const gananciaNeta = totalVentas - totalGastos

    const daysInMonth = new Date(year, month, 0).getDate()
    const isCurrentMonth = year === now.getFullYear() && month === (now.getMonth() + 1)
    const daysElapsed = isCurrentMonth ? now.getDate() : daysInMonth
    const daysWithSales = new Set(ventas.map(v => v.fecha)).size
    const promedioDia = daysWithSales > 0 ? totalVentas / daysWithSales : 0

    const byDay: Record<string, number> = {}
    ventas.forEach(v => { byDay[v.fecha] = (byDay[v.fecha] ?? 0) + v.monto })
    const mejorDia = Math.max(0, ...Object.values(byDay))

    const proyeccionMes = daysElapsed > 0 ? (totalVentas / daysElapsed) * daysInMonth : 0
    const gananciaProyectada = proyeccionMes - totalGastos
    const diasRestantes = daysInMonth - daysElapsed
    const ventaDiariaNecesaria = diasRestantes > 0 ? Math.max(0, (OBJETIVO_MENSUAL - gananciaNeta) / diasRestantes) : 0

    const porForma: Record<string, number> = {}
    ventas.forEach(v => { porForma[v.forma_pago] = (porForma[v.forma_pago] ?? 0) + v.monto })

    // Stock
    const stockCalc = stock.map(item => {
      const costKg = item.precio_cajon && item.kg_por_cajon ? item.precio_cajon / item.kg_por_cajon : 0
      const gananciaKg = item.precio_venta_real && costKg ? item.precio_venta_real - costKg : 0
      const kgVendidos = item.kg_vendidos || (item.cajones_vendidos * (item.kg_por_cajon ?? 0))
      const gananciaTotal = gananciaKg * kgVendidos
      const stockCajones = item.cajones_comprados - item.cajones_vendidos
      return { ...item, gananciaTotal, stockCajones, costKg }
    })
    const top5 = [...stockCalc].filter(s => s.gananciaTotal > 0).sort((a, b) => b.gananciaTotal - a.gananciaTotal).slice(0, 5)
    const stockCritico = stockCalc.filter(s => s.stockCajones <= 0).length
    const stockBajo = stockCalc.filter(s => s.stockCajones > 0 && s.stockCajones <= 2).length
    const aRevisar = stockCalc.filter(s => {
      if (!s.precio_venta_real || !s.costKg) return false
      return (s.precio_venta_real - s.costKg) / s.costKg < s.porcentaje_reinversion
    }).length

    return {
      totalVentas, reinversion60, totalCajaChica, gfTotal, totalGastos, gananciaNeta,
      daysWithSales, promedioDia, mejorDia, proyeccionMes, gananciaProyectada,
      ventaDiariaNecesaria, porForma, top5, stockCritico, stockBajo, aRevisar,
      daysInMonth, daysElapsed,
    }
  }, [ventas, gastoVar, gastosFijos, stock, year, month])

  // Chart data
  const dailySalesData = useMemo(() => {
    const byDay: Record<string, number> = {}
    ventas.forEach(v => { byDay[v.fecha] = (byDay[v.fecha] ?? 0) + v.monto })
    const daysInMonth = new Date(year, month, 0).getDate()
    return Array.from({ length: daysInMonth }, (_, i) => {
      const day = i + 1
      const fecha = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
      return { dia: String(day), ventas: byDay[fecha] ?? 0, fecha }
    })
  }, [ventas, year, month])

  const acumuladoData = useMemo(() => {
    const byDay: Record<string, number> = {}
    ventas.forEach(v => { byDay[v.fecha] = (byDay[v.fecha] ?? 0) + v.monto })
    let acum = 0
    const daysInMonth = new Date(year, month, 0).getDate()
    return Array.from({ length: metrics.daysElapsed }, (_, i) => {
      const day = i + 1
      const fecha = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
      acum += byDay[fecha] ?? 0
      const objetivoParcial = (OBJETIVO_MENSUAL / daysInMonth) * day
      return { dia: String(day), acumulado: acum, objetivo: Math.round(objetivoParcial) }
    })
  }, [ventas, year, month, metrics.daysElapsed])

  const pagoPieData = useMemo(() =>
    Object.entries(metrics.porForma).map(([key, value]) => ({
      name: PAGO_LABELS[key] ?? key,
      value,
      color: PAGO_COLORS[key] ?? '#94a3b8',
    })),
    [metrics.porForma]
  )

  const gastosFijosBarData = useMemo(() => {
    if (!gastosFijos) return []
    return Object.entries(GF_LABELS)
      .map(([key, label]) => ({ name: label, valor: Number((gastosFijos as any)[key]) || 0 }))
      .filter(d => d.valor > 0)
      .sort((a, b) => b.valor - a.valor)
  }, [gastosFijos])

  function prevMonth() { if (month === 1) { setMonth(12); setYear(y => y - 1) } else setMonth(m => m - 1) }
  function nextMonth() { if (month === 12) { setMonth(1); setYear(y => y + 1) } else setMonth(m => m + 1) }

  const gananciaColor = metrics.gananciaNeta >= 0 ? 'green' : 'red'
  const progresoObjetivo = Math.min(100, Math.max(0, (metrics.gananciaNeta / OBJETIVO_MENSUAL) * 100))

  return (
    <FinanzasLayout>
      {/* Month navigator */}
      <div className="flex items-center gap-3 mb-6">
        <button onClick={prevMonth} className="p-2 rounded-xl hover:bg-gray-100 transition"><ChevronLeft className="h-5 w-5 text-gray-500" /></button>
        <span className="font-bold text-lg text-gray-800 min-w-[160px] text-center">{MONTH_NAMES[month - 1]} {year}</span>
        <button onClick={nextMonth} className="p-2 rounded-xl hover:bg-gray-100 transition"><ChevronRight className="h-5 w-5 text-gray-500" /></button>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 animate-pulse">
          {Array.from({ length: 8 }).map((_, i) => <div key={i} className="h-24 bg-gray-100 rounded-2xl" />)}
        </div>
      ) : (
        <div className="space-y-6">
          {/* Main KPIs */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <KpiCard label="Ventas del período" value={formatPrice(metrics.totalVentas)} color="blue" icon={<TrendingUp className="h-4 w-4" />} />
            <KpiCard label="Ganancia neta" value={formatPrice(metrics.gananciaNeta)} color={gananciaColor}
              icon={metrics.gananciaNeta >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />} />
            <KpiCard label="Total gastos" value={formatPrice(metrics.totalGastos)}
              sub={`Fijos: ${formatPrice(metrics.gfTotal)} | Var: ${formatPrice(metrics.totalCajaChica)}`} color="orange" />
            <KpiCard label="Reinversión 60%" value={formatPrice(metrics.reinversion60)} sub="Para reposición de stock" />
          </div>

          {/* Secondary KPIs */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <KpiCard label="Promedio por día" value={formatPrice(metrics.promedioDia)} sub={`${metrics.daysWithSales} días con ventas`} />
            <KpiCard label="Mejor día" value={formatPrice(metrics.mejorDia)} />
            <KpiCard label="Objetivo mensual" value={formatPrice(OBJETIVO_MENSUAL)} sub="Ganancia neta target" color="blue" icon={<Target className="h-4 w-4" />} />
            <KpiCard
              label="Estado"
              value={metrics.gananciaNeta >= OBJETIVO_MENSUAL ? 'SUPERADO' : metrics.gananciaNeta >= 0 ? 'EN CURSO' : 'PÉRDIDA'}
              color={metrics.gananciaNeta >= OBJETIVO_MENSUAL ? 'green' : metrics.gananciaNeta >= 0 ? 'orange' : 'red'}
            />
          </div>

          {/* Objetivo progress */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <div className="flex justify-between items-center mb-2">
              <p className="text-sm font-semibold text-gray-700">Progreso hacia objetivo mensual</p>
              <span className="text-sm font-bold text-gray-500">{progresoObjetivo.toFixed(1)}%</span>
            </div>
            <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${metrics.gananciaNeta < 0 ? 'bg-red-400' : progresoObjetivo >= 100 ? 'bg-emerald-500' : 'bg-primary-500'}`}
                style={{ width: `${progresoObjetivo}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>{formatPrice(Math.max(0, metrics.gananciaNeta))} alcanzado</span>
              <span>{formatPrice(OBJETIVO_MENSUAL)} objetivo</span>
            </div>
          </div>

          {/* ── CHART 1: Ventas diarias ── */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <p className="text-sm font-bold text-gray-700 mb-4">Ventas por día</p>
            {ventas.length === 0 ? (
              <p className="text-center text-gray-400 text-sm py-8">Sin datos de ventas</p>
            ) : (
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={dailySalesData} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="dia" tick={{ fontSize: 10, fill: '#94a3b8' }} tickLine={false} axisLine={false} interval={4} />
                  <YAxis tickFormatter={v => `$${(v / 1000).toFixed(0)}k`} tick={{ fontSize: 10, fill: '#94a3b8' }} tickLine={false} axisLine={false} width={40} />
                  <Tooltip content={<ChartTooltipPrice />} cursor={{ fill: '#f1f5f9' }} />
                  <Bar dataKey="ventas" fill="#16a34a" radius={[4, 4, 0, 0]} maxBarSize={24} name="Ventas" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* ── CHART 2: Acumulado vs Objetivo ── */}
          {acumuladoData.length > 0 && (
            <div className="bg-white rounded-2xl border border-gray-100 p-5">
              <p className="text-sm font-bold text-gray-700 mb-1">Acumulado vs objetivo diario</p>
              <p className="text-xs text-gray-400 mb-4">Línea verde = real acumulado · Línea gris = ritmo necesario para el objetivo</p>
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={acumuladoData} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorAcum" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#16a34a" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="#16a34a" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="dia" tick={{ fontSize: 10, fill: '#94a3b8' }} tickLine={false} axisLine={false} interval={4} />
                  <YAxis tickFormatter={v => `$${(v / 1_000_000).toFixed(1)}M`} tick={{ fontSize: 10, fill: '#94a3b8' }} tickLine={false} axisLine={false} width={44} />
                  <Tooltip content={<ChartTooltipPrice />} />
                  <Area type="monotone" dataKey="objetivo" stroke="#e2e8f0" strokeWidth={1.5} fill="none" dot={false} name="Objetivo" />
                  <Area type="monotone" dataKey="acumulado" stroke="#16a34a" strokeWidth={2} fill="url(#colorAcum)" dot={false} name="Acumulado" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* ── CHARTS 3+4: Pagos y Gastos fijos ── */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Pie de formas de pago */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5">
              <p className="text-sm font-bold text-gray-700 mb-4">Ventas por forma de pago</p>
              {pagoPieData.length === 0 ? (
                <p className="text-center text-gray-400 text-sm py-8">Sin ventas registradas</p>
              ) : (
                <div className="flex items-center gap-4">
                  <ResponsiveContainer width={140} height={140}>
                    <PieChart>
                      <Pie data={pagoPieData} cx="50%" cy="50%" innerRadius={40} outerRadius={65} dataKey="value" paddingAngle={2}>
                        {pagoPieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                      </Pie>
                      <Tooltip formatter={(v: number) => formatPrice(v)} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="flex flex-col gap-1.5 flex-1">
                    {pagoPieData.sort((a, b) => b.value - a.value).map(d => (
                      <div key={d.name} className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: d.color }} />
                        <span className="text-xs text-gray-600 flex-1">{d.name}</span>
                        <span className="text-xs font-bold text-gray-800">
                          {metrics.totalVentas > 0 ? `${((d.value / metrics.totalVentas) * 100).toFixed(0)}%` : '—'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Barra de gastos fijos */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5">
              <p className="text-sm font-bold text-gray-700 mb-4">Desglose gastos fijos</p>
              {gastosFijosBarData.length === 0 ? (
                <p className="text-center text-gray-400 text-sm py-8">Sin gastos fijos cargados</p>
              ) : (
                <ResponsiveContainer width="100%" height={Math.max(160, gastosFijosBarData.length * 28)}>
                  <BarChart data={gastosFijosBarData} layout="vertical" margin={{ top: 0, right: 8, left: 0, bottom: 0 }}>
                    <XAxis type="number" tickFormatter={v => `$${(v / 1000).toFixed(0)}k`} tick={{ fontSize: 10, fill: '#94a3b8' }} tickLine={false} axisLine={false} />
                    <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} tickLine={false} axisLine={false} width={72} />
                    <Tooltip formatter={(v: number) => formatPrice(v)} cursor={{ fill: '#f8fafc' }} />
                    <Bar dataKey="valor" fill="#f97316" radius={[0, 4, 4, 0]} maxBarSize={18} name="Gasto" />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          {/* Proyecciones */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="bg-white rounded-2xl border border-gray-100 p-4">
              <p className="text-xs text-gray-400 font-semibold uppercase mb-1">Proyección ventas mes</p>
              <p className="text-xl font-extrabold text-gray-900">{formatPrice(metrics.proyeccionMes)}</p>
              <p className="text-xs text-gray-400 mt-0.5">A este ritmo de ventas</p>
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 p-4">
              <p className="text-xs text-gray-400 font-semibold uppercase mb-1">Ganancia proyectada</p>
              <p className={`text-xl font-extrabold ${metrics.gananciaProyectada >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                {formatPrice(metrics.gananciaProyectada)}
              </p>
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 p-4">
              <p className="text-xs text-gray-400 font-semibold uppercase mb-1">Venta diaria necesaria</p>
              <p className="text-xl font-extrabold text-orange-600">{formatPrice(metrics.ventaDiariaNecesaria)}</p>
              <p className="text-xs text-gray-400 mt-0.5">Para llegar al objetivo</p>
            </div>
          </div>

          {/* Stock alerts + Top products */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white rounded-2xl border border-gray-100 p-5">
              <p className="text-sm font-bold text-gray-700 mb-3">Alertas de stock</p>
              <div className="space-y-2">
                {metrics.stockCritico > 0 && (
                  <div className="flex items-center gap-2 bg-red-50 text-red-700 rounded-xl px-3 py-2">
                    <AlertTriangle className="h-4 w-4 shrink-0" />
                    <span className="text-sm font-semibold">{metrics.stockCritico} productos con stock crítico</span>
                  </div>
                )}
                {metrics.stockBajo > 0 && (
                  <div className="flex items-center gap-2 bg-orange-50 text-orange-600 rounded-xl px-3 py-2">
                    <AlertTriangle className="h-4 w-4 shrink-0" />
                    <span className="text-sm font-semibold">{metrics.stockBajo} productos con stock bajo</span>
                  </div>
                )}
                {metrics.aRevisar > 0 && (
                  <div className="flex items-center gap-2 bg-yellow-50 text-yellow-700 rounded-xl px-3 py-2">
                    <AlertTriangle className="h-4 w-4 shrink-0" />
                    <span className="text-sm font-semibold">{metrics.aRevisar} productos con margen insuficiente</span>
                  </div>
                )}
                {metrics.stockCritico === 0 && metrics.stockBajo === 0 && metrics.aRevisar === 0 && (
                  <p className="text-gray-400 text-sm">Sin alertas activas</p>
                )}
              </div>
            </div>

            {metrics.top5.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-100 p-5">
                <p className="text-sm font-bold text-gray-700 mb-3">Top 5 productos por ganancia</p>
                <div className="space-y-2">
                  {metrics.top5.map((p, i) => (
                    <div key={p.id} className="flex items-center gap-2">
                      <span className="text-xs text-gray-400 w-4 shrink-0">{i + 1}.</span>
                      <Star className="h-3 w-3 text-yellow-400 shrink-0" />
                      <span className="text-sm text-gray-700 flex-1 truncate">{p.producto}</span>
                      <span className="text-sm font-bold text-emerald-600">{formatPrice(p.gananciaTotal)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </FinanzasLayout>
  )
}
