import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { Category } from '@/types'

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  async function fetch() {
    const { data } = await supabase
      .from('categories')
      .select('*')
      .order('sort_order')
    setCategories((data as Category[]) ?? [])
    setLoading(false)
  }

  useEffect(() => { fetch() }, [])

  return { categories, loading, refetch: fetch }
}
