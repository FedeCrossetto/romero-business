import { useState } from 'react'
import { Plus, Edit2, Trash2, ToggleLeft, ToggleRight } from 'lucide-react'
import { useAllProducts } from '@/hooks/useProducts'
import { ProductForm } from '@/features/admin/ProductForm'
import { AdminLayout } from './AdminLayout'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { PageSpinner } from '@/components/ui/Spinner'
import { formatPrice } from '@/lib/utils'
import { supabase } from '@/lib/supabase'
import type { Product } from '@/types'

export function AdminProducts() {
  const { products, loading, refetch } = useAllProducts()
  const [formProduct, setFormProduct] = useState<Product | null | 'new'>(null)
  const [deleting, setDeleting] = useState<string | null>(null)

  async function toggleActive(product: Product) {
    await supabase
      .from('products')
      .update({ is_active: !product.is_active })
      .eq('id', product.id)
    refetch()
  }

  async function handleDelete(product: Product) {
    if (!confirm(`¿Eliminar "${product.name}"? Esta acción no se puede deshacer.`)) return
    setDeleting(product.id)
    await supabase.from('products').delete().eq('id', product.id)
    setDeleting(null)
    refetch()
  }

  return (
    <AdminLayout>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Productos</h1>
            <p className="text-gray-500 text-sm">{products.length} productos en total</p>
          </div>
          <Button onClick={() => setFormProduct('new')}>
            <Plus className="h-4 w-4" />
            Nuevo producto
          </Button>
        </div>

        {loading ? (
          <PageSpinner />
        ) : (
          <div className="bg-white rounded-3xl shadow-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 text-left text-gray-500 text-xs uppercase tracking-wide">
                    <th className="px-4 py-3">Producto</th>
                    <th className="px-4 py-3 hidden md:table-cell">Categoría</th>
                    <th className="px-4 py-3">Precio</th>
                    <th className="px-4 py-3 hidden sm:table-cell">Stock</th>
                    <th className="px-4 py-3">Estado</th>
                    <th className="px-4 py-3 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product.id} className="border-b border-gray-50 hover:bg-gray-50 transition">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-gray-100 overflow-hidden shrink-0">
                            {product.image_url ? (
                              <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-lg">🥦</div>
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{product.name}</p>
                            {product.is_featured && (
                              <Badge variant="orange" className="mt-0.5">Destacado</Badge>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell text-gray-500">
                        {product.categories?.name ?? '—'}
                      </td>
                      <td className="px-4 py-3 font-semibold text-primary-700">
                        {formatPrice(product.price)}<span className="text-gray-400 font-normal text-xs">/{product.unit_type}</span>
                      </td>
                      <td className="px-4 py-3 hidden sm:table-cell">
                        <Badge variant={product.stock > 0 ? 'green' : 'red'}>
                          {product.stock} {product.unit_type}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => toggleActive(product)}
                          className="flex items-center gap-1 transition"
                          title={product.is_active ? 'Desactivar' : 'Activar'}
                        >
                          {product.is_active ? (
                            <ToggleRight className="h-6 w-6 text-primary-500" />
                          ) : (
                            <ToggleLeft className="h-6 w-6 text-gray-300" />
                          )}
                          <span className={`text-xs ${product.is_active ? 'text-primary-600' : 'text-gray-400'}`}>
                            {product.is_active ? 'Activo' : 'Inactivo'}
                          </span>
                        </button>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-2">
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
                  {products.length === 0 && (
                    <tr>
                      <td colSpan={6} className="text-center py-12 text-gray-400">
                        No hay productos. Creá el primero.
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
