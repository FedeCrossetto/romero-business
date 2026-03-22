import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Heart } from 'lucide-react'
import { useFavorites } from '@/store/favorites'
import { supabase } from '@/lib/supabase'
import { ProductCard } from '@/features/products/ProductCard'
import { SkeletonGrid } from '@/components/ui/Skeleton'
import { Button } from '@/components/ui/Button'
import type { Product } from '@/types'

export function Favorites() {
  const navigate = useNavigate()
  const { ids } = useFavorites()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      setLoading(true)
      if (ids.length === 0) { setProducts([]); setLoading(false); return }
      const { data } = await supabase
        .from('products')
        .select('*, categories(id, name, slug, sort_order, created_at)')
        .in('id', ids)
        .eq('is_active', true)
      setProducts((data as Product[]) ?? [])
      setLoading(false)
    }
    load()
  }, [ids])

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 mb-8 transition"
      >
        <ArrowLeft className="h-4 w-4" />
        Volver
      </button>

      <div className="flex items-center gap-3 mb-8">
        <Heart className="h-6 w-6 fill-red-500 text-red-500" />
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Mis favoritos</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">{ids.length} producto{ids.length !== 1 ? 's' : ''} guardado{ids.length !== 1 ? 's' : ''}</p>
        </div>
      </div>

      {loading ? (
        <SkeletonGrid count={4} />
      ) : products.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">🤍</div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">Sin favoritos aún</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-6">Tocá el corazón en cualquier producto para guardarlo acá.</p>
          <Button onClick={() => navigate('/catalogo')}>Ver catálogo</Button>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  )
}
