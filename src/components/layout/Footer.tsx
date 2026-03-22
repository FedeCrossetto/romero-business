import { MapPin } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 mt-20">
      <div className="max-w-6xl mx-auto px-4 py-10 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-2 text-white font-bold text-lg">
          <img src="/logo.png" alt="Romero & Co" className="h-10 w-10 object-contain" />
          Romero &amp; Co
        </div>

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
