import { useState, useMemo } from 'react'
import { ProductCard } from '@/features/products/ProductCard'
import { ProductFilters, type SortOption } from '@/features/products/ProductFilters'
import { useProducts } from '@/hooks/useProducts'
import { PageSpinner } from '@/components/ui/Spinner'
import type { Product } from '@/types'

function sortProducts(products: Product[], sort: SortOption): Product[] {
  const copy = [...products]
  switch (sort) {
    case 'price_asc': return copy.sort((a, b) => a.price - b.price)
    case 'price_desc': return copy.sort((a, b) => b.price - a.price)
    case 'name': return copy.sort((a, b) => a.name.localeCompare(b.name))
    default: return copy
  }
}

export function Catalog() {
  const [search, setSearch] = useState('')
  const [categorySlug, setCategorySlug] = useState('')
  const [sort, setSort] = useState<SortOption>('default')

  const { products, loading } = useProducts({ search })

  const filtered = useMemo(() => {
    let list = products
    if (categorySlug) {
      list = list.filter((p) => p.categories?.slug === categorySlug)
    }
    return sortProducts(list, sort)
  }, [products, categorySlug, sort])

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Catálogo</h1>
        <p className="text-gray-500 mt-1">Todos nuestros productos frescos del día</p>
      </div>

      <div className="mb-8">
        <ProductFilters
          search={search}
          onSearchChange={setSearch}
          categorySlug={categorySlug}
          onCategoryChange={setCategorySlug}
          sort={sort}
          onSortChange={setSort}
        />
      </div>

      {loading ? (
        <PageSpinner />
      ) : filtered.length === 0 ? (
        <div className="text-center py-24">
          <p className="text-5xl mb-4">🔍</p>
          <p className="text-gray-500 font-medium">No encontramos productos con esos filtros.</p>
        </div>
      ) : (
        <>
          <p className="text-sm text-gray-400 mb-4">{filtered.length} producto{filtered.length !== 1 ? 's' : ''}</p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filtered.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
