import { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import {
  ArrowLeft, ShoppingCart, Star, AlertCircle, Share2,
  Plus, Minus, MessageCircle, CheckCircle, Heart, Flame,
} from 'lucide-react'
import { useProduct } from '@/hooks/useProducts'
import { useCartStore } from '@/store/cart'
import { useToast } from '@/components/ui/Toast'
import { useSettings } from '@/hooks/useSettings'
import { useFavorites } from '@/store/favorites'
import { useCountdown } from '@/hooks/useCountdown'
import { Lightbox } from '@/components/ui/Lightbox'
import { openWhatsApp } from '@/lib/whatsapp'
import { formatPrice } from '@/lib/utils'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { PageSpinner } from '@/components/ui/Spinner'

const LOW_STOCK_THRESHOLD = 5

function isPromoActive(discount_price: number | null, promo_until: string | null): boolean {
  if (!discount_price) return false
  if (!promo_until) return true
  return new Date(promo_until) > new Date()
}

export function ProductDetail() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const { product, loading, error } = useProduct(slug ?? '')
  const { addItem, openCart } = useCartStore()
  const { addToast } = useToast()
  const { settings } = useSettings()
  const { toggle: toggleFav, isFavorite } = useFavorites()
  const [qty, setQty] = useState(1)
  const [added, setAdded] = useState(false)

  if (loading) return <PageSpinner />

  if (error || !product) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <p className="text-5xl mb-4">🔍</p>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Producto no encontrado</h2>
        <p className="text-gray-500 mb-6">El producto que buscás no existe o fue removido.</p>
        <Button onClick={() => navigate('/catalogo')}>Ver catálogo</Button>
      </div>
    )
  }

  // product is guaranteed non-null here (early return above handles null/error)
  const p = product
  const outOfStock = p.stock <= 0
  const lowStock = !outOfStock && p.stock <= LOW_STOCK_THRESHOLD
  const promoActive = isPromoActive(p.discount_price, p.promo_until)
  const displayPrice = promoActive && p.discount_price ? p.discount_price : p.price
  const isFav = isFavorite(p.id)
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const countdown = useCountdown(promoActive && p.promo_until ? p.promo_until : null)
  const urgentPromo = countdown && countdown.total < 48 * 3600000

  function handleAdd() {
    for (let i = 0; i < qty; i++) addItem(p)
    addToast(`${p.name} agregado al carrito`, 'success')
    setAdded(true)
    openCart()
    setTimeout(() => setAdded(false), 2000)
  }

  function handleWaitlist() {
    const msg = `Hola! Me interesa el producto "${p.name}" que está sin stock. ¿Cuándo va a estar disponible?`
    openWhatsApp(settings.whatsapp_number, msg)
  }

  async function handleShare() {
    const url = window.location.href
    if (navigator.share) {
      try {
        await navigator.share({
          title: p.name,
          text: `Mirá este producto: ${p.name} — ${formatPrice(displayPrice)}`,
          url,
        })
      } catch {
        // user cancelled share
      }
    } else {
      await navigator.clipboard.writeText(url)
      addToast('Enlace copiado al portapapeles', 'info')
    }
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      {/* Back */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-8 transition"
      >
        <ArrowLeft className="h-4 w-4" />
        Volver al catálogo
      </button>

      <div className="grid md:grid-cols-2 gap-10 items-start">
        {/* Image */}
        <div className="relative aspect-square bg-gray-50 dark:bg-gray-800 rounded-3xl overflow-hidden">
          {p.image_url ? (
            <img src={p.image_url} alt={p.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-8xl select-none">🥦</div>
          )}
          {outOfStock && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <span className="bg-white text-gray-900 font-bold text-lg px-6 py-2 rounded-2xl">Sin stock</span>
            </div>
          )}
          <div className="absolute top-4 left-4 flex flex-col gap-1.5">
            {promoActive && <Badge variant="orange">Oferta</Badge>}
            {lowStock && <Badge variant="red">¡Últimas {Math.floor(p.stock)}!</Badge>}
          </div>
          {p.image_url && <Lightbox src={p.image_url} alt={p.name} />}
        </div>

        {/* Info */}
        <div className="space-y-6">
          {/* Category breadcrumb */}
          {p.categories && (
            <Link
              to={`/catalogo`}
              className="inline-flex items-center gap-1 text-sm text-primary-600 hover:text-primary-700 font-medium"
            >
              {p.categories.name}
            </Link>
          )}

          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 leading-tight">
              {p.name}
            </h1>
            {p.description && (
              <p className="text-gray-500 mt-3 text-base leading-relaxed">{p.description}</p>
            )}
          </div>

          {/* Price */}
          <div className="flex items-end gap-3">
            <p className="text-4xl font-extrabold text-primary-700 dark:text-primary-400">{formatPrice(displayPrice)}</p>
            {promoActive && p.discount_price && (
              <p className="text-xl text-gray-400 line-through pb-1">{formatPrice(p.price)}</p>
            )}
            <p className="text-gray-400 text-sm pb-1">/ {p.unit_type}</p>
          </div>

          {/* Countdown */}
          {countdown && promoActive && (
            <div className={`flex items-center gap-2 rounded-2xl px-4 py-2 text-sm font-semibold ${urgentPromo ? 'bg-red-50 text-red-600' : 'bg-orange-50 text-orange-600'}`}>
              <Flame className="h-4 w-4 shrink-0" />
              {urgentPromo ? '¡Última oportunidad! ' : 'Oferta termina en '}
              {countdown.days > 0 && `${countdown.days}d `}
              {countdown.hours}h {countdown.mins}m {countdown.secs}s
            </div>
          )}

          {promoActive && p.promo_until && !countdown && (
            <div className="flex items-center gap-2 text-sm text-orange-600 bg-orange-50 rounded-2xl px-4 py-2">
              <AlertCircle className="h-4 w-4 shrink-0" />
              Oferta válida hasta {new Date(p.promo_until).toLocaleDateString('es-AR')}
            </div>
          )}

          {p.is_featured && !outOfStock && (
            <div className="flex items-center gap-1.5 text-sm text-accent-600 font-medium">
              <Star className="h-4 w-4 fill-accent-500 text-accent-500" />
              Producto destacado
            </div>
          )}

          {/* Stock info */}
          {!outOfStock && (
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <CheckCircle className="h-4 w-4 text-primary-500" />
              Disponible — {p.stock} {p.unit_type} en stock
            </div>
          )}

          {/* Qty + Add */}
          {!outOfStock ? (
            <div className="space-y-3">
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-gray-200 rounded-2xl overflow-hidden">
                  <button
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    className="px-4 py-3 hover:bg-gray-50 transition-colors"
                  >
                    <Minus className="h-4 w-4 text-gray-600" />
                  </button>
                  <span className="px-4 text-lg font-bold text-gray-900 min-w-[3rem] text-center">
                    {qty}
                  </span>
                  <button
                    onClick={() => setQty((q) => q + 1)}
                    className="px-4 py-3 hover:bg-gray-50 transition-colors"
                  >
                    <Plus className="h-4 w-4 text-gray-600" />
                  </button>
                </div>
                <p className="text-sm text-gray-500">
                  Total: <strong className="text-gray-900">{formatPrice(displayPrice * qty)}</strong>
                </p>
              </div>

              <Button size="lg" className="w-full" onClick={handleAdd} disabled={added}>
                {added ? (
                  <>
                    <CheckCircle className="h-5 w-5" />
                    Agregado al carrito
                  </>
                ) : (
                  <>
                    <ShoppingCart className="h-5 w-5" />
                    Agregar al carrito
                  </>
                )}
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="bg-gray-50 border border-gray-200 rounded-2xl px-5 py-4">
                <p className="text-gray-500 text-sm font-medium flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-red-400 shrink-0" />
                  Este producto no tiene stock disponible en este momento
                </p>
              </div>
              <Button size="lg" variant="outline" className="w-full" onClick={handleWaitlist}>
                <MessageCircle className="h-5 w-5" />
                Avisarme cuando haya stock
              </Button>
            </div>
          )}

          {/* Actions row */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => toggleFav(p.id)}
              className={`flex items-center gap-1.5 text-sm font-medium transition-colors ${isFav ? 'text-red-500' : 'text-gray-400 hover:text-red-400'}`}
            >
              <Heart className={`h-4 w-4 ${isFav ? 'fill-red-500' : ''}`} />
              {isFav ? 'En favoritos' : 'Guardar favorito'}
            </button>
            <button
              onClick={handleShare}
              className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-600 transition-colors"
            >
              <Share2 className="h-4 w-4" />
              Compartir
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
