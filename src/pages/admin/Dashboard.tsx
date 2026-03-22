import { useEffect, useState } from 'react'
import { Package, AlertTriangle, ImageOff, Tag, TrendingDown, CheckCircle } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { AdminLayout } from './AdminLayout'
import { useCategories } from '@/hooks/useCategories'

interface Stats {
  total: number
  active: number
  outOfStock: number
  lowStock: number
  noImage: number
}

export function AdminDashboard() {
  const { categories } = useCategories()
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from('products')
        .select('id, is_active, stock, image_url')
      if (!data) return
      setStats({
        total: data.length,
        active: data.filter((p) => p.is_active).length,
        outOfStock: data.filter((p) => p.stock <= 0 && p.is_active).length,
        lowStock: data.filter((p) => p.stock > 0 && p.stock <= 5 && p.is_active).length,
        noImage: data.filter((p) => !p.image_url && p.is_active).length,
      })
      setLoading(false)
    }
    load()
  }, [])

  const cards = stats ? [
    {
      icon: Package,
      label: 'Productos activos',
      value: stats.active,
      sub: `${stats.total} en total`,
      color: 'text-primary-600 bg-primary-50',
    },
    {
      icon: Tag,
      label: 'Categorías',
      value: categories.length,
      sub: 'categorías configuradas',
      color: 'text-blue-600 bg-blue-50',
    },
    {
      icon: AlertTriangle,
      label: 'Sin stock',
      value: stats.outOfStock,
      sub: 'productos activos vacíos',
      color: stats.outOfStock > 0 ? 'text-red-600 bg-red-50' : 'text-gray-400 bg-gray-100',
    },
    {
      icon: TrendingDown,
      label: 'Stock bajo',
      value: stats.lowStock,
      sub: '5 unidades o menos',
      color: stats.lowStock > 0 ? 'text-orange-500 bg-orange-50' : 'text-gray-400 bg-gray-100',
    },
    {
      icon: ImageOff,
      label: 'Sin imagen',
      value: stats.noImage,
      sub: 'productos sin foto',
      color: stats.noImage > 0 ? 'text-yellow-600 bg-yellow-50' : 'text-gray-400 bg-gray-100',
    },
    {
      icon: CheckCircle,
      label: 'Con imagen',
      value: stats.active - stats.noImage,
      sub: 'productos con foto',
      color: 'text-primary-600 bg-primary-50',
    },
  ] : []

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">Resumen del estado de tu catálogo</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-white rounded-3xl p-6 shadow-card animate-pulse h-28" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {cards.map(({ icon: Icon, label, value, sub, color }) => (
            <div key={label} className="bg-white rounded-3xl p-6 shadow-card">
              <div className={`w-10 h-10 rounded-2xl flex items-center justify-center mb-3 ${color}`}>
                <Icon className="h-5 w-5" />
              </div>
              <p className="text-3xl font-extrabold text-gray-900">{value}</p>
              <p className="font-semibold text-gray-700 text-sm mt-0.5">{label}</p>
              <p className="text-xs text-gray-400 mt-0.5">{sub}</p>
            </div>
          ))}
        </div>
      )}

      {stats && stats.outOfStock > 0 && (
        <div className="mt-6 bg-red-50 border border-red-200 rounded-3xl px-5 py-4 flex items-center gap-3">
          <AlertTriangle className="h-5 w-5 text-red-500 shrink-0" />
          <p className="text-sm text-red-700">
            Tenés <strong>{stats.outOfStock} producto{stats.outOfStock !== 1 ? 's' : ''}</strong> activo{stats.outOfStock !== 1 ? 's' : ''} sin stock. Actualizalos o desactivalos para no confundir a los clientes.
          </p>
        </div>
      )}
    </AdminLayout>
  )
}
