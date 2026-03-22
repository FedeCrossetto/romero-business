import { Link, useLocation } from 'react-router-dom'
import { ShoppingCart, Menu, X, Instagram } from 'lucide-react'
import { useState } from 'react'
import { useCartStore } from '@/store/cart'
import { cn } from '@/lib/utils'

const navLinks = [
  { to: '/', label: 'Inicio' },
  { to: '/catalogo', label: 'Catálogo' },
  { to: '/mayoristas', label: 'Mayoristas' },
]

export function Header() {
  const { items, openCart } = useCartStore()
  const itemCount = items.reduce((acc, i) => acc + i.quantity, 0)
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-gray-100 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 h-20 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <img src="/logo.png" alt="Romero & Co" className="h-16 w-16 object-contain" />
          <span className="ml-2 font-extrabold text-lg text-primary-700 hidden sm:inline leading-tight">
            Romero<span className="text-accent-500">&</span>Co
          </span>
        </Link>

        {/* Nav desktop */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={cn(
                'text-sm font-medium transition-colors',
                location.pathname === link.to
                  ? 'text-primary-600'
                  : 'text-gray-600 hover:text-primary-600',
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {/* Instagram */}
          <a
            href="https://www.instagram.com/romeroverduleria"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2.5 rounded-2xl hover:bg-pink-50 transition-colors group"
            aria-label="Instagram"
          >
            <Instagram className="h-5 w-5 text-gray-400 group-hover:text-pink-500 transition-colors" />
          </a>

          {/* Cart button */}
          <button
            onClick={openCart}
            className="relative p-2.5 rounded-2xl bg-primary-50 hover:bg-primary-100 transition-colors"
            aria-label="Ver carrito"
          >
            <ShoppingCart className="h-5 w-5 text-primary-700" />
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-accent-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                {itemCount > 9 ? '9+' : itemCount}
              </span>
            )}
          </button>

          {/* Mobile menu toggle */}
          <button
            className="md:hidden p-2 rounded-2xl hover:bg-gray-100 transition"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menu"
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile nav */}
      {menuOpen && (
        <div className="md:hidden border-t border-gray-100 px-4 py-3 flex flex-col gap-3 bg-white">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="text-sm font-medium text-gray-700 hover:text-primary-600"
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  )
}
