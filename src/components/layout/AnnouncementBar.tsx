import { useState } from 'react'
import { X, Megaphone } from 'lucide-react'
import { useSettings } from '@/hooks/useSettings'

export function AnnouncementBar() {
  const { settings } = useSettings()
  const [dismissed, setDismissed] = useState(false)

  if (
    dismissed ||
    settings.announcement_active !== 'true' ||
    !settings.announcement_text.trim()
  ) {
    return null
  }

  return (
    <div className="bg-accent-500 text-white px-4 py-2 flex items-center justify-between gap-4 text-sm font-medium">
      <div className="flex items-center gap-2 flex-1 justify-center">
        <Megaphone className="h-4 w-4 shrink-0" />
        <span>{settings.announcement_text}</span>
      </div>
      <button
        onClick={() => setDismissed(true)}
        className="p-1 hover:bg-white/20 rounded-full transition shrink-0"
        aria-label="Cerrar"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  )
}
