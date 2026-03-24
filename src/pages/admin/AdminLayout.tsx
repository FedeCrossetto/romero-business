import type { ReactNode } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { LogOut, Package, Settings, Tag, LayoutDashboard, ChevronRight, BarChart2 } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { cn } from '@/lib/utils'

const navItems = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { to: '/admin/products', label: 'Productos', icon: Package },
  { to: '/admin/categories', label: 'Categorías', icon: Tag },
  { to: '/admin/finanzas', label: 'Finanzas', icon: BarChart2 },
  { to: '/admin/settings', label: 'Configuración', icon: Settings },
]

export function AdminLayout({ children }: { children: ReactNode }) {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  async function handleSignOut() {
    await signOut()
    navigate('/admin/login')
  }

  const initials = user?.email?.slice(0, 2).toUpperCase() ?? 'AD'

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-gray-900 sticky top-0 z-30 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between gap-4">

          {/* Brand */}
          <div className="flex items-center gap-5 min-w-0">
            <Link to="/admin" className="flex items-center gap-2.5 shrink-0">
              <img src="/logofull.png" alt="Romero & Co" className="h-12 object-contain" />
              <span className="text-[10px] font-semibold bg-primary-500/30 text-primary-300 border border-primary-500/40 px-1.5 py-0.5 rounded-full uppercase tracking-widest hidden sm:inline">
                Admin
              </span>
            </Link>

            {/* Separator */}
            <ChevronRight className="h-4 w-4 text-gray-600 hidden sm:block shrink-0" />

            {/* Nav */}
            <nav className="flex items-center gap-0.5 overflow-x-auto scrollbar-hide">
              {navItems.map(({ to, label, icon: Icon, exact }) => {
                const active = exact ? location.pathname === to : location.pathname.startsWith(to)
                return (
                  <Link
                    key={to}
                    to={to}
                    className={cn(
                      'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all duration-150',
                      active
                        ? 'bg-white/10 text-white'
                        : 'text-gray-400 hover:text-gray-200 hover:bg-white/5',
                    )}
                  >
                    <Icon className={cn('h-3.5 w-3.5 shrink-0', active && 'text-primary-400')} />
                    <span className="hidden sm:inline">{label}</span>
                  </Link>
                )
              })}
            </nav>
          </div>

          {/* Right */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Ver tienda */}
            <Link
              to="/"
              target="_blank"
              className="hidden md:flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-200 transition-colors px-2 py-1.5 rounded-lg hover:bg-white/5"
            >
              Ver tienda
            </Link>

            {/* Avatar + logout */}
            <div className="flex items-center gap-2 bg-white/5 rounded-xl px-2 py-1.5">
              <div className="w-6 h-6 rounded-full bg-primary-600 flex items-center justify-center text-[10px] font-bold text-white shrink-0">
                {initials}
              </div>
              <button
                onClick={handleSignOut}
                className="flex items-center gap-1 text-xs text-gray-400 hover:text-white transition-colors"
                title="Cerrar sesión"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Salir</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">{children}</div>
    </div>
  )
}
