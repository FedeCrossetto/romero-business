import { useState, useEffect } from 'react'
import { Save, CheckCircle, Clock } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useSettings } from '@/hooks/useSettings'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { AdminLayout } from './AdminLayout'

interface Field {
  key: string
  label: string
  placeholder: string
  hint?: string
  type?: string
}

const FIELDS: Field[] = [
  {
    key: 'business_name',
    label: 'Nombre del negocio',
    placeholder: 'Verdulería Romero',
  },
  {
    key: 'whatsapp_number',
    label: 'Número de WhatsApp',
    placeholder: '5491173634746',
    hint: 'Sin +, espacios ni guiones. Ej: 5491173634746',
    type: 'tel',
  },
  {
    key: 'delivery_fee',
    label: 'Costo de envío ($)',
    placeholder: '500',
    type: 'number',
  },
  {
    key: 'free_shipping_threshold',
    label: 'Envío gratis a partir de ($)',
    placeholder: '20000',
    type: 'number',
    hint: 'Pedidos que superen este monto tienen envío gratis automáticamente.',
  },
  {
    key: 'business_address',
    label: 'Dirección del local',
    placeholder: 'Av. Rivadavia 1234, CABA',
  },
]

const DAYS = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'] as const
type Day = typeof DAYS[number]

function parseBusinessHours(str: string) {
  const fmt2 = (h: string, m: string) => `${h.padStart(2, '0')}:${m.padStart(2, '0')}`
  // Two-interval: "Lun-Sáb 9:00 a 13:00 y 16:00 a 20:00"
  const two = str.match(/(\S+)-(\S+)\s+(\d+):(\d+)\s+a\s+(\d+):(\d+)\s+y\s+(\d+):(\d+)\s+a\s+(\d+):(\d+)/)
  if (two) {
    const [, sd, ed, sh, sm, ch, cm, bsh, bsm, beh, bem] = two
    return { startDay: sd as Day, endDay: ed as Day, startTime: fmt2(sh, sm), endTime: fmt2(beh, bem), hasBreak: true, breakEnd: fmt2(ch, cm), breakStart: fmt2(bsh, bsm) }
  }
  // Single interval: "Lun-Sáb 8:00 a 20:00"
  const one = str.match(/(\S+)-(\S+)\s+(\d+):(\d+)\s+a\s+(\d+):(\d+)/)
  if (!one) return { startDay: 'Lun' as Day, endDay: 'Sáb' as Day, startTime: '08:00', endTime: '20:00', hasBreak: false, breakEnd: '13:00', breakStart: '16:00' }
  const [, sd, ed, sh, sm, eh, em] = one
  return { startDay: sd as Day, endDay: ed as Day, startTime: fmt2(sh, sm), endTime: fmt2(eh, em), hasBreak: false, breakEnd: '13:00', breakStart: '16:00' }
}

function formatBusinessHours(startDay: string, endDay: string, startTime: string, endTime: string, hasBreak: boolean, breakEnd: string, breakStart: string) {
  const fmt = (t: string) => t.replace(/^0/, '')
  if (hasBreak) return `${startDay}-${endDay} ${fmt(startTime)} a ${fmt(breakEnd)} y ${fmt(breakStart)} a ${fmt(endTime)}`
  return `${startDay}-${endDay} ${fmt(startTime)} a ${fmt(endTime)}`
}

export function AdminSettings() {
  const { settings, loading } = useSettings()
  const [values, setValues] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  // Structured hours state
  const [startDay, setStartDay] = useState<Day>('Lun')
  const [endDay, setEndDay] = useState<Day>('Sáb')
  const [startTime, setStartTime] = useState('08:00')
  const [endTime, setEndTime] = useState('20:00')
  const [hasBreak, setHasBreak] = useState(false)
  const [breakEnd, setBreakEnd] = useState('13:00')
  const [breakStart, setBreakStart] = useState('16:00')

  useEffect(() => {
    if (!loading) {
      const parsed = parseBusinessHours(settings.business_hours)
      setStartDay(parsed.startDay)
      setEndDay(parsed.endDay)
      setStartTime(parsed.startTime)
      setEndTime(parsed.endTime)
      setHasBreak(parsed.hasBreak)
      setBreakEnd(parsed.breakEnd)
      setBreakStart(parsed.breakStart)
      setValues({
        business_name: settings.business_name,
        whatsapp_number: settings.whatsapp_number,
        delivery_fee: settings.delivery_fee,
        free_shipping_threshold: settings.free_shipping_threshold,
        business_address: settings.business_address,
        business_hours: settings.business_hours,
        announcement_text: settings.announcement_text,
        announcement_active: settings.announcement_active,
      })
    }
  }, [loading, settings])

  // Keep business_hours value in sync with structured selectors
  useEffect(() => {
    setValues((prev) => ({
      ...prev,
      business_hours: formatBusinessHours(startDay, endDay, startTime, endTime, hasBreak, breakEnd, breakStart),
    }))
  }, [startDay, endDay, startTime, endTime, hasBreak, breakEnd, breakStart])

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setSaving(true)

    const upserts = Object.entries(values).map(([key, value]) => ({ key, value }))
    const { error: err } = await supabase
      .from('settings')
      .upsert(upserts, { onConflict: 'key' })

    setSaving(false)
    if (err) {
      setError(err.message)
      return
    }
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  // Preview del mensaje WhatsApp
  const previewNumber = values.whatsapp_number || '5491173634746'
  const previewName = values.business_name || 'el negocio'

  return (
    <AdminLayout>
      <div className="max-w-xl">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Configuración</h1>
          <p className="text-gray-500 text-sm mt-1">Datos del negocio y parámetros generales</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-700 text-sm rounded-2xl px-4 py-3 mb-6">{error}</div>
        )}

        <form onSubmit={handleSave} className="space-y-5">
          <div className="bg-white rounded-3xl shadow-card p-6 space-y-5">
            {FIELDS.map((field) => (
              <div key={field.key}>
                <Input
                  id={field.key}
                  label={field.label}
                  type={field.type ?? 'text'}
                  value={values[field.key] ?? ''}
                  onChange={(e) =>
                    setValues((prev) => ({ ...prev, [field.key]: e.target.value }))
                  }
                  placeholder={field.placeholder}
                />
                {field.hint && (
                  <p className="text-xs text-gray-400 mt-1 ml-1">{field.hint}</p>
                )}
              </div>
            ))}

            {/* Structured business hours */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Horario de atención
              </label>
              <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4 space-y-3">
                {/* Days */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs text-gray-500 mb-1 font-medium">Desde el día</p>
                    <select
                      value={startDay}
                      onChange={(e) => setStartDay(e.target.value as Day)}
                      className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      {DAYS.map((d) => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1 font-medium">Hasta el día</p>
                    <select
                      value={endDay}
                      onChange={(e) => setEndDay(e.target.value as Day)}
                      className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      {DAYS.map((d) => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </div>
                </div>

                {/* Time slots */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs text-gray-500 mb-1 font-medium">Apertura</p>
                    <input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)}
                      className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-primary-500" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1 font-medium">{hasBreak ? 'Cierre 1° turno' : 'Cierre'}</p>
                    <input type="time" value={hasBreak ? breakEnd : endTime} onChange={(e) => hasBreak ? setBreakEnd(e.target.value) : setEndTime(e.target.value)}
                      className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-primary-500" />
                  </div>
                </div>

                {/* Break toggle */}
                <label className="flex items-center gap-2.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={hasBreak}
                    onChange={(e) => setHasBreak(e.target.checked)}
                    className="w-4 h-4 accent-primary-600"
                  />
                  <span className="text-xs text-gray-600 font-medium">Tiene intervalo al mediodía (horario partido)</span>
                </label>

                {/* Break fields */}
                {hasBreak && (
                  <div className="grid grid-cols-2 gap-3 pl-2 border-l-2 border-primary-200">
                    <div>
                      <p className="text-xs text-gray-500 mb-1 font-medium">Reapertura 2° turno</p>
                      <input type="time" value={breakStart} onChange={(e) => setBreakStart(e.target.value)}
                        className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-primary-500" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1 font-medium">Cierre 2° turno</p>
                      <input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)}
                        className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-primary-500" />
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-2 pt-1 border-t border-gray-200">
                  <Clock className="h-3.5 w-3.5 text-primary-500 shrink-0" />
                  <p className="text-xs text-gray-500">
                    Se guardará como:{' '}
                    <span className="font-semibold text-gray-700">
                      {formatBusinessHours(startDay, endDay, startTime, endTime, hasBreak, breakEnd, breakStart)}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Announcement */}
          <div className="bg-white rounded-3xl shadow-card p-6 space-y-4">
            <div>
              <p className="font-bold text-gray-900">Banner de anuncio</p>
              <p className="text-xs text-gray-400 mt-0.5">Aparece en la parte superior de la web para todos los visitantes.</p>
            </div>
            <Input
              id="announcement_text"
              label="Texto del anuncio"
              value={values.announcement_text ?? ''}
              onChange={(e) => setValues((prev) => ({ ...prev, announcement_text: e.target.value }))}
              placeholder="Ej: ¡Hoy tenemos frutillas frescas! 🍓"
            />
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={values.announcement_active === 'true'}
                onChange={(e) =>
                  setValues((prev) => ({ ...prev, announcement_active: e.target.checked ? 'true' : 'false' }))
                }
                className="w-4 h-4 accent-primary-600"
              />
              <span className="text-sm text-gray-700 font-medium">Mostrar banner actualmente</span>
            </label>
          </div>

          {/* WhatsApp preview */}
          <div className="bg-primary-50 border border-primary-100 rounded-3xl p-5">
            <p className="text-xs font-semibold text-primary-700 uppercase tracking-wide mb-2">
              Vista previa del link de pedido
            </p>
            <p className="text-sm text-gray-600 break-all">
              wa.me/<span className="font-semibold text-primary-700">{previewNumber}</span>
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Los pedidos llegarán como "Hola <strong>{previewName}</strong>! Quiero hacer un pedido..."
            </p>
          </div>

          <Button type="submit" loading={saving} size="lg" className="w-full">
            {saved ? (
              <>
                <CheckCircle className="h-5 w-5" />
                Guardado
              </>
            ) : (
              <>
                <Save className="h-5 w-5" />
                Guardar cambios
              </>
            )}
          </Button>
        </form>
      </div>
    </AdminLayout>
  )
}
