import { X, ZoomIn } from 'lucide-react'
import { useState } from 'react'

interface LightboxProps {
  src: string
  alt: string
}

export function Lightbox({ src, alt }: LightboxProps) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="absolute bottom-3 right-3 p-2 bg-white/80 backdrop-blur rounded-xl hover:bg-white transition shadow-sm"
        title="Ver imagen completa"
      >
        <ZoomIn className="h-4 w-4 text-gray-600" />
      </button>

      {open && (
        <div
          className="fixed inset-0 bg-black/90 z-[200] flex items-center justify-center p-4"
          onClick={() => setOpen(false)}
        >
          <button
            className="absolute top-4 right-4 p-2.5 bg-white/20 hover:bg-white/40 rounded-full transition"
            onClick={() => setOpen(false)}
          >
            <X className="h-6 w-6 text-white" />
          </button>
          <img
            src={src}
            alt={alt}
            className="max-w-full max-h-[90vh] object-contain rounded-2xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  )
}
