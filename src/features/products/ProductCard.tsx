import { useRef, useState } from 'react'
import { ShoppingCart, Star, AlertCircle } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { useCartStore } from '@/store/cart'
import { formatPrice } from '@/lib/utils'
import type { Product } from '@/types'

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem, openCart } = useCartStore()
  const cardRef = useRef<HTMLElement>(null)
  const [transform, setTransform] = useState('')
  const [shadow, setShadow] = useState('0 4px 20px rgba(0,0,0,0.08)')
  const [shine, setShine] = useState({ x: '50%', y: '50%', opacity: 0 })

  const outOfStock = product.stock <= 0
  const isOffer = product.is_featured && product.stock > 0

  function handleAdd() {
    addItem(product)
    openCart()
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

    setTransform(
      `perspective(900px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale3d(1.03,1.03,1.03)`
    )
    setShadow(
      `${-rotY * 1.5}px ${rotX * 1.5}px 40px rgba(0,0,0,0.18), 0 8px 24px rgba(0,0,0,0.10)`
    )
    setShine({
      x: `${(x / rect.width) * 100}%`,
      y: `${(y / rect.height) * 100}%`,
      opacity: 0.12,
    })
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
      style={{
        transform,
        boxShadow: shadow,
        transition: 'transform 0.15s ease, box-shadow 0.15s ease',
        transformStyle: 'preserve-3d',
      }}
      className="bg-white rounded-xl overflow-hidden flex flex-col group cursor-default will-change-transform"
    >
      {/* Image */}
      <div className="relative aspect-square bg-gray-50 overflow-hidden">
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-6xl select-none">
            🥦
          </div>
        )}

        {/* Shine overlay */}
        <div
          className="absolute inset-0 pointer-events-none transition-opacity duration-200"
          style={{
            background: `radial-gradient(circle at ${shine.x} ${shine.y}, rgba(255,255,255,${shine.opacity * 5}) 0%, transparent 65%)`,
            opacity: shine.opacity > 0 ? 1 : 0,
          }}
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {outOfStock && <Badge variant="red">Sin stock</Badge>}
          {isOffer && <Badge variant="orange">Destacado</Badge>}
          {product.categories && (
            <Badge variant="green">{product.categories.name}</Badge>
          )}
        </div>
      </div>

      {/* Content — elevado en Z para efecto 3D */}
      <div
        className="p-4 flex flex-col flex-1 gap-3"
        style={{ transform: 'translateZ(20px)' }}
      >
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 leading-snug">{product.name}</h3>
          {product.description && (
            <p className="text-sm text-gray-500 mt-0.5 line-clamp-2">{product.description}</p>
          )}
        </div>

        <div className="flex items-end justify-between gap-2">
          <div>
            <p className="text-xl font-bold text-primary-700">{formatPrice(product.price)}</p>
            <p className="text-xs text-gray-400">por {product.unit_type}</p>
          </div>

          {outOfStock ? (
            <div className="flex items-center gap-1 text-xs text-gray-400">
              <AlertCircle className="h-4 w-4" />
              Sin stock
            </div>
          ) : (
            <Button size="sm" onClick={handleAdd} className="shrink-0">
              <ShoppingCart className="h-4 w-4" />
              Agregar
            </Button>
          )}
        </div>

        {product.is_featured && !outOfStock && (
          <div className="flex items-center gap-1 text-xs text-accent-600 font-medium">
            <Star className="h-3.5 w-3.5 fill-accent-500 text-accent-500" />
            Producto destacado
          </div>
        )}
      </div>
    </article>
  )
}
