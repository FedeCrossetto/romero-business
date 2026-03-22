import { useState, useEffect, useMemo } from 'react'
import { Plus, Trash2, ChevronLeft, ChevronRight } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { formatPrice } from '@/lib/utils'
import { Button } from '@/components/ui/Button'
import { FinanzasLayout } from './FinanzasLayout'

interface Venta {
  id: string
  fecha: string
  descripcion: string | null
  monto: number
  forma_pago: string
  created_at: string
}

const FORMAS_PAGO = [
  { value: 'efectivo', label: 'Efectivo' },
  { value: 'debito', label: 'Débito' },
  { value: 'transferencia', label: 'Transferencia' },
  { value: 'cuenta_dni', label: 'Cuenta DNI' },
  { value: 'credito', label: 'Crédito' },
]

const PAGO_COLORS: Record<string, string> = {
  efectivo: 'bg-emerald-100 text-emerald-700',
  debito: 'bg-blue-100 text-blue-700',
  transferencia: 'bg-violet-100 text-violet-700',
  cuenta_dni: 'bg-orange-100 text-orange-700',
  credito: 'bg-pink-100 text-pink-700',
}

function todayStr() {
  return new Date().toISOString().slice(0, 10)
}

export function FinanzasVentas() {
  const [fecha, setFecha] = useState(todayStr())
  const [ventas, setVentas] = useState<Venta[]>([])
  const [loading, setLoading] = useState(false)
  const [deleting, setDeleting] = useState<string | null>(null)

  // Form
  const [descripcion, setDescripcion] = useState('')
  const [monto, setMonto] = useState('')
  const [formaPago, setFormaPago] = useState('efectivo')
  const [saving, setSaving] = useState(false)

  async function load() {
    setLoading(true)
    const { data } = await supabase
      .from('ventas')
      .select('*')
      .eq('fecha', fecha)
      .order('created_at', { ascending: false })
    setVentas(data ?? [])
    setLoading(false)
  }

  useEffect(() => { load() }, [fecha])

  function prevDay() {
    const d = new Date(fecha + 'T12:00:00')
    d.setDate(d.getDate() - 1)
    setFecha(d.toISOString().slice(0, 10))
  }
  function nextDay() {
    const d = new Date(fecha + 'T12:00:00')
    d.setDate(d.getDate() + 1)
    setFecha(d.toISOString().slice(0, 10))
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    if (!monto || parseFloat(monto) <= 0) return
    setSaving(true)
    await supabase.from('ventas').insert({
      fecha,
      descripcion: descripcion.trim() || null,
      monto: parseFloat(monto),
      forma_pago: formaPago,
    })
    setMonto('')
    setDescripcion('')
    setSaving(false)
    load()
  }

  async function handleDelete(id: string) {
    setDeleting(id)
    await supabase.from('ventas').delete().eq('id', id)
    setDeleting(null)
    load()
  }

  const totals = useMemo(() => {
    const total = ventas.reduce((s, v) => s + v.monto, 0)
    const byPago: Record<string, number> = {}
    ventas.forEach(v => { byPago[v.forma_pago] = (byPago[v.forma_pago] ?? 0) + v.monto })
    return { total, byPago }
  }, [ventas])

  const fechaDisplay = new Date(fecha + 'T12:00:00').toLocaleDateString('es-AR', {
    weekday: 'long', day: 'numeric', month: 'long',
  })

  return (
    <FinanzasLayout>
      <div className="max-w-2xl space-y-5">
        {/* Date navigator */}
        <div className="flex items-center gap-3">
          <button onClick={prevDay} className="p-2 rounded-xl hover:bg-gray-100 transition">
            <ChevronLeft className="h-5 w-5 text-gray-500" />
          </button>
          <div className="flex-1 text-center">
            <input
              type="date"
              value={fecha}
              onChange={e => setFecha(e.target.value)}
              className="sr-only"
              id="fecha-ventas"
            />
            <label htmlFor="fecha-ventas" className="font-bold text-lg text-gray-800 capitalize cursor-pointer hover:text-primary-600 transition">
              {fechaDisplay}
            </label>
          </div>
          <button onClick={nextDay} className="p-2 rounded-xl hover:bg-gray-100 transition">
            <ChevronRight className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Add sale form */}
        <form onSubmit={handleAdd} className="bg-white rounded-2xl border border-gray-100 p-5">
          <p className="text-sm font-bold text-gray-700 mb-4">Registrar venta</p>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-gray-500 font-medium mb-1 block">Monto ($) *</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={monto}
                  onChange={e => setMonto(e.target.value)}
                  placeholder="0"
                  required
                  className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 font-medium mb-1 block">Forma de pago</label>
                <select
                  value={formaPago}
                  onChange={e => setFormaPago(e.target.value)}
                  className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  {FORMAS_PAGO.map(f => <option key={f.value} value={f.value}>{f.label}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="text-xs text-gray-500 font-medium mb-1 block">Descripción (opcional)</label>
              <input
                type="text"
                value={descripcion}
                onChange={e => setDescripcion(e.target.value)}
                placeholder="Ej: Venta mostrador mañana"
                className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <Button type="submit" loading={saving} className="w-full">
              <Plus className="h-4 w-4" />
              Agregar venta
            </Button>
          </div>
        </form>

        {/* Daily summary by payment */}
        {Object.keys(totals.byPago).length > 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 p-4">
            <div className="flex justify-between items-center mb-3">
              <p className="text-sm font-bold text-gray-700">Resumen del día</p>
              <p className="text-xl font-extrabold text-primary-700">{formatPrice(totals.total)}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {Object.entries(totals.byPago).map(([pago, total]) => (
                <span key={pago} className={`text-xs font-semibold px-3 py-1 rounded-full ${PAGO_COLORS[pago] ?? 'bg-gray-100 text-gray-600'}`}>
                  {FORMAS_PAGO.find(f => f.value === pago)?.label ?? pago}: {formatPrice(total)}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Sales list */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-50 flex justify-between items-center">
            <p className="text-sm font-bold text-gray-700">Ventas registradas ({ventas.length})</p>
          </div>
          {loading ? (
            <div className="p-8 text-center text-gray-400 text-sm">Cargando...</div>
          ) : ventas.length === 0 ? (
            <div className="p-8 text-center text-gray-400 text-sm">Sin ventas para este día</div>
          ) : (
            <div className="divide-y divide-gray-50">
              {ventas.map(v => (
                <div key={v.id} className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50/50 transition">
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full shrink-0 ${PAGO_COLORS[v.forma_pago] ?? 'bg-gray-100 text-gray-600'}`}>
                    {FORMAS_PAGO.find(f => f.value === v.forma_pago)?.label ?? v.forma_pago}
                  </span>
                  <span className="text-sm text-gray-500 flex-1 truncate">{v.descripcion ?? '—'}</span>
                  <span className="text-sm font-bold text-gray-900 shrink-0">{formatPrice(v.monto)}</span>
                  <button
                    onClick={() => handleDelete(v.id)}
                    disabled={deleting === v.id}
                    className="p-1.5 rounded-lg hover:bg-red-50 text-gray-300 hover:text-red-500 transition disabled:opacity-40 shrink-0"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </FinanzasLayout>
  )
}
