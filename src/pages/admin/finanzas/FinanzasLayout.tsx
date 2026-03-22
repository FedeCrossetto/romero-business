import type { ReactNode } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { BarChart2, ShoppingBag, Receipt, Package } from 'lucide-react'
import { AdminLayout } from '../AdminLayout'
import { cn } from '@/lib/utils'

const tabs = [
  { to: '/admin/finanzas', label: 'Dashboard', icon: BarChart2, exact: true },
  { to: '/admin/finanzas/ventas', label: 'Ventas', icon: ShoppingBag },
  { to: '/admin/finanzas/gastos', label: 'Gastos', icon: Receipt },
  { to: '/admin/finanzas/stock', label: 'Stock', icon: Package },
]

export function FinanzasLayout({ children }: { children: ReactNode }) {
  const location = useLocation()

  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Finanzas</h1>
        <p className="text-gray-500 text-sm mb-4">Control contable del negocio</p>
        <div className="flex gap-1 bg-gray-100 rounded-2xl p-1 w-fit overflow-x-auto">
          {tabs.map(({ to, label, icon: Icon, exact }) => {
            const active = exact ? location.pathname === to : location.pathname === to
            return (
              <Link
                key={to}
                to={to}
                className={cn(
                  'flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all whitespace-nowrap',
                  active
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700',
                )}
              >
                <Icon className="h-4 w-4" />
                {label}
              </Link>
            )
          })}
        </div>
      </div>
      {children}
    </AdminLayout>
  )
}
