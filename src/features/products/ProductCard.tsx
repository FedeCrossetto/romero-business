import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ShoppingCart, Star, Plus, Minus, MessageCircle, Heart, Flame } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { useCartStore } from '@/store/cart'
import { useToast } from '@/components/ui/Toast'
import { useSettings } from '@/hooks/useSettings'
import { useFavorites } from '@/store/favorites'
import { useCountdown } from '@/hooks/useCountdown'
import { openWhatsApp } from '@/lib/whatsapp'
import { formatPrice, formatQty } from '@/lib/utils'
import type { Product } from '@/types'

const LOW_STOCK_THRESHOLD = 5
const NEW_DAYS = 7
const KG_CHIPS = [0.25, 0.5, 1, 2]

function isPromoActive(product: Product): boolean {
  if (!product.discount_price) return false
  if (!product.promo_until) return true
  return new Date(product.promo_until) > new Date()
}

function isNew(createdAt: string): boolean {
  return Date.now() - new Date(createdAt).getTime() < NEW_DAYS * 86400000
}

function formatCountdown(days: number, hours: number, mins: number, secs: number): string {
  if (days > 0) return `${days}d ${hours}h`
  if (hours > 0) return `${hours}h ${mins}m`
  return `${mins}m ${secs}s`
}

export function ProductCard({ product }: { product: Product }) {
  const { addItem, openCart } = useCartStore()
  const { addToast } = useToast()
  const { settings } = useSettings()
  const { toggle: toggleFav, isFavorite } = useFavorites()
  const isKg = product.unit_type === 'kg'
  const customChips = product.quantity_options
    ? product.quantity_options.split(',').map(Number).filter((n) => !isNaN(n) && n > 0)
    : null
  const chips = customChips ?? (isKg ? KG_CHIPS : null)

  const cardRef = useRef<HTMLElement>(null)
  const [qty, setQty] = useState(() => (chips ? chips[0] : 1))
  const [transform, setTransform] = useState('')
  const [shadow, setShadow] = useState('0 4px 20px rgba(0,0,0,0.08)')
  const [shine, setShine] = useState({ x: '50%', y: '50%', opacity: 0 })

  const step = isKg ? 0.25 : 1
  const minQty = isKg ? 0.25 : 1
  const outOfStock = product.stock <= 0
  const lowStock = !outOfStock && product.stock <= LOW_STOCK_THRESHOLD
  const promoActive = isPromoActive(product)
  const productIsNew = isNew(product.created_at)
  const isFav = isFavorite(product.id)
  const displayPrice = promoActive && product.discount_price ? product.discount_price : product.price

  const countdown = useCountdown(promoActive && product.promo_until ? product.promo_until : null)
  const urgentPromo = countdown && countdown.total < 48 * 3600000

  function handleAdd() {
    addItem(product, qty)
    addToast(`${product.name} agregado al carrito`, 'success')
    openCart()
    setQty(chips ? chips[0] : (isKg ? 0.5 : 1))
  }

  function handleWaitlist() {
    const msg = `Hola! Me interesa el producto "${product.name}" que está sin stock. ¿Cuándo va a estar disponible?`
    openWhatsApp(settings.whatsapp_number, msg)
  }

  function handleMouseMove(e: React.MouseEvent<HTMLElement>) {
    const card = cardRef.current
    if (!card) return
    const rect = card.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const cx = rect.width / 2
    const cy = rect.height / 2
    const rotX = ((y - cy) / cy) * -9
    const rotY = ((x - cx) / cx) * 9
    setTransform(`perspective(900px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale3d(1.03,1.03,1.03)`)
    setShadow(`${-rotY * 1.5}px ${rotX * 1.5}px 40px rgba(0,0,0,0.18), 0 8px 24px rgba(0,0,0,0.10)`)
    setShine({ x: `${(x / rect.width) * 100}%`, y: `${(y / rect.height) * 100}%`, opacity: 0.12 })
  }

  function handleMouseLeave() {
    setTransform('perspective(900px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)')
    setShadow('0 4px 20px rgba(0,0,0,0.08)')
    setShine((s) => ({ ...s, opacity: 0 }))
  }

  return (
    <article
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ transform, boxShadow: shadow, transition: 'transform 0.15s ease, box-shadow 0.15s ease', transformStyle: 'preserve-3d' }}
      className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden flex flex-col group cursor-default will-change-transform"
    >
      {/* Image */}
      <Link to={`/producto/${product.slug}`} className="relative aspect-square bg-gray-50 dark:bg-gray-700 overflow-hidden block">
        {product.image_url ? (
          <img src={product.image_url} alt={product.name} loading="lazy" decoding="async" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-6xl select-none">🥦</div>
        )}

        {/* Shine */}
        <div
          className="absolute inset-0 pointer-events-none transition-opacity duration-200"
          style={{
            background: `radial-gradient(circle at ${shine.x} ${shine.y}, rgba(255,255,255,${shine.opacity * 5}) 0%, transparent 65%)`,
            opacity: shine.opacity > 0 ? 1 : 0,
          }}
        />

        {/* Badges top-left */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {outOfStock && <Badge variant="red">Sin stock</Badge>}
          {promoActive && <Badge variant="orange">Oferta</Badge>}
          {!promoActive && productIsNew && <Badge variant="blue">Nuevo</Badge>}
          {product.categories && <Badge variant="green">{product.categories.name}</Badge>}
        </div>

        {/* Low stock warning */}
        {lowStock && (
          <div className="absolute bottom-3 left-3 bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-lg">
            ¡Últimas {Math.floor(product.stock)} unidades!
          </div>
        )}

        {/* Favorite button */}
        <button
          onClick={(e) => { e.preventDefault(); toggleFav(product.id) }}
          className="absolute top-3 right-3 p-1.5 bg-white/80 dark:bg-gray-900/80 backdrop-blur rounded-full hover:scale-110 transition-transform"
          aria-label="Favorito"
        >
          <Heart className={`h-4 w-4 transition-colors ${isFav ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} />
        </button>
      </Link>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1 gap-2" style={{ transform: 'translateZ(20px)' }}>
        <div className="flex-1">
          <Link to={`/producto/${product.slug}`}>
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 leading-snug hover:text-primary-700 dark:hover:text-primary-400 transition-colors text-sm">
              {product.name}
            </h3>
          </Link>
          {product.description && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-2">{product.description}</p>
          )}
        </div>

        {/* Price */}
        <div>
          <div className="flex items-baseline gap-1.5">
            <p className="text-lg font-bold text-primary-700 dark:text-primary-400">{formatPrice(displayPrice)}</p>
            {promoActive && product.discount_price && (
              <p className="text-xs text-gray-400 line-through">{formatPrice(product.price)}</p>
            )}
          </div>
          <p className="text-xs text-gray-400">por {product.unit_type}</p>

          {/* Countdown */}
          {countdown && promoActive && (
            <div className={`flex items-center gap-1 text-xs font-semibold mt-1 ${urgentPromo ? 'text-red-500' : 'text-orange-500'}`}>
              <Flame className="h-3.5 w-3.5" />
              Termina en {formatCountdown(countdown.days, countdown.hours, countdown.mins, countdown.secs)}
            </div>
          )}
        </div>

        {/* Qty + Add / Waitlist */}
        {!outOfStock ? (
          <div className="flex flex-col gap-2">
            {chips ? (
              <>
                <div className={`grid gap-1 ${chips.length <= 4 ? 'grid-cols-4' : 'grid-cols-3'}`}>
                  {chips.map((w) => (
                    <button
                      key={w}
                      onClick={() => setQty(w)}
                      className={`py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
                        qty === w
                          ? 'bg-primary-600 text-white border-primary-600'
                          : 'border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:border-primary-400'
                      }`}
                    >
                      {isKg ? (w < 1 ? `${w * 1000}g` : `${w}kg`) : `${w} u`}
                    </button>
                  ))}
                </div>
                <Button size="sm" onClick={handleAdd} className="w-full">
                  <ShoppingCart className="h-4 w-4" />
                  Agregar {isKg ? formatQty(qty, 'kg') : `${qty} u`}
                </Button>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <div className="flex items-center border border-gray-200 dark:border-gray-600 rounded-xl overflow-hidden">
                  <button onClick={() => setQty((q) => Math.max(minQty, parseFloat((q - step).toFixed(2))))} className="px-2 py-1.5 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <Minus className="h-3.5 w-3.5 text-gray-500 dark:text-gray-400" />
                  </button>
                  <span className="px-2 text-sm font-semibold text-gray-800 dark:text-gray-200 min-w-[1.5rem] text-center">{qty}</span>
                  <button onClick={() => setQty((q) => parseFloat((q + step).toFixed(2)))} className="px-2 py-1.5 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <Plus className="h-3.5 w-3.5 text-gray-500 dark:text-gray-400" />
                  </button>
                </div>
                <Button size="sm" onClick={handleAdd} className="flex-1 shrink-0">
                  <ShoppingCart className="h-4 w-4" />
                  Agregar
                </Button>
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={handleWaitlist}
            className="flex items-center gap-1.5 text-xs text-green-600 hover:text-green-700 font-medium transition-colors"
          >
            <MessageCircle className="h-4 w-4" />
            Avisarme cuando haya stock
          </button>
        )}

        {product.is_featured && !outOfStock && !promoActive && (
          <div className="flex items-center gap-1 text-xs text-accent-600 font-medium">
            <Star className="h-3.5 w-3.5 fill-accent-500 text-accent-500" />
            Producto destacado
          </div>
        )}
      </div>
    </article>
  )
}
