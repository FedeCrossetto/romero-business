import { Link } from 'react-router-dom'
import { ArrowRight, Truck, Leaf, Clock, Star } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { ProductCard } from '@/features/products/ProductCard'
import { useProducts } from '@/hooks/useProducts'
import { useSettings } from '@/hooks/useSettings'
import { PageSpinner } from '@/components/ui/Spinner'

const benefits = [
  { icon: Leaf, title: 'Productos frescos', desc: 'Seleccionados diariamente del mercado.' },
  { icon: Truck, title: 'Envío a domicilio', desc: 'Llevamos tu pedido hasta tu puerta.' },
  { icon: Clock, title: 'Pedido rápido', desc: 'En minutos por WhatsApp, sin complicaciones.' },
  { icon: Star, title: 'Calidad garantizada', desc: 'Si no quedás conforme, lo resolvemos.' },
]

export function Home() {
  const { products, loading } = useProducts({ featured: true })
  const { settings } = useSettings()

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
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur rounded-full px-4 py-1.5 text-sm font-medium mb-6">
              <Leaf className="h-4 w-4" />
              Frescos todos los días
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-6">
              Verduras y frutas<br />
              <span className="text-accent-300">para tu mesa</span>
            </h1>
            <p className="text-lg text-primary-100 mb-8 max-w-lg">
              Pedí online y recibí en tu casa. Sin apps, sin complicaciones — solo mandás un WhatsApp y listo.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                size="lg"
                variant="secondary"
                className="text-base font-bold"
                onClick={() => document.getElementById('destacados')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Ver productos
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

        {/* Wave bottom */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 60L1440 60L1440 20C1080 60 360 0 0 40L0 60Z" fill="#f9fafb" />
          </svg>
        </div>
      </section>

      {/* Benefits */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {benefits.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="bg-white rounded-3xl p-5 shadow-card text-center flex flex-col items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-primary-50 flex items-center justify-center">
                <Icon className="h-6 w-6 text-primary-600" />
              </div>
              <div>
                <p className="font-semibold text-gray-900 text-sm">{title}</p>
                <p className="text-xs text-gray-500 mt-1">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured products */}
      <section id="destacados" className="max-w-6xl mx-auto px-4 pb-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Productos destacados</h2>
            <p className="text-gray-500 mt-1">Lo mejor de hoy, seleccionado para vos</p>
          </div>
          <Link to="/catalogo" className="text-primary-600 font-semibold text-sm flex items-center gap-1 hover:gap-2 transition-all">
            Ver todo <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {loading ? (
          <PageSpinner />
        ) : products.length === 0 ? (
          <p className="text-gray-400 text-center py-12">No hay productos disponibles.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.slice(0, 8).map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </section>

      {/* CTA Banner */}
      <section className="max-w-6xl mx-auto px-4 pb-20">
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
      </section>
    </>
  )
}
