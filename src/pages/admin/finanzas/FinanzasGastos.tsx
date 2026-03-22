import { useState, useEffect, useMemo } from 'react'
import { Plus, Trash2, Save, ChevronLeft, ChevronRight } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { formatPrice } from '@/lib/utils'
import { Button } from '@/components/ui/Button'
import { FinanzasLayout } from './FinanzasLayout'

interface GastoVar { id: string; fecha: string; descripcion: string | null; categoria: string; monto: number }

const CATEGORIAS = [
  { value: 'mercaderia', label: 'Mercadería', color: 'bg-emerald-100 text-emerald-700' },
  { value: 'servicios', label: 'Servicios', color: 'bg-blue-100 text-blue-700' },
  { value: 'transporte', label: 'Transporte', color: 'bg-orange-100 text-orange-700' },
  { value: 'otros', label: 'Otros', color: 'bg-gray-100 text-gray-600' },
]

const GASTOS_FIJOS_FIELDS = [
  { key: 'luz', label: 'Luz' },
  { key: 'agua', label: 'Agua' },
  { key: 'nafta', label: 'Nafta' },
  { key: 'sueldo', label: 'Sueldo' },
  { key: 'internet', label: 'Internet' },
  { key: 'seguro', label: 'Seguro' },
  { key: 'monotributo', label: 'Monotributo' },
  { key: 'contadora', label: 'Contadora' },
  { key: 'camioneta', label: 'Camioneta' },
  { key: 'telefonos', label: 'Teléfonos' },
  { key: 'papeleria', label: 'Art. Papelería' },
  { key: 'alquiler', label: 'Alquiler' },
] as const

type GastosFijosKey = typeof GASTOS_FIJOS_FIELDS[number]['key']
type GastosFijosValues = Record<GastosFijosKey, string>

const MONTH_NAMES = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre']

function todayStr() { return new Date().toISOString().slice(0, 10) }

export function FinanzasGastos() {
  const [tab, setTab] = useState<'caja' | 'fijos'>('caja')

  // --- Caja Chica state ---
  const [fecha, setFecha] = useState(todayStr())
  const [gastos, setGastos] = useState<GastoVar[]>([])
  const [loadingCaja, setLoadingCaja] = useState(false)
  const [deleting, setDeleting] = useState<string | null>(null)
  const [categoria, setCategoria] = useState('mercaderia')
  const [monto, setMonto] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [savingCaja, setSavingCaja] = useState(false)

  // --- Gastos Fijos state ---
  const now = new Date()
  const [gfYear, setGfYear] = useState(now.getFullYear())
  const [gfMonth, setGfMonth] = useState(now.getMonth() + 1)
  const [gfValues, setGfValues] = useState<GastosFijosValues>(() =>
    Object.fromEntries(GASTOS_FIJOS_FIELDS.map(f => [f.key, '0'])) as GastosFijosValues
  )
  const [gfId, setGfId] = useState<string | null>(null)
  const [loadingGF, setLoadingGF] = useState(false)
  const [savingGF, setSavingGF] = useState(false)
  const [savedGF, setSavedGF] = useState(false)

  // Load caja chica for selected date
  async function loadCaja() {
    setLoadingCaja(true)
    const { data } = await supabase.from('caja_chica').select('*').eq('fecha', fecha).order('created_at', { ascending: false })
    setGastos(data ?? [])
    setLoadingCaja(false)
  }

  useEffect(() => { loadCaja() }, [fecha])

  // Load gastos fijos for selected month
  async function loadGF() {
    setLoadingGF(true)
    const mes = `${gfYear}-${String(gfMonth).padStart(2, '0')}-01`
    const { data } = await supabase.from('gastos_fijos').select('*').eq('mes', mes).maybeSingle()
    if (data) {
      setGfId(data.id)
      const vals: Partial<GastosFijosValues> = {}
      GASTOS_FIJOS_FIELDS.forEach(f => { vals[f.key] = String(data[f.key] ?? 0) })
      setGfValues(vals as GastosFijosValues)
    } else {
      setGfId(null)
      setGfValues(Object.fromEntries(GASTOS_FIJOS_FIELDS.map(f => [f.key, '0'])) as GastosFijosValues)
    }
    setLoadingGF(false)
  }

  useEffect(() => { loadGF() }, [gfYear, gfMonth])

  function prevDay() {
    const d = new Date(fecha + 'T12:00:00'); d.setDate(d.getDate() - 1)
    setFecha(d.toISOString().slice(0, 10))
  }
  function nextDay() {
    const d = new Date(fecha + 'T12:00:00'); d.setDate(d.getDate() + 1)
    setFecha(d.toISOString().slice(0, 10))
  }
  function prevMonth() { if (gfMonth === 1) { setGfMonth(12); setGfYear(y => y - 1) } else setGfMonth(m => m - 1) }
  function nextMonth() { if (gfMonth === 12) { setGfMonth(1); setGfYear(y => y + 1) } else setGfMonth(m => m + 1) }

  async function handleAddCaja(e: React.FormEvent) {
    e.preventDefault()
    if (!monto || parseFloat(monto) <= 0) return
    setSavingCaja(true)
    await supabase.from('caja_chica').insert({
      fecha, categoria,
      descripcion: descripcion.trim() || null,
      monto: parseFloat(monto),
    })
    setMonto(''); setDescripcion('')
    setSavingCaja(false)
    loadCaja()
  }

  async function handleDeleteCaja(id: string) {
    setDeleting(id)
    await supabase.from('caja_chica').delete().eq('id', id)
    setDeleting(null)
    loadCaja()
  }

  async function handleSaveGF(e: React.FormEvent) {
    e.preventDefault()
    setSavingGF(true)
    const mes = `${gfYear}-${String(gfMonth).padStart(2, '0')}-01`
    const row: Record<string, number | string> = { mes }
    GASTOS_FIJOS_FIELDS.forEach(f => { row[f.key] = parseFloat(gfValues[f.key]) || 0 })

    if (gfId) {
      await supabase.from('gastos_fijos').update(row).eq('id', gfId)
    } else {
      const { data } = await supabase.from('gastos_fijos').insert(row).select('id').single()
      if (data) setGfId(data.id)
    }
    setSavingGF(false)
    setSavedGF(true)
    setTimeout(() => setSavedGF(false), 2500)
  }

  const totalCaja = useMemo(() => gastos.reduce((s, g) => s + g.monto, 0), [gastos])
  const totalGF = useMemo(() =>
    GASTOS_FIJOS_FIELDS.reduce((s, f) => s + (parseFloat(gfValues[f.key]) || 0), 0),
    [gfValues]
  )

  const fechaDisplay = new Date(fecha + 'T12:00:00').toLocaleDateString('es-AR', {
    weekday: 'long', day: 'numeric', month: 'long',
  })

  return (
    <FinanzasLayout>
      {/* Tab selector */}
      <div className="flex gap-1 bg-gray-100 rounded-2xl p-1 w-fit mb-6">
        {(['caja', 'fijos'] as const).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${tab === t ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
          >
            {t === 'caja' ? 'Caja Chica' : 'Gastos Fijos'}
          </button>
        ))}
      </div>

      {tab === 'caja' ? (
        <div className="max-w-2xl space-y-5">
          {/* Date navigator */}
          <div className="flex items-center gap-3">
            <button onClick={prevDay} className="p-2 rounded-xl hover:bg-gray-100 transition"><ChevronLeft className="h-5 w-5 text-gray-500" /></button>
            <div className="flex-1 text-center">
              <input type="date" value={fecha} onChange={e => setFecha(e.target.value)} className="sr-only" id="fecha-caja" />
              <label htmlFor="fecha-caja" className="font-bold text-lg text-gray-800 capitalize cursor-pointer hover:text-primary-600 transition">
                {fechaDisplay}
              </label>
            </div>
            <button onClick={nextDay} className="p-2 rounded-xl hover:bg-gray-100 transition"><ChevronRight className="h-5 w-5 text-gray-500" /></button>
          </div>

          {/* Add expense form */}
          <form onSubmit={handleAddCaja} className="bg-white rounded-2xl border border-gray-100 p-5">
            <p className="text-sm font-bold text-gray-700 mb-4">Registrar gasto</p>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-gray-500 font-medium mb-1 block">Monto ($) *</label>
                  <input
                    type="number" min="0" step="0.01" value={monto}
                    onChange={e => setMonto(e.target.value)}
                    placeholder="0" required
                    className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500 font-medium mb-1 block">Categoría</label>
                  <select
                    value={categoria} onChange={e => setCategoria(e.target.value)}
                    className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    {CATEGORIAS.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="text-xs text-gray-500 font-medium mb-1 block">Descripción (opcional)</label>
                <input
                  type="text" value={descripcion} onChange={e => setDescripcion(e.target.value)}
                  placeholder="Ej: Compra cajón de naranjas"
                  className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <Button type="submit" loading={savingCaja} className="w-full">
                <Plus className="h-4 w-4" /> Agregar gasto
              </Button>
            </div>
          </form>

          {/* Total */}
          {gastos.length > 0 && (
            <div className="bg-orange-50 border border-orange-200 rounded-2xl px-4 py-3 flex justify-between items-center">
              <p className="text-sm font-semibold text-orange-700">Total caja chica del día</p>
              <p className="text-xl font-extrabold text-orange-700">{formatPrice(totalCaja)}</p>
            </div>
          )}

          {/* List */}
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-50">
              <p className="text-sm font-bold text-gray-700">Gastos del día ({gastos.length})</p>
            </div>
            {loadingCaja ? (
              <div className="p-8 text-center text-gray-400 text-sm">Cargando...</div>
            ) : gastos.length === 0 ? (
              <div className="p-8 text-center text-gray-400 text-sm">Sin gastos para este día</div>
            ) : (
              <div className="divide-y divide-gray-50">
                {gastos.map(g => {
                  const cat = CATEGORIAS.find(c => c.value === g.categoria)
                  return (
                    <div key={g.id} className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50/50 transition">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full shrink-0 ${cat?.color ?? 'bg-gray-100 text-gray-600'}`}>
                        {cat?.label ?? g.categoria}
                      </span>
                      <span className="text-sm text-gray-500 flex-1 truncate">{g.descripcion ?? '—'}</span>
                      <span className="text-sm font-bold text-gray-900 shrink-0">{formatPrice(g.monto)}</span>
                      <button
                        onClick={() => handleDeleteCaja(g.id)}
                        disabled={deleting === g.id}
                        className="p-1.5 rounded-lg hover:bg-red-50 text-gray-300 hover:text-red-500 transition disabled:opacity-40 shrink-0"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="max-w-xl space-y-5">
          {/* Month navigator */}
          <div className="flex items-center gap-3">
            <button onClick={prevMonth} className="p-2 rounded-xl hover:bg-gray-100 transition"><ChevronLeft className="h-5 w-5 text-gray-500" /></button>
            <p className="font-bold text-lg text-gray-800 flex-1 text-center">{MONTH_NAMES[gfMonth - 1]} {gfYear}</p>
            <button onClick={nextMonth} className="p-2 rounded-xl hover:bg-gray-100 transition"><ChevronRight className="h-5 w-5 text-gray-500" /></button>
          </div>

          <form onSubmit={handleSaveGF}>
            <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-4">
              <p className="text-sm font-bold text-gray-700">Gastos fijos del mes</p>
              {loadingGF ? (
                <div className="text-center text-gray-400 text-sm py-4">Cargando...</div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  {GASTOS_FIJOS_FIELDS.map(f => (
                    <div key={f.key}>
                      <label className="text-xs text-gray-500 font-medium mb-1 block">{f.label}</label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">$</span>
                        <input
                          type="number" min="0" step="0.01"
                          value={gfValues[f.key]}
                          onChange={e => setGfValues(prev => ({ ...prev, [f.key]: e.target.value }))}
                          className="w-full text-sm border border-gray-200 rounded-xl pl-6 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <div className="border-t border-gray-100 pt-3 flex justify-between items-center">
                <p className="text-sm font-semibold text-gray-700">Total mensual</p>
                <p className="text-xl font-extrabold text-gray-900">{formatPrice(totalGF)}</p>
              </div>
              <div className="text-xs text-gray-400 text-right">
                Costo diario: {formatPrice(totalGF / new Date(gfYear, gfMonth, 0).getDate())}
              </div>
              <Button type="submit" loading={savingGF} size="lg" className="w-full">
                <Save className="h-4 w-4" />
                {savedGF ? 'Guardado' : 'Guardar gastos del mes'}
              </Button>
            </div>
          </form>
        </div>
      )}
    </FinanzasLayout>
  )
}
