import { useState } from 'react'
import { Plus, Edit2, Trash2, GripVertical } from 'lucide-react'
import { useCategories } from '@/hooks/useCategories'
import { AdminLayout } from './AdminLayout'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { PageSpinner } from '@/components/ui/Spinner'
import { supabase } from '@/lib/supabase'
import { slugify } from '@/lib/utils'
import { X } from 'lucide-react'
import type { Category } from '@/types'

interface CategoryFormProps {
  category?: Category
  onSave: () => void
  onCancel: () => void
  nextSortOrder: number
}

function CategoryForm({ category, onSave, onCancel, nextSortOrder }: CategoryFormProps) {
  const [name, setName] = useState(category?.name ?? '')
  const [sortOrder, setSortOrder] = useState(category?.sort_order?.toString() ?? nextSortOrder.toString())
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) { setError('El nombre es requerido'); return }
    setLoading(true)
    setError('')
    const payload = {
      name: name.trim(),
      slug: slugify(name.trim()),
      sort_order: parseInt(sortOrder) || 0,
    }
    const { error: saveError } = category
      ? await supabase.from('categories').update(payload).eq('id', category.id)
      : await supabase.from('categories').insert(payload)
    setLoading(false)
    if (saveError) { setError(saveError.message); return }
    onSave()
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm">
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h2 className="font-bold text-gray-900">{category ? 'Editar categoría' : 'Nueva categoría'}</h2>
          <button onClick={onCancel} className="p-2 rounded-full hover:bg-gray-100 transition">
            <X className="h-5 w-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {error && (
            <div className="bg-red-50 text-red-700 text-sm rounded-2xl px-4 py-3">{error}</div>
          )}
          <Input
            id="cat-name"
            label="Nombre *"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ej: Frutas"
          />
          <Input
            id="cat-sort"
            label="Orden"
            type="number"
            min="0"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
          />
          <div className="flex gap-3">
            <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
              Cancelar
            </Button>
            <Button type="submit" loading={loading} className="flex-1">
              {category ? 'Guardar' : 'Crear'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export function AdminCategories() {
  const { categories, loading, refetch } = useCategories()
  const [formCategory, setFormCategory] = useState<Category | null | 'new'>(null)
  const [deleting, setDeleting] = useState<string | null>(null)

  async function handleDelete(cat: Category) {
    if (!confirm(`¿Eliminar la categoría "${cat.name}"? Los productos asociados quedarán sin categoría.`)) return
    setDeleting(cat.id)
    await supabase.from('categories').delete().eq('id', cat.id)
    setDeleting(null)
    refetch()
  }

  const nextSortOrder = categories.length > 0
    ? Math.max(...categories.map((c) => c.sort_order)) + 1
    : 0

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Categorías</h1>
          <p className="text-gray-500 text-sm">{categories.length} categorías</p>
        </div>
        <Button onClick={() => setFormCategory('new')}>
          <Plus className="h-4 w-4" />
          Nueva categoría
        </Button>
      </div>

      {loading ? (
        <PageSpinner />
      ) : (
        <div className="bg-white rounded-3xl shadow-card overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-left text-gray-500 text-xs uppercase tracking-wide">
                <th className="px-4 py-3 w-8"></th>
                <th className="px-4 py-3">Nombre</th>
                <th className="px-4 py-3">Slug</th>
                <th className="px-4 py-3">Orden</th>
                <th className="px-4 py-3 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((cat) => (
                <tr key={cat.id} className="border-b border-gray-50 hover:bg-gray-50 transition">
                  <td className="px-4 py-3 text-gray-300">
                    <GripVertical className="h-4 w-4" />
                  </td>
                  <td className="px-4 py-3 font-medium text-gray-900">{cat.name}</td>
                  <td className="px-4 py-3 text-gray-400 font-mono text-xs">{cat.slug}</td>
                  <td className="px-4 py-3 text-gray-500">{cat.sort_order}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setFormCategory(cat)}
                        className="p-1.5 rounded-lg hover:bg-primary-50 text-gray-400 hover:text-primary-600 transition"
                        title="Editar"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(cat)}
                        disabled={deleting === cat.id}
                        className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-600 transition disabled:opacity-50"
                        title="Eliminar"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {categories.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-gray-400">
                    No hay categorías. Creá la primera.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {formCategory !== null && (
        <CategoryForm
          category={formCategory === 'new' ? undefined : formCategory}
          nextSortOrder={nextSortOrder}
          onSave={() => { setFormCategory(null); refetch() }}
          onCancel={() => setFormCategory(null)}
        />
      )}
    </AdminLayout>
  )
}
