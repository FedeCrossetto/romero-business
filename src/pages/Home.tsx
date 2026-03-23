import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowRight, Truck, Leaf, Clock, Star, Search } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { ProductCard } from '@/features/products/ProductCard'
import { AnimateOnScroll } from '@/components/ui/AnimateOnScroll'
import { useProducts } from '@/hooks/useProducts'
import { SkeletonGrid } from '@/components/ui/Skeleton'
const benefits = [
  { icon: Leaf, title: 'Productos frescos', desc: 'Seleccionados diariamente del mercado.' },
  { icon: Truck, title: 'Envío a domicilio', desc: 'Llevamos tu pedido hasta tu puerta.' },
  { icon: Clock, title: 'Pedido rápido', desc: 'En minutos por WhatsApp, sin complicaciones.' },
  { icon: Star, title: 'Calidad garantizada', desc: 'Si no quedás conforme, lo resolvemos.' },
]
const reviews = [
  {
    name: 'María González',
    rating: 5,
    text: 'Excelente calidad! Las verduras siempre frescas y el servicio es muy rápido. Los recomiendo a todos mis vecinos.',
    date: 'hace 2 semanas',
  },
  {
    name: 'Carlos Rodríguez',
    rating: 5,
    text: 'Muy buena atención y productos de primera. El delivery llega en tiempo y forma. Sin dudas mi verdulería de confianza.',
    date: 'hace 1 mes',
  },
  {
    name: 'Laura Martínez',
    rating: 5,
    text: 'Los mejores precios del barrio y la fruta siempre en su punto. El pedido por WhatsApp es comodísimo.',
    date: 'hace 3 semanas',
  },
]

export function Home() {
  const { products, loading } = useProducts({ featured: true })
  const navigate = useNavigate()
  const [heroSearch, setHeroSearch] = useState('')

  function handleHeroSearch(e: React.FormEvent) {
    e.preventDefault()
    navigate('/catalogo', { state: { search: heroSearch.trim() } })
  }

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-600 via-primary-500 to-primary-700 text-white">
        <div
          className="absolute inset-0 opacity-10"
          style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")" }}
        />
        <div className="max-w-6xl mx-auto px-4 py-20 md:py-28 relative">
          <div className="max-w-2xl">
            {/* Logo grande */}
            <div className="flex justify-center md:justify-start mb-8">
              <img
                src="/logo.png"
                alt="Romero & Co"
                className="h-28 w-28 md:h-36 md:w-36 object-contain drop-shadow-2xl"
              />
            </div>

            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur rounded-full px-4 py-1.5 text-sm font-medium mb-6">
              <Leaf className="h-4 w-4" />
              Frescos todos los días
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-6">
              Calidad de verdulería<br />
              <span className="text-accent-300">premium a precio de barrio</span>
            </h1>
            <p className="text-lg text-primary-100 mb-8 max-w-lg">
              Pedí online y recibí en tu casa. Sin apps, sin complicaciones — solo mandás un WhatsApp y listo.
            </p>

            {/* Hero search */}
            <form onSubmit={handleHeroSearch} className="flex gap-2 max-w-md mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/60" />
                <input
                  type="text"
                  value={heroSearch}
                  onChange={(e) => setHeroSearch(e.target.value)}
                  placeholder="¿Qué estás buscando?"
                  className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white/20 backdrop-blur border border-white/30 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 text-sm"
                />
              </div>
              <button
                type="submit"
                className="bg-white text-primary-700 font-semibold px-5 py-3 rounded-2xl hover:bg-primary-50 transition-colors text-sm shrink-0"
              >
                Buscar
              </button>
            </form>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                size="lg"
                variant="secondary"
                className="text-base font-bold"
                onClick={() => document.getElementById('destacados')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Ver destacados
                <ArrowRight className="h-5 w-5" />
              </Button>
              <Link to="/catalogo">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 w-full">
                  Ver catálogo completo
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 60L1440 60L1440 20C1080 60 360 0 0 40L0 60Z" fill="currentColor" className="text-gray-50 dark:text-gray-950" />
          </svg>
        </div>
      </section>

      {/* Featured products */}
      <section id="destacados" className="max-w-6xl mx-auto px-4 py-16">
        <AnimateOnScroll>
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100">Productos destacados</h2>
              <p className="text-gray-500 dark:text-gray-400 mt-1">Lo mejor de hoy, seleccionado para vos</p>
            </div>
            <Link to="/catalogo" className="text-primary-600 font-semibold text-sm flex items-center gap-1 hover:gap-2 transition-all">
              Ver todo <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </AnimateOnScroll>

        {loading ? (
          <SkeletonGrid count={4} />
        ) : products.length === 0 ? (
          <p className="text-gray-400 text-center py-12">No hay productos disponibles.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.slice(0, 8).map((p, i) => (
              <AnimateOnScroll key={p.id} delay={i * 60}>
                <ProductCard product={p} />
              </AnimateOnScroll>
            ))}
          </div>
        )}
      </section>

      {/* Benefits */}
      <section className="max-w-6xl mx-auto px-4 pb-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {benefits.map(({ icon: Icon, title, desc }, i) => (
            <AnimateOnScroll key={title} delay={i * 100}>
              <div className="bg-white dark:bg-gray-800 rounded-3xl p-5 shadow-card text-center flex flex-col items-center gap-3 h-full">
                <div className="w-12 h-12 rounded-2xl bg-primary-50 dark:bg-primary-900/30 flex items-center justify-center">
                  <Icon className="h-6 w-6 text-primary-600 dark:text-primary-400" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-gray-100 text-sm">{title}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{desc}</p>
                </div>
              </div>
            </AnimateOnScroll>
          ))}
        </div>
      </section>

      {/* Reseñas */}
      <section className="max-w-6xl mx-auto px-4 pb-16">
        <AnimateOnScroll>
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100">
                Lo que dicen nuestros clientes
              </h2>
              <div className="flex items-center gap-1.5 mt-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                ))}
                <span className="text-sm text-gray-500 dark:text-gray-400 ml-1">5.0 en Google</span>
              </div>
            </div>
            <a
              href="https://maps.google.com/?q=Romero+verduleria+14+de+Julio+2842+Lanus+Oeste"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-600 font-semibold text-sm flex items-center gap-1 hover:gap-2 transition-all shrink-0"
            >
              Ver en Google <ArrowRight className="h-4 w-4" />
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {reviews.map((r) => (
              <div key={r.name} className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-card flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/40 flex items-center justify-center text-primary-700 dark:text-primary-300 font-bold text-sm shrink-0">
                    {r.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-gray-100 text-sm">{r.name}</p>
                    <p className="text-xs text-gray-400">{r.date}</p>
                  </div>
                </div>
                <div className="flex gap-0.5">
                  {[...Array(r.rating)].map((_, i) => (
                    <Star key={i} className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{r.text}</p>
              </div>
            ))}
          </div>
        </AnimateOnScroll>
      </section>

      {/* CTA Banner */}
      <section className="max-w-6xl mx-auto px-4 pb-20">
        <AnimateOnScroll>
          <div className="bg-gradient-to-r from-accent-500 to-accent-600 rounded-3xl p-8 md:p-12 text-white flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-2xl font-bold mb-2">¿Querés hacer tu pedido ahora?</h3>
              <p className="text-accent-100">Revisá el catálogo completo y armá tu pedido en minutos.</p>
            </div>
            <Link to="/catalogo">
              <Button size="lg" className="bg-white text-accent-700 hover:bg-accent-50 shrink-0">
                Ir al catálogo
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
          </div>
        </AnimateOnScroll>
      </section>
    </>
  )
}
