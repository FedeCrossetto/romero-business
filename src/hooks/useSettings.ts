import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { Settings } from '@/types'

const defaultSettings: Settings = {
  whatsapp_number: '5491173634746',
  business_name: 'Verdulería Romero',
  delivery_fee: '500',
  free_shipping_threshold: '20000',
  business_address: '',
  business_hours: 'Lun-Sáb 8:00 a 20:00',
  announcement_active: 'false',
  announcement_text: '',
}

export function useSettings() {
  const [settings, setSettings] = useState<Settings>(defaultSettings)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetch() {
      const { data } = await supabase.from('settings').select('key, value')
      if (data) {
        const map = Object.fromEntries(data.map((r) => [r.key, r.value]))
        setSettings({ ...defaultSettings, ...map } as Settings)
      }
      setLoading(false)
    }
    fetch()
  }, [])

  return { settings, loading }
}
