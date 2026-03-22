import { Minus, Plus, Trash2 } from 'lucide-react'
import { useCartStore } from '@/store/cart'
import { formatPrice } from '@/lib/utils'
import type { CartItem as CartItemType } from '@/types'

export function CartItem({ item }: { item: CartItemType }) {
  const { updateQuantity, removeItem } = useCartStore()
  const { product, quantity } = item

  return (
    <div className="flex gap-3 items-start py-4 border-b border-gray-100 last:border-0">
      {/* Image */}
      <div className="w-16 h-16 rounded-2xl bg-gray-50 overflow-hidden shrink-0">
        {product.image_url ? (
          <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-2xl">🥦</div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="font-medium text-gray-900 text-sm leading-tight truncate">{product.name}</p>
        <p className="text-xs text-gray-400 mt-0.5">{formatPrice(product.price)} / {product.unit_type}</p>

        <div className="flex items-center gap-2 mt-2">
          <button
            onClick={() => updateQuantity(product.id, quantity - 1)}
            className="w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition"
            aria-label="Reducir"
          >
            <Minus className="h-3.5 w-3.5" />
          </button>
          <span className="font-semibold text-sm w-6 text-center">{quantity}</span>
          <button
            onClick={() => updateQuantity(product.id, quantity + 1)}
            className="w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition"
            aria-label="Aumentar"
          >
            <Plus className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Price + remove */}
      <div className="flex flex-col items-end gap-2 shrink-0">
        <p className="font-bold text-primary-700 text-sm">{formatPrice(product.price * quantity)}</p>
        <button
          onClick={() => removeItem(product.id)}
          className="text-gray-300 hover:text-red-500 transition"
          aria-label="Eliminar"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
