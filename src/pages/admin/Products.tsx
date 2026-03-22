import { useState, useMemo } from 'react'
import { Plus, Edit2, Trash2, ToggleLeft, ToggleRight, Search, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react'
import { useAllProducts } from '@/hooks/useProducts'
import { useCategories } from '@/hooks/useCategories'
import { ProductForm } from '@/features/admin/ProductForm'
import { AdminLayout } from './AdminLayout'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { PageSpinner } from '@/components/ui/Spinner'
import { formatPrice } from '@/lib/utils'
import { supabase } from '@/lib/supabase'
import type { Product } from '@/types'

type SortField = 'name' | 'price' | 'stock' | 'category' | null
type SortDir = 'asc' | 'desc'
type StatusFilter = 'all' | 'active' | 'inactive' | 'no_stock'

function SortIcon({ field, current, dir }: { field: SortField; current: SortField; dir: SortDir }) {
  if (current !== field) return <ArrowUpDown className="h-3.5 w-3.5 opacity-30 ml-1" />
  return dir === 'asc'
    ? <ArrowUp className="h-3.5 w-3.5 ml-1 text-primary-600" />
    : <ArrowDown className="h-3.5 w-3.5 ml-1 text-primary-600" />
}

export function AdminProducts() {
  const { products, loading, refetch } = useAllProducts()
  const { categories } = useCategories()
  const [formProduct, setFormProduct] = useState<Product | null | 'new'>(null)
  const [deleting, setDeleting] = useState<string | null>(null)

  // Filters
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')

  // Sort
  const [sortField, setSortField] = useState<SortField>(null)
  const [sortDir, setSortDir] = useState<SortDir>('asc')

  function handleSort(field: SortField) {
    if (sortField === field) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortField(field)
      setSortDir('asc')
    }
  }

  const filtered = useMemo(() => {
    let list = [...products]

    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter((p) => p.name.toLowerCase().includes(q))
    }
    if (categoryFilter) {
      list = list.filter((p) => p.category_id === categoryFilter)
    }
    if (statusFilter === 'active') list = list.filter((p) => p.is_active)
    if (statusFilter === 'inactive') list = list.filter((p) => !p.is_active)
    if (statusFilter === 'no_stock') list = list.filter((p) => p.stock <= 0 && p.is_active)

    if (sortField) {
      list.sort((a, b) => {
        let va: any, vb: any
        if (sortField === 'price') { va = a.price; vb = b.price }
        else if (sortField === 'stock') { va = a.stock; vb = b.stock }
        else if (sortField === 'name') { va = a.name; vb = b.name }
        else if (sortField === 'category') { va = a.categories?.name ?? ''; vb = b.categories?.name ?? '' }
        if (va < vb) return sortDir === 'asc' ? -1 : 1
        if (va > vb) return sortDir === 'asc' ? 1 : -1
        return 0
      })
    }

    return list
  }, [products, search, categoryFilter, statusFilter, sortField, sortDir])

  async function toggleActive(product: Product) {
    await supabase.from('products').update({ is_active: !product.is_active }).eq('id', product.id)
    refetch()
  }

  async function handleDelete(product: Product) {
    if (!confirm(`¿Eliminar "${product.name}"? Esta acción no se puede deshacer.`)) return
    setDeleting(product.id)
    await supabase.from('products').delete().eq('id', product.id)
    setDeleting(null)
    refetch()
  }

  const thClass = 'px-4 py-3 text-left text-gray-500 text-xs font-semibold uppercase tracking-wide cursor-pointer select-none hover:text-gray-700 transition-colors'
  const thStaticClass = 'px-4 py-3 text-left text-gray-500 text-xs font-semibold uppercase tracking-wide'

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Productos</h1>
          <p className="text-gray-500 text-sm">
            {filtered.length} de {products.length} productos
          </p>
        </div>
        <Button onClick={() => setFormProduct('new')}>
          <Plus className="h-4 w-4" />
          Nuevo producto
        </Button>
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap gap-3 mb-4">
        {/* Search */}
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por nombre..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
          />
        </div>

        {/* Category filter */}
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="text-sm border border-gray-200 rounded-xl px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 cursor-pointer"
        >
          <option value="">Todas las categorías</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>

        {/* Status filter */}
        <div className="flex rounded-xl border border-gray-200 bg-white overflow-hidden">
          {([
            { value: 'all', label: 'Todos' },
            { value: 'active', label: 'Activos' },
            { value: 'inactive', label: 'Inactivos' },
            { value: 'no_stock', label: 'Sin stock' },
          ] as { value: StatusFilter; label: string }[]).map(({ value, label }) => (
            <button
              key={value}
              onClick={() => setStatusFilter(value)}
              className={`px-3 py-2 text-xs font-semibold transition-colors ${
                statusFilter === value
                  ? 'bg-primary-600 text-white'
                  : 'text-gray-500 hover:bg-gray-50'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <PageSpinner />
      ) : (
        <div className="bg-white rounded-2xl shadow-card overflow-hidden border border-gray-100">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th
                    className={thClass}
                    onClick={() => handleSort('name')}
                  >
                    <span className="flex items-center">
                      Producto <SortIcon field="name" current={sortField} dir={sortDir} />
                    </span>
                  </th>
                  <th
                    className={`${thClass} hidden md:table-cell`}
                    onClick={() => handleSort('category')}
                  >
                    <span className="flex items-center">
                      Categoría <SortIcon field="category" current={sortField} dir={sortDir} />
                    </span>
                  </th>
                  <th
                    className={thClass}
                    onClick={() => handleSort('price')}
                  >
                    <span className="flex items-center">
                      Precio <SortIcon field="price" current={sortField} dir={sortDir} />
                    </span>
                  </th>
                  <th
                    className={`${thClass} hidden sm:table-cell`}
                    onClick={() => handleSort('stock')}
                  >
                    <span className="flex items-center">
                      Stock <SortIcon field="stock" current={sortField} dir={sortDir} />
                    </span>
                  </th>
                  <th className={thStaticClass}>Estado</th>
                  <th className={`${thStaticClass} text-right`}>Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50/70 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gray-100 overflow-hidden shrink-0">
                          {product.image_url ? (
                            <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-base">🥦</div>
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 leading-tight">{product.name}</p>
                          <div className="flex gap-1 mt-0.5 flex-wrap">
                            {product.is_featured && <Badge variant="orange">Destacado</Badge>}
                            {product.discount_price && <Badge variant="blue">Oferta</Badge>}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell text-gray-500 text-sm">
                      {product.categories?.name
                        ? <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-lg text-xs font-medium">{product.categories.name}</span>
                        : <span className="text-gray-300">—</span>
                      }
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-semibold text-primary-700">{formatPrice(product.price)}</p>
                      {product.discount_price && (
                        <p className="text-xs text-orange-500 font-medium">Oferta: {formatPrice(product.discount_price)}</p>
                      )}
                      <p className="text-xs text-gray-400">/{product.unit_type}</p>
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <Badge variant={product.stock <= 0 ? 'red' : product.stock <= 5 ? 'orange' : 'green'}>
                        {product.stock} {product.unit_type}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => toggleActive(product)}
                        className="flex items-center gap-1.5 transition"
                        title={product.is_active ? 'Desactivar' : 'Activar'}
                      >
                        {product.is_active ? (
                          <ToggleRight className="h-6 w-6 text-primary-500" />
                        ) : (
                          <ToggleLeft className="h-6 w-6 text-gray-300" />
                        )}
                        <span className={`text-xs font-medium ${product.is_active ? 'text-primary-600' : 'text-gray-400'}`}>
                          {product.is_active ? 'Activo' : 'Inactivo'}
                        </span>
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setFormProduct(product)}
                          className="p-1.5 rounded-lg hover:bg-primary-50 text-gray-400 hover:text-primary-600 transition"
                          title="Editar"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(product)}
                          disabled={deleting === product.id}
                          className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-600 transition disabled:opacity-50"
                          title="Eliminar"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={6} className="text-center py-16 text-gray-400">
                      {products.length === 0 ? 'No hay productos. Creá el primero.' : 'Ningún producto coincide con los filtros.'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {formProduct !== null && (
        <ProductForm
          product={formProduct === 'new' ? undefined : formProduct}
          onSave={() => { setFormProduct(null); refetch() }}
          onCancel={() => setFormProduct(null)}
        />
      )}
    </AdminLayout>
  )
}
