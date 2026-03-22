import { useState, useEffect, useMemo } from 'react'
import { Plus, Edit2, Trash2, AlertTriangle, TrendingUp, X, Save } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { formatPrice } from '@/lib/utils'
import { Button } from '@/components/ui/Button'
import { FinanzasLayout } from './FinanzasLayout'

interface StockItem {
  id: string
  producto: string
  proveedor: string | null
  precio_cajon: number | null
  kg_por_cajon: number | null
  cajones_comprados: number
  cajones_vendidos: number
  kg_vendidos: number
  precio_venta_real: number | null
  porcentaje_reinversion: number
  notas: string | null
}

type FormData = {
  producto: string; proveedor: string; precio_cajon: string; kg_por_cajon: string
  cajones_comprados: string; cajones_vendidos: string; kg_vendidos: string
  precio_venta_real: string; porcentaje_reinversion: string; notas: string
}

const EMPTY_FORM: FormData = {
  producto: '', proveedor: '', precio_cajon: '', kg_por_cajon: '',
  cajones_comprados: '0', cajones_vendidos: '0', kg_vendidos: '0',
  precio_venta_real: '', porcentaje_reinversion: '60', notas: '',
}

function calcItem(item: StockItem) {
  const costKg = item.precio_cajon && item.kg_por_cajon ? item.precio_cajon / item.kg_por_cajon : null
  const precioRec = costKg ? costKg * (1 + item.porcentaje_reinversion) : null
  const gananciaKg = item.precio_venta_real && costKg ? item.precio_venta_real - costKg : null
  const gananciaPct = gananciaKg && costKg ? gananciaKg / costKg : null
  const kgVendidosReal = item.kg_vendidos || (item.cajones_vendidos * (item.kg_por_cajon ?? 0))
  const gananciaTotal = gananciaKg ? gananciaKg * kgVendidosReal : 0
  const stockCajones = item.cajones_comprados - item.cajones_vendidos
  const stockKg = stockCajones * (item.kg_por_cajon ?? 0) - (item.kg_vendidos ?? 0)
  const difVsReinversion = gananciaPct !== null ? gananciaPct - item.porcentaje_reinversion : null

  const alerta = stockCajones <= 0 ? 'critico' : stockCajones <= 2 ? 'bajo' : 'ok'
  const clasificacion = gananciaPct === null ? 'sin_precio' : gananciaPct >= item.porcentaje_reinversion ? 'ok' : 'revisar'

  return { costKg, precioRec, gananciaKg, gananciaPct, gananciaTotal, stockCajones, stockKg, difVsReinversion, alerta, clasificacion }
}

const ALERT_STYLES: Record<string, string> = {
  critico: 'bg-red-100 text-red-700',
  bajo: 'bg-orange-100 text-orange-700',
  ok: 'bg-emerald-100 text-emerald-700',
}
const CLASIF_STYLES: Record<string, string> = {
  ok: 'bg-emerald-100 text-emerald-700',
  revisar: 'bg-yellow-100 text-yellow-700',
  sin_precio: 'bg-gray-100 text-gray-500',
}

export function FinanzasStock() {
  const [items, setItems] = useState<StockItem[]>([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState<string | null>(null)
  const [editItem, setEditItem] = useState<StockItem | 'new' | null>(null)
  const [form, setForm] = useState<FormData>(EMPTY_FORM)
  const [saving, setSaving] = useState(false)
  const [search, setSearch] = useState('')

  async function load() {
    setLoading(true)
    const { data } = await supabase.from('stock_inteligente').select('*').order('producto')
    setItems(data ?? [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  function openNew() {
    setForm(EMPTY_FORM)
    setEditItem('new')
  }

  function openEdit(item: StockItem) {
    setForm({
      producto: item.producto,
      proveedor: item.proveedor ?? '',
      precio_cajon: item.precio_cajon?.toString() ?? '',
      kg_por_cajon: item.kg_por_cajon?.toString() ?? '',
      cajones_comprados: item.cajones_comprados.toString(),
      cajones_vendidos: item.cajones_vendidos.toString(),
      kg_vendidos: item.kg_vendidos?.toString() ?? '0',
      precio_venta_real: item.precio_venta_real?.toString() ?? '',
      porcentaje_reinversion: (item.porcentaje_reinversion * 100).toString(),
      notas: item.notas ?? '',
    })
    setEditItem(item)
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    if (!form.producto.trim()) return
    setSaving(true)

    const row = {
      producto: form.producto.trim().toUpperCase(),
      proveedor: form.proveedor.trim() || null,
      precio_cajon: form.precio_cajon ? parseFloat(form.precio_cajon) : null,
      kg_por_cajon: form.kg_por_cajon ? parseFloat(form.kg_por_cajon) : null,
      cajones_comprados: parseFloat(form.cajones_comprados) || 0,
      cajones_vendidos: parseFloat(form.cajones_vendidos) || 0,
      kg_vendidos: parseFloat(form.kg_vendidos) || 0,
      precio_venta_real: form.precio_venta_real ? parseFloat(form.precio_venta_real) : null,
      porcentaje_reinversion: (parseFloat(form.porcentaje_reinversion) || 60) / 100,
      notas: form.notas.trim() || null,
      updated_at: new Date().toISOString(),
    }

    if (editItem === 'new') {
      await supabase.from('stock_inteligente').insert(row)
    } else if (editItem) {
      await supabase.from('stock_inteligente').update(row).eq('id', editItem.id)
    }

    setSaving(false)
    setEditItem(null)
    load()
  }

  async function handleDelete(id: string) {
    if (!confirm('¿Eliminar este producto del stock?')) return
    setDeleting(id)
    await supabase.from('stock_inteligente').delete().eq('id', id)
    setDeleting(null)
    load()
  }

  const computed = useMemo(() => items.map(item => ({ ...item, ...calcItem(item) })), [items])

  const filtered = useMemo(() => {
    if (!search.trim()) return computed
    const q = search.toLowerCase()
    return computed.filter(i => i.producto.toLowerCase().includes(q) || (i.proveedor?.toLowerCase().includes(q)))
  }, [computed, search])

  const alerts = useMemo(() => ({
    critico: computed.filter(i => i.alerta === 'critico').length,
    bajo: computed.filter(i => i.alerta === 'bajo').length,
    revisar: computed.filter(i => i.clasificacion === 'revisar').length,
  }), [computed])

  // Live calcs for form preview
  const formCalc = useMemo(() => {
    const pc = parseFloat(form.precio_cajon) || 0
    const kg = parseFloat(form.kg_por_cajon) || 0
    const pvr = parseFloat(form.precio_venta_real) || 0
    const reinv = (parseFloat(form.porcentaje_reinversion) || 60) / 100
    const costKg = pc && kg ? pc / kg : null
    const precioRec = costKg ? costKg * (1 + reinv) : null
    const gananciaKg = pvr && costKg ? pvr - costKg : null
    const gananciaPct = gananciaKg && costKg ? (gananciaKg / costKg) * 100 : null
    return { costKg, precioRec, gananciaKg, gananciaPct }
  }, [form.precio_cajon, form.kg_por_cajon, form.precio_venta_real, form.porcentaje_reinversion])

  return (
    <FinanzasLayout>
      {/* Alerts banner */}
      {(alerts.critico > 0 || alerts.bajo > 0 || alerts.revisar > 0) && (
        <div className="flex flex-wrap gap-2 mb-4">
          {alerts.critico > 0 && (
            <div className="flex items-center gap-1.5 bg-red-50 text-red-700 text-xs font-semibold px-3 py-1.5 rounded-full">
              <AlertTriangle className="h-3.5 w-3.5" /> {alerts.critico} stock crítico
            </div>
          )}
          {alerts.bajo > 0 && (
            <div className="flex items-center gap-1.5 bg-orange-50 text-orange-600 text-xs font-semibold px-3 py-1.5 rounded-full">
              <AlertTriangle className="h-3.5 w-3.5" /> {alerts.bajo} stock bajo
            </div>
          )}
          {alerts.revisar > 0 && (
            <div className="flex items-center gap-1.5 bg-yellow-50 text-yellow-700 text-xs font-semibold px-3 py-1.5 rounded-full">
              <AlertTriangle className="h-3.5 w-3.5" /> {alerts.revisar} margen insuficiente
            </div>
          )}
        </div>
      )}

      {/* Toolbar */}
      <div className="flex items-center gap-3 mb-4">
        <input
          type="text" value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Buscar producto o proveedor..."
          className="flex-1 min-w-0 text-sm border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
        <Button onClick={openNew}>
          <Plus className="h-4 w-4" /> Nuevo producto
        </Button>
      </div>

      {/* Table */}
      {loading ? (
        <div className="text-center py-12 text-gray-400">Cargando...</div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Producto</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase hidden md:table-cell">Proveedor</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Costo/kg</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">P. Rec.</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">P. Real</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase hidden sm:table-cell">Margen</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase hidden sm:table-cell">Ganancia $</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase">Stock</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase">Estado</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.length === 0 ? (
                  <tr><td colSpan={10} className="text-center py-12 text-gray-400">
                    {items.length === 0 ? 'No hay productos. Agregá el primero.' : 'Sin resultados.'}
                  </td></tr>
                ) : filtered.map(item => (
                  <tr key={item.id} className="hover:bg-gray-50/60 transition">
                    <td className="px-4 py-3 font-semibold text-gray-900">{item.producto}</td>
                    <td className="px-4 py-3 text-gray-400 hidden md:table-cell">{item.proveedor ?? '—'}</td>
                    <td className="px-4 py-3 text-right text-gray-600">{item.costKg ? formatPrice(item.costKg) : '—'}</td>
                    <td className="px-4 py-3 text-right text-blue-600 font-medium">{item.precioRec ? formatPrice(item.precioRec) : '—'}</td>
                    <td className="px-4 py-3 text-right font-bold text-gray-900">{item.precio_venta_real ? formatPrice(item.precio_venta_real) : '—'}</td>
                    <td className="px-4 py-3 text-right hidden sm:table-cell">
                      {item.gananciaPct !== null ? (
                        <span className={`text-xs font-bold ${item.gananciaPct >= item.porcentaje_reinversion ? 'text-emerald-600' : 'text-red-600'}`}>
                          {(item.gananciaPct * 100).toFixed(0)}%
                        </span>
                      ) : '—'}
                    </td>
                    <td className="px-4 py-3 text-right hidden sm:table-cell">
                      {item.gananciaTotal > 0 ? (
                        <span className="text-emerald-600 font-bold flex items-center justify-end gap-0.5">
                          <TrendingUp className="h-3 w-3" />{formatPrice(item.gananciaTotal)}
                        </span>
                      ) : item.gananciaTotal < 0 ? (
                        <span className="text-red-500 font-bold">{formatPrice(item.gananciaTotal)}</span>
                      ) : '—'}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${ALERT_STYLES[item.alerta]}`}>
                        {item.stockCajones} caj.
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${CLASIF_STYLES[item.clasificacion]}`}>
                        {item.clasificacion === 'ok' ? 'OK' : item.clasificacion === 'revisar' ? 'Revisar' : 'Sin precio'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-1">
                        <button onClick={() => openEdit(item)} className="p-1.5 rounded-lg hover:bg-primary-50 text-gray-400 hover:text-primary-600 transition">
                          <Edit2 className="h-3.5 w-3.5" />
                        </button>
                        <button onClick={() => handleDelete(item.id)} disabled={deleting === item.id} className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition disabled:opacity-40">
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal */}
      {editItem !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <h2 className="font-bold text-lg text-gray-900">
                {editItem === 'new' ? 'Nuevo producto' : `Editar: ${(editItem as StockItem).producto}`}
              </h2>
              <button onClick={() => setEditItem(null)} className="p-2 rounded-xl hover:bg-gray-100 transition">
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <label className="text-xs text-gray-500 font-medium mb-1 block">Producto *</label>
                  <input type="text" value={form.producto} onChange={e => setForm(p => ({ ...p, producto: e.target.value }))} required
                    className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 uppercase" placeholder="NARANJA" />
                </div>
                <div>
                  <label className="text-xs text-gray-500 font-medium mb-1 block">Proveedor</label>
                  <input type="text" value={form.proveedor} onChange={e => setForm(p => ({ ...p, proveedor: e.target.value }))}
                    className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500" placeholder="DANI" />
                </div>
                <div>
                  <label className="text-xs text-gray-500 font-medium mb-1 block">% Reinversión objetivo</label>
                  <input type="number" min="0" max="100" value={form.porcentaje_reinversion} onChange={e => setForm(p => ({ ...p, porcentaje_reinversion: e.target.value }))}
                    className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500" />
                </div>
                <div>
                  <label className="text-xs text-gray-500 font-medium mb-1 block">Precio cajón ($)</label>
                  <input type="number" min="0" step="0.01" value={form.precio_cajon} onChange={e => setForm(p => ({ ...p, precio_cajon: e.target.value }))}
                    className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500" placeholder="20000" />
                </div>
                <div>
                  <label className="text-xs text-gray-500 font-medium mb-1 block">Kg por cajón</label>
                  <input type="number" min="0" step="0.001" value={form.kg_por_cajon} onChange={e => setForm(p => ({ ...p, kg_por_cajon: e.target.value }))}
                    className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500" placeholder="17" />
                </div>
                <div>
                  <label className="text-xs text-gray-500 font-medium mb-1 block">Cajones comprados</label>
                  <input type="number" min="0" step="0.5" value={form.cajones_comprados} onChange={e => setForm(p => ({ ...p, cajones_comprados: e.target.value }))}
                    className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500" />
                </div>
                <div>
                  <label className="text-xs text-gray-500 font-medium mb-1 block">Cajones vendidos</label>
                  <input type="number" min="0" step="0.5" value={form.cajones_vendidos} onChange={e => setForm(p => ({ ...p, cajones_vendidos: e.target.value }))}
                    className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500" />
                </div>
                <div>
                  <label className="text-xs text-gray-500 font-medium mb-1 block">Kg vendidos (parcial)</label>
                  <input type="number" min="0" step="0.1" value={form.kg_vendidos} onChange={e => setForm(p => ({ ...p, kg_vendidos: e.target.value }))}
                    className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500" />
                </div>
                <div>
                  <label className="text-xs text-gray-500 font-medium mb-1 block">Precio venta real ($/kg)</label>
                  <input type="number" min="0" step="0.01" value={form.precio_venta_real} onChange={e => setForm(p => ({ ...p, precio_venta_real: e.target.value }))}
                    className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500" placeholder="2000" />
                </div>
              </div>

              {/* Live preview */}
              {(formCalc.costKg || formCalc.precioRec) && (
                <div className="bg-gray-50 rounded-2xl p-4 grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <p className="text-gray-400 font-medium">Costo por kg</p>
                    <p className="font-bold text-gray-800">{formCalc.costKg ? formatPrice(formCalc.costKg) : '—'}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 font-medium">Precio recomendado</p>
                    <p className="font-bold text-blue-600">{formCalc.precioRec ? formatPrice(formCalc.precioRec) : '—'}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 font-medium">Ganancia por kg</p>
                    <p className={`font-bold ${formCalc.gananciaKg && formCalc.gananciaKg > 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                      {formCalc.gananciaKg ? formatPrice(formCalc.gananciaKg) : '—'}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400 font-medium">Margen real</p>
                    <p className={`font-bold ${formCalc.gananciaPct && formCalc.gananciaPct > 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                      {formCalc.gananciaPct ? `${formCalc.gananciaPct.toFixed(1)}%` : '—'}
                    </p>
                  </div>
                </div>
              )}

              <div>
                <label className="text-xs text-gray-500 font-medium mb-1 block">Notas</label>
                <textarea value={form.notas} onChange={e => setForm(p => ({ ...p, notas: e.target.value }))} rows={2}
                  className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none" />
              </div>

              <div className="flex gap-2 pt-2">
                <Button type="button" variant="secondary" className="flex-1" onClick={() => setEditItem(null)}>Cancelar</Button>
                <Button type="submit" loading={saving} className="flex-1">
                  <Save className="h-4 w-4" /> Guardar
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </FinanzasLayout>
  )
}
