import { Link, useLocation } from 'react-router-dom'
import { ShoppingCart, Menu, X, Instagram, Heart, Moon, Sun } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useCartStore } from '@/store/cart'
import { useSettings } from '@/hooks/useSettings'
import { useFavorites } from '@/store/favorites'
import { useDarkMode } from '@/hooks/useDarkMode'
import { cn } from '@/lib/utils'

const navLinks = [
  { to: '/', label: 'Inicio' },
  { to: '/catalogo', label: 'Catálogo' },
  { to: '/mayoristas', label: 'Mayoristas' },
]

const DAY_MAP: Record<string, number> = {
  Dom: 0, Lun: 1, Mar: 2, 'Mié': 3, Jue: 4, Vie: 5, 'Sáb': 6,
}

function parseOpen(hoursStr: string): boolean {
  const now = new Date()
  const currentDay = now.getDay()
  const nowMins = now.getHours() * 60 + now.getMinutes()
  const toMins = (h: string, m: string) => parseInt(h) * 60 + parseInt(m)

  function inDayRange(startDayStr: string, endDayStr: string) {
    const s = DAY_MAP[startDayStr] ?? 1
    const e = DAY_MAP[endDayStr] ?? 6
    return s <= e ? currentDay >= s && currentDay <= e : currentDay >= s || currentDay <= e
  }

  // Two-interval: "Lun-Sáb 9:00 a 13:00 y 16:00 a 20:00"
  const two = hoursStr.match(/(\S+)-(\S+)\s+(\d+):(\d+)\s+a\s+(\d+):(\d+)\s+y\s+(\d+):(\d+)\s+a\s+(\d+):(\d+)/)
  if (two) {
    const [, sd, ed, sh1, sm1, eh1, em1, sh2, sm2, eh2, em2] = two
    if (!inDayRange(sd, ed)) return false
    return (nowMins >= toMins(sh1, sm1) && nowMins < toMins(eh1, em1)) ||
           (nowMins >= toMins(sh2, sm2) && nowMins < toMins(eh2, em2))
  }

  // Single interval: "Lun-Sáb 8:00 a 20:00"
  const one = hoursStr.match(/(\S+)-(\S+)\s+(\d+):(\d+)\s+a\s+(\d+):(\d+)/)
  if (!one) return true
  const [, sd, ed, sh, sm, eh, em] = one
  if (!inDayRange(sd, ed)) return false
  return nowMins >= toMins(sh, sm) && nowMins < toMins(eh, em)
}

export function Header() {
  const { items, openCart } = useCartStore()
  const { settings } = useSettings()
  const { ids: favoriteIds } = useFavorites()
  const { dark, toggle: toggleDark } = useDarkMode()
  const itemCount = items.reduce((acc, i) => acc + i.quantity, 0)
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    function update() { setIsOpen(parseOpen(settings.business_hours)) }
    update()
    const timer = setInterval(update, 60_000)
    return () => clearInterval(timer)
  }, [settings.business_hours])

  useEffect(() => {
    function onScroll() { setScrolled(window.scrollY > 10) }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className={cn(
      'sticky top-0 z-40 transition-all duration-300',
      scrolled
        ? 'bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl shadow-md border-b border-gray-100/80 dark:border-gray-800/80'
        : 'bg-white dark:bg-gray-900 border-b border-transparent',
    )}>
      <div className="max-w-6xl mx-auto px-4 h-20 flex items-center justify-between gap-3">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <img src="/logofull.png" alt="Romero & Co" className="h-16 object-contain" />
          <span className={cn(
            'text-[10px] font-bold px-1.5 py-0.5 rounded-full tracking-wide',
            isOpen
              ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400'
              : 'bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-400',
          )}>
            {isOpen ? '● Abierto' : '● Cerrado'}
          </span>
        </Link>

        {/* Nav — desktop */}
        <nav className="hidden md:flex items-center bg-gray-100 dark:bg-gray-800 rounded-2xl p-1 gap-0.5">
          {navLinks.map((link) => {
            const active = location.pathname === link.to
            return (
              <Link
                key={link.to}
                to={link.to}
                className={cn(
                  'px-4 py-1.5 rounded-xl text-sm font-semibold transition-all duration-200',
                  active
                    ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200',
                )}
              >
                {link.label}
              </Link>
            )
          })}
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-1">
          {/* Open/closed — mobile */}
          <span className={cn(
            'sm:hidden text-[10px] font-bold px-2 py-0.5 rounded-full mr-1',
            isOpen ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-600',
          )}>
            {isOpen ? '●' : '●'}
          </span>

          {/* Dark mode */}
          <button
            onClick={toggleDark}
            className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Cambiar tema"
          >
            {dark
              ? <Sun className="h-[18px] w-[18px] text-yellow-400" />
              : <Moon className="h-[18px] w-[18px] text-gray-400" />}
          </button>

          {/* Favorites */}
          <Link
            to="/favoritos"
            className="relative p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Mis favoritos"
          >
            <Heart className={cn(
              'h-[18px] w-[18px] transition-colors',
              favoriteIds.length > 0 ? 'fill-red-500 text-red-500' : 'text-gray-400',
            )} />
            {favoriteIds.length > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[9px] font-bold rounded-full h-3.5 w-3.5 flex items-center justify-center">
                {favoriteIds.length > 9 ? '9+' : favoriteIds.length}
              </span>
            )}
          </Link>

          {/* Instagram */}
          <a
            href="https://www.instagram.com/romeroverduleria"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-xl hover:bg-pink-50 dark:hover:bg-pink-900/20 transition-colors group hidden sm:block"
            aria-label="Instagram"
          >
            <Instagram className="h-[18px] w-[18px] text-gray-400 group-hover:text-pink-500 transition-colors" />
          </a>

          {/* Cart */}
          <button
            onClick={openCart}
            className={cn(
              'relative flex items-center gap-1.5 px-3 py-2 rounded-xl font-semibold text-sm transition-all duration-200',
              itemCount > 0
                ? 'bg-primary-600 hover:bg-primary-700 text-white shadow-md shadow-primary-200 dark:shadow-primary-900/40'
                : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300',
            )}
            aria-label="Ver carrito"
          >
            <ShoppingCart className="h-4 w-4" />
            {itemCount > 0 && (
              <span className="text-xs font-bold">{itemCount > 9 ? '9+' : itemCount}</span>
            )}
          </button>

          {/* Mobile menu */}
          <button
            className="md:hidden p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition ml-0.5"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menu"
          >
            {menuOpen
              ? <X className="h-5 w-5 text-gray-600 dark:text-gray-300" />
              : <Menu className="h-5 w-5 text-gray-600 dark:text-gray-300" />}
          </button>
        </div>
      </div>

      {/* Mobile nav */}
      {menuOpen && (
        <div className="md:hidden border-t border-gray-100 dark:border-gray-800 px-4 py-3 flex flex-col gap-1 bg-white dark:bg-gray-900">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setMenuOpen(false)}
              className={cn(
                'px-3 py-2.5 rounded-xl text-sm font-medium transition-colors',
                location.pathname === link.to
                  ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800',
              )}
            >
              {link.label}
            </Link>
          ))}
          <Link
            to="/favoritos"
            className="px-3 py-2.5 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors flex items-center gap-2"
            onClick={() => setMenuOpen(false)}
          >
            <Heart className="h-4 w-4 text-red-400" />
            Mis favoritos {favoriteIds.length > 0 && `(${favoriteIds.length})`}
          </Link>
          <Link
            to="/mis-pedidos"
            className="px-3 py-2.5 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            onClick={() => setMenuOpen(false)}
          >
            Mis pedidos
          </Link>
          <a
            href="https://www.instagram.com/romeroverduleria"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-2.5 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors flex items-center gap-2"
          >
            <Instagram className="h-4 w-4 text-pink-500" />
            Instagram
          </a>
        </div>
      )}
    </header>
  )
}
