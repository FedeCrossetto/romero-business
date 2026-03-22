import { useState } from 'react'
import { Search, SlidersHorizontal, Mic, MicOff } from 'lucide-react'
import { useCategories } from '@/hooks/useCategories'
import { cn } from '@/lib/utils'

export type SortOption = 'default' | 'price_asc' | 'price_desc' | 'name'

interface ProductFiltersProps {
  search: string
  onSearchChange: (v: string) => void
  categorySlug: string
  onCategoryChange: (slug: string) => void
  sort: SortOption
  onSortChange: (s: SortOption) => void
}

export function ProductFilters({
  search,
  onSearchChange,
  categorySlug,
  onCategoryChange,
  sort,
  onSortChange,
}: ProductFiltersProps) {
  const { categories } = useCategories()
  const [listening, setListening] = useState(false)

  function startVoiceSearch() {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    if (!SR) {
      alert('Tu navegador no soporta búsqueda por voz. Probá con Chrome en Android.')
      return
    }
    const recognition = new SR()
    recognition.lang = 'es-AR'
    recognition.interimResults = false
    recognition.maxAlternatives = 1
    setListening(true)
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript
      onSearchChange(transcript)
      setListening(false)
    }
    recognition.onerror = () => setListening(false)
    recognition.onend = () => setListening(false)
    recognition.start()
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          type="search"
          placeholder="Buscar productos..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-11 pr-12 py-2.5 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition"
        />
        <button
          type="button"
          onClick={startVoiceSearch}
          title="Buscar por voz"
          className={cn(
            'absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-xl transition-colors',
            listening
              ? 'bg-red-100 text-red-500 animate-pulse'
              : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 hover:text-gray-600',
          )}
        >
          {listening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
        </button>
      </div>

      {/* Category pills + sort */}
      <div className="flex gap-3 flex-wrap items-center justify-between">
        <div className="flex gap-2 flex-wrap">
          <CategoryPill active={categorySlug === ''} onClick={() => onCategoryChange('')}>
            Todos
          </CategoryPill>
          {categories.map((cat) => (
            <CategoryPill
              key={cat.id}
              active={categorySlug === cat.slug}
              onClick={() => onCategoryChange(cat.slug)}
            >
              {cat.name}
            </CategoryPill>
          ))}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <SlidersHorizontal className="h-4 w-4 text-gray-400" />
          <select
            value={sort}
            onChange={(e) => onSortChange(e.target.value as SortOption)}
            className="text-sm border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-1.5 bg-white dark:bg-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500 cursor-pointer"
          >
            <option value="default">Ordenar: relevancia</option>
            <option value="price_asc">Precio: menor a mayor</option>
            <option value="price_desc">Precio: mayor a menor</option>
            <option value="name">Nombre A-Z</option>
          </select>
        </div>
      </div>
    </div>
  )
}

function CategoryPill({
  active, onClick, children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'px-4 py-1.5 rounded-md text-sm font-medium transition-all',
        active
          ? 'bg-primary-600 text-white shadow-sm'
          : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-primary-300 hover:text-primary-600',
      )}
    >
      {children}
    </button>
  )
}
