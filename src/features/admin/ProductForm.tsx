import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { slugify } from '@/lib/utils'
import { Input, Textarea } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Button } from '@/components/ui/Button'
import { useCategories } from '@/hooks/useCategories'
import type { Product, UnitType } from '@/types'
import { X } from 'lucide-react'

interface ProductFormProps {
  product?: Product
  onSave: () => void
  onCancel: () => void
}

const UNIT_OPTIONS = [
  { value: 'kg', label: 'Kilogramo (kg)' },
  { value: 'unidad', label: 'Unidad' },
  { value: 'bolsa', label: 'Bolsa' },
  { value: 'atado', label: 'Atado' },
  { value: 'docena', label: 'Docena' },
]

export function ProductForm({ product, onSave, onCancel }: ProductFormProps) {
  const { categories } = useCategories()
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')

  const [form, setForm] = useState({
    name: product?.name ?? '',
    description: product?.description ?? '',
    price: product?.price?.toString() ?? '',
    discount_price: product?.discount_price?.toString() ?? '',
    promo_until: product?.promo_until ? product.promo_until.slice(0, 10) : '',
    unit_type: (product?.unit_type ?? 'kg') as UnitType,
    stock: product?.stock?.toString() ?? '0',
    image_url: product?.image_url ?? '',
    category_id: product?.category_id ?? '',
    is_featured: product?.is_featured ?? false,
    is_active: product?.is_active ?? true,
  })

  function set<K extends keyof typeof form>(key: K, value: typeof form[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    const ext = file.name.split('.').pop()
    const path = `${Date.now()}.${ext}`
    const { error: uploadError } = await supabase.storage
      .from('product-images')
      .upload(path, file, { upsert: true })
    if (uploadError) {
      setError('Error subiendo imagen: ' + uploadError.message)
      setUploading(false)
      return
    }
    const { data } = supabase.storage.from('product-images').getPublicUrl(path)
    set('image_url', data.publicUrl)
    setUploading(false)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const payload = {
      name: form.name,
      slug: slugify(form.name),
      description: form.description || null,
      price: parseFloat(form.price),
      discount_price: form.discount_price ? parseFloat(form.discount_price) : null,
      promo_until: form.promo_until || null,
      unit_type: form.unit_type,
      stock: parseFloat(form.stock),
      image_url: form.image_url || null,
      category_id: form.category_id || null,
      is_featured: form.is_featured,
      is_active: form.is_active,
    }

    const { error: saveError } = product
      ? await supabase.from('products').update(payload).eq('id', product.id)
      : await supabase.from('products').insert(payload)

    setLoading(false)
    if (saveError) { setError(saveError.message); return }
    onSave()
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="font-bold text-lg text-gray-900">
            {product ? 'Editar producto' : 'Nuevo producto'}
          </h2>
          <button onClick={onCancel} className="p-2 rounded-full hover:bg-gray-100 transition">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="bg-red-50 text-red-700 text-sm rounded-2xl px-4 py-3">{error}</div>
          )}

          <Input
            id="name"
            label="Nombre *"
            required
            value={form.name}
            onChange={(e) => set('name', e.target.value)}
            placeholder="Ej: Tomate perita"
          />

          <Textarea
            id="description"
            label="Descripción"
            value={form.description}
            onChange={(e) => set('description', e.target.value)}
            placeholder="Descripción breve del producto"
            rows={2}
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              id="price"
              label="Precio *"
              type="number"
              required
              min="0"
              step="0.01"
              value={form.price}
              onChange={(e) => set('price', e.target.value)}
              placeholder="1200"
            />
            <Input
              id="stock"
              label="Stock"
              type="number"
              min="0"
              step="0.5"
              value={form.stock}
              onChange={(e) => set('stock', e.target.value)}
            />
          </div>

          {/* Promo */}
          <div className="grid grid-cols-2 gap-4">
            <Input
              id="discount_price"
              label="Precio oferta"
              type="number"
              min="0"
              step="0.01"
              value={form.discount_price}
              onChange={(e) => set('discount_price', e.target.value)}
              placeholder="Dejar vacío si no hay oferta"
            />
            <div className="flex flex-col gap-1">
              <label htmlFor="promo_until" className="text-sm font-medium text-gray-700">
                Oferta válida hasta
              </label>
              <input
                id="promo_until"
                type="date"
                value={form.promo_until}
                onChange={(e) => set('promo_until', e.target.value)}
                className="rounded-2xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Select
              id="unit_type"
              label="Unidad"
              value={form.unit_type}
              onChange={(e) => set('unit_type', e.target.value as UnitType)}
              options={UNIT_OPTIONS}
            />
            <Select
              id="category_id"
              label="Categoría"
              value={form.category_id}
              onChange={(e) => set('category_id', e.target.value)}
              options={[
                { value: '', label: 'Sin categoría' },
                ...categories.map((c) => ({ value: c.id, label: c.name })),
              ]}
            />
          </div>

          {/* Image */}
          <div className="flex flex-col gap-3">
            <label className="text-sm font-medium text-gray-700">Imagen</label>

            {/* Preview */}
            {form.image_url && (
              <div className="relative w-28 h-28">
                <img src={form.image_url} alt="preview" className="w-28 h-28 object-cover rounded-2xl" />
                <button
                  type="button"
                  onClick={() => set('image_url', '')}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full text-xs flex items-center justify-center hover:bg-red-600"
                >
                  ✕
                </button>
              </div>
            )}

            {/* URL directa */}
            <div>
              <Input
                id="image_url"
                placeholder="Pegar URL de imagen (ej: https://...jpg)"
                value={form.image_url}
                onChange={(e) => set('image_url', e.target.value)}
              />
              <p className="text-xs text-gray-400 mt-1 ml-1">
                Click derecho en una imagen de internet → "Copiar dirección de imagen" y pegar acá
              </p>
            </div>

            {/* Separador */}
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <div className="flex-1 h-px bg-gray-200" />
              o subir desde el dispositivo
              <div className="flex-1 h-px bg-gray-200" />
            </div>

            {/* Upload */}
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="text-sm text-gray-600 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:bg-primary-50 file:text-primary-700 file:font-medium hover:file:bg-primary-100 cursor-pointer"
            />
            {uploading && <p className="text-xs text-gray-500">Subiendo imagen...</p>}
          </div>

          {/* Toggles */}
          <div className="flex gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.is_featured}
                onChange={(e) => set('is_featured', e.target.checked)}
                className="w-4 h-4 accent-primary-600"
              />
              <span className="text-sm text-gray-700">Destacado</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.is_active}
                onChange={(e) => set('is_active', e.target.checked)}
                className="w-4 h-4 accent-primary-600"
              />
              <span className="text-sm text-gray-700">Activo</span>
            </label>
          </div>

          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
              Cancelar
            </Button>
            <Button type="submit" loading={loading} className="flex-1">
              {product ? 'Guardar cambios' : 'Crear producto'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
