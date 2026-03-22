import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { Product } from '@/types'

interface UseProductsOptions {
  categorySlug?: string
  featured?: boolean
  search?: string
  active?: boolean
}

export function useProducts(options: UseProductsOptions = {}) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function fetch() {
      setLoading(true)
      setError(null)

      let query = supabase
        .from('products')
        .select('*, categories(id, name, slug, sort_order, created_at)')
        .order('created_at', { ascending: false })

      if (options.active !== false) {
        query = query.eq('is_active', true)
      }
      if (options.featured) {
        query = query.eq('is_featured', true)
      }
      if (options.categorySlug) {
        query = query.eq('categories.slug', options.categorySlug)
      }
      if (options.search) {
        query = query.ilike('name', `%${options.search}%`)
      }

      const { data, error: err } = await query

      if (cancelled) return

      if (err) {
        setError(err.message)
      } else {
        // Filter by categorySlug client-side when joining
        let filtered = (data as Product[]) ?? []
        if (options.categorySlug) {
          filtered = filtered.filter(
            (p) => p.categories?.slug === options.categorySlug,
          )
        }
        setProducts(filtered)
      }
      setLoading(false)
    }

    fetch()
    return () => { cancelled = true }
  }, [options.categorySlug, options.featured, options.search, options.active])

  return { products, loading, error, refetch: () => {} }
}

export function useProduct(slug: string) {
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!slug) return
    let cancelled = false
    async function fetch() {
      setLoading(true)
      const { data, error: err } = await supabase
        .from('products')
        .select('*, categories(id, name, slug, sort_order, created_at)')
        .eq('slug', slug)
        .eq('is_active', true)
        .single()
      if (cancelled) return
      if (err) { setError(err.message) }
      else { setProduct(data as Product) }
      setLoading(false)
    }
    fetch()
    return () => { cancelled = true }
  }, [slug])

  return { product, loading, error }
}

export function useAllProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  async function fetch() {
    setLoading(true)
    const { data, error: err } = await supabase
      .from('products')
      .select('*, categories(id, name, slug, sort_order, created_at)')
      .order('created_at', { ascending: false })
    setLoading(false)
    if (err) { setError(err.message); return }
    setProducts((data as Product[]) ?? [])
  }

  useEffect(() => { fetch() }, [])

  return { products, loading, error, refetch: fetch }
}
