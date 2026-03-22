import { useState, useEffect } from 'react'
import { Save, CheckCircle } from 'lucide-react'
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
  {
    key: 'business_hours',
    label: 'Horario de atención',
    placeholder: 'Lun-Sáb 8:00 a 20:00',
  },
]

export function AdminSettings() {
  const { settings, loading } = useSettings()
  const [values, setValues] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!loading) {
      setValues({
        business_name: settings.business_name,
        whatsapp_number: settings.whatsapp_number,
        delivery_fee: settings.delivery_fee,
        business_address: settings.business_address,
        business_hours: settings.business_hours,
      })
    }
  }, [loading, settings])

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
