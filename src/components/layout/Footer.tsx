import { MapPin } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 mt-20">
      <div className="max-w-6xl mx-auto px-4 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <img src="/logofull.png" alt="Romero & Co" className="h-12 object-contain" />

        <p className="text-sm text-center">
          Productos frescos directo del productor a tu mesa.
        </p>

        <div className="flex flex-col items-center md:items-end gap-1">
          <a
            href="https://maps.google.com/?q=14+de+Julio+2842,+Lanús+Oeste,+Buenos+Aires"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-sm text-gray-300 hover:text-white transition-colors"
          >
            <MapPin className="h-4 w-4 text-primary-400 shrink-0" />
            14 de Julio 2842, Lanús Oeste, Buenos Aires
          </a>
          <p className="text-xs">© {new Date().getFullYear()} Romero. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  )
}
