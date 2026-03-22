import { X, ShoppingBag, ArrowRight, Truck, CheckCircle, Trash2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useCartStore } from '@/store/cart'
import { useSettings } from '@/hooks/useSettings'
import { CartItem } from './CartItem'
import { Button } from '@/components/ui/Button'
import { formatPrice } from '@/lib/utils'

export function CartDrawer() {
  const { items, isOpen, closeCart, total, clearCart } = useCartStore()
  const { settings } = useSettings()
  const navigate = useNavigate()

  const threshold = parseFloat(settings.free_shipping_threshold) || 20000
  const cartTotal = total()
  const remaining = Math.max(0, threshold - cartTotal)
  const progress = Math.min(100, (cartTotal / threshold) * 100)
  const hasFreeShipping = cartTotal >= threshold

  function goToCheckout() {
    closeCart()
    navigate('/checkout')
  }

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/40 z-50 transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={closeCart}
      />

      {/* Drawer */}
      <aside
        className={`fixed right-0 top-0 h-full w-full max-w-sm bg-white z-50 shadow-2xl flex flex-col transition-transform duration-300 ease-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5 text-primary-600" />
            <h2 className="font-bold text-gray-900">Mi carrito</h2>
            {items.length > 0 && (
              <span className="bg-primary-100 text-primary-700 text-xs font-semibold px-2 py-0.5 rounded-full">
                {items.length}
              </span>
            )}
          </div>
          <div className="flex items-center gap-1">
            {items.length > 0 && (
              <button
                onClick={() => {
                  if (confirm('¿Vaciar el carrito? Se eliminarán todos los productos.')) {
                    clearCart()
                  }
                }}
                className="p-1.5 rounded-full hover:bg-red-50 text-gray-400 hover:text-red-500 transition"
                aria-label="Vaciar carrito"
                title="Vaciar carrito"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            )}
            <button
              onClick={closeCart}
              className="p-2 rounded-full hover:bg-gray-100 transition"
              aria-label="Cerrar"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-5">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-center py-16">
              <div className="text-6xl">🛒</div>
              <p className="text-gray-500 font-medium">Tu carrito está vacío</p>
              <Button variant="outline" size="sm" onClick={closeCart}>
                Ir al catálogo
              </Button>
            </div>
          ) : (
            <div>
              {items.map((item) => (
                <CartItem key={item.product.id} item={item} />
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-gray-100 p-5 space-y-4 bg-gray-50">

            {/* Shipping progress */}
            <div className={`rounded-2xl px-4 py-3 text-sm ${hasFreeShipping ? 'bg-primary-50 border border-primary-200' : 'bg-orange-50 border border-orange-200'}`}>
              <div className="flex items-center gap-2 mb-2">
                {hasFreeShipping ? (
                  <>
                    <CheckCircle className="h-4 w-4 text-primary-600 shrink-0" />
                    <span className="font-semibold text-primary-700">¡Envío gratis desbloqueado!</span>
                  </>
                ) : (
                  <>
                    <Truck className="h-4 w-4 text-orange-500 shrink-0" />
                    <span className="text-orange-700">
                      Sumá <strong>{formatPrice(remaining)}</strong> más para envío gratis
                    </span>
                  </>
                )}
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-500 ${hasFreeShipping ? 'bg-primary-500' : 'bg-orange-400'}`}
                  style={{ width: `${progress}%` }}
                />
              </div>
              {!hasFreeShipping && (
                <p className="text-xs text-gray-400 mt-1">Envío gratis a partir de {formatPrice(threshold)}</p>
              )}
            </div>

            <div className="flex justify-between items-center">
              <span className="text-gray-600 font-medium">Subtotal estimado</span>
              <span className="text-2xl font-bold text-primary-700">{formatPrice(cartTotal)}</span>
            </div>
            <Button size="lg" className="w-full" onClick={goToCheckout}>
              Confirmar pedido
              <ArrowRight className="h-5 w-5" />
            </Button>
            <p className="text-xs text-center text-gray-400">
              El pedido se envía por WhatsApp. Los precios son estimados.
            </p>
          </div>
        )}
      </aside>
    </>
  )
}
