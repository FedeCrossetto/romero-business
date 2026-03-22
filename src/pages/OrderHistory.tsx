import { useNavigate } from 'react-router-dom'
import { ArrowLeft, RotateCcw, Trash2, Bookmark } from 'lucide-react'
import { useOrderHistory } from '@/store/orderHistory'
import { useSavedList } from '@/store/savedList'
import { useCartStore } from '@/store/cart'
import { formatPrice } from '@/lib/utils'
import { Button } from '@/components/ui/Button'

export function OrderHistory() {
  const navigate = useNavigate()
  const { orders, clearHistory } = useOrderHistory()
  const { list: savedList, savedAt, clearList } = useSavedList()
  const { addItem, openCart } = useCartStore()

  function repeatOrder(orderId: string) {
    const order = orders.find((o) => o.id === orderId)
    if (!order) return
    order.items.forEach((item) => {
      for (let i = 0; i < item.quantity; i++) addItem(item.product)
    })
    openCart()
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-8 transition"
      >
        <ArrowLeft className="h-4 w-4" />
        Volver
      </button>

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mis pedidos</h1>
          <p className="text-gray-500 text-sm mt-0.5">Historial de los últimos 20 pedidos</p>
        </div>
        {orders.length > 0 && (
          <button
            onClick={() => {
              if (confirm('¿Borrar todo el historial de pedidos?')) clearHistory()
            }}
            className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-red-500 transition-colors"
          >
            <Trash2 className="h-4 w-4" />
            Borrar historial
          </button>
        )}
      </div>

      {/* Lista habitual guardada */}
      {savedList.length > 0 && (
        <div className="bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800 rounded-3xl p-5 mb-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-2">
              <Bookmark className="h-5 w-5 text-primary-600 shrink-0" />
              <div>
                <p className="font-bold text-gray-900 dark:text-gray-100">Tu lista habitual</p>
                {savedAt && (
                  <p className="text-xs text-gray-400">Guardada el {new Date(savedAt).toLocaleDateString('es-AR')}</p>
                )}
              </div>
            </div>
            <button
              onClick={() => { if (confirm('¿Borrar la lista habitual?')) clearList() }}
              className="text-gray-400 hover:text-red-500 transition-colors p-1"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {savedList.map((item) => (
              <span key={item.product.id} className="bg-white dark:bg-gray-800 text-xs px-2.5 py-1 rounded-full border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300">
                {item.product.name} x{item.quantity}
              </span>
            ))}
          </div>
          <button
            onClick={() => {
              savedList.forEach((item) => { for (let i = 0; i < item.quantity; i++) addItem(item.product) })
              openCart()
            }}
            className="mt-3 flex items-center gap-2 text-sm text-primary-600 font-semibold hover:text-primary-700 transition-colors"
          >
            <RotateCcw className="h-4 w-4" />
            Agregar lista al carrito
          </button>
        </div>
      )}

      {orders.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">📋</div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Sin pedidos aún</h2>
          <p className="text-gray-500 mb-6">Cuando hagas un pedido, aparecerá acá.</p>
          <Button onClick={() => navigate('/catalogo')}>Ver catálogo</Button>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="bg-white rounded-3xl shadow-card p-5 space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-bold text-gray-900">{order.form.name}</p>
                  <p className="text-sm text-gray-400 mt-0.5">
                    {new Date(order.date).toLocaleDateString('es-AR', {
                      day: 'numeric', month: 'long', year: 'numeric',
                      hour: '2-digit', minute: '2-digit',
                    })}
                  </p>
                  {order.form.delivery_type === 'delivery' && order.form.address && (
                    <p className="text-xs text-gray-400 mt-0.5">Envío a: {order.form.address}</p>
                  )}
                  {order.form.delivery_type === 'pickup' && (
                    <p className="text-xs text-gray-400 mt-0.5">Retiro en local</p>
                  )}
                </div>
                <span className="text-xl font-extrabold text-primary-700">
                  {formatPrice(order.total)}
                </span>
              </div>

              <div className="border-t border-gray-50 pt-3 space-y-1">
                {order.items.map((item) => (
                  <div key={item.product.id} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gray-100 overflow-hidden shrink-0">
                      {item.product.image_url ? (
                        <img src={item.product.image_url} alt={item.product.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-sm">🥦</div>
                      )}
                    </div>
                    <span className="text-sm text-gray-700 flex-1">{item.product.name}</span>
                    <span className="text-xs text-gray-400">x{item.quantity}</span>
                    <span className="text-sm font-medium text-gray-900">
                      {formatPrice(item.product.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              <button
                onClick={() => repeatOrder(order.id)}
                className="flex items-center gap-2 text-sm text-primary-600 hover:text-primary-700 font-medium transition-colors"
              >
                <RotateCcw className="h-4 w-4" />
                Repetir pedido
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
