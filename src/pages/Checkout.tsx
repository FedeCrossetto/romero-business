import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { MessageCircle, ArrowLeft, MapPin, Store, Truck, CheckCircle, Clock } from 'lucide-react'
import { useCartStore } from '@/store/cart'
import { useSettings } from '@/hooks/useSettings'
import { useOrderHistory } from '@/store/orderHistory'
import { useSavedList } from '@/store/savedList'
import { buildWhatsAppMessage, openWhatsApp } from '@/lib/whatsapp'
import { formatPrice, cn } from '@/lib/utils'
import { Input, Textarea } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { CartItem } from '@/features/cart/CartItem'
import type { CheckoutFormData } from '@/types'

const INITIAL_FORM: CheckoutFormData = {
  name: '',
  phone: '',
  address: '',
  delivery_type: 'delivery',
  notes: '',
}

export function Checkout() {
  const { items, total, clearCart } = useCartStore()
  const { settings } = useSettings()
  const { addOrder } = useOrderHistory()
  const { saveList } = useSavedList()
  const navigate = useNavigate()
  const [form, setForm] = useState<CheckoutFormData>(INITIAL_FORM)
  const [errors, setErrors] = useState<Partial<CheckoutFormData>>({})

  const cartTotal = total()
  const threshold = parseFloat(settings.free_shipping_threshold) || 20000
  const deliveryFee = parseFloat(settings.delivery_fee) || 500
  const hasFreeShipping = cartTotal >= threshold
  const shippingCost = form.delivery_type === 'delivery' ? (hasFreeShipping ? 0 : deliveryFee) : 0
  const orderTotal = cartTotal + shippingCost

  function set<K extends keyof CheckoutFormData>(key: K, value: CheckoutFormData[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
    setErrors((prev) => ({ ...prev, [key]: '' }))
  }

  function validate(): boolean {
    setErrors({})
    return true
  }

  function handleSend() {
    if (!validate()) return
    const message = buildWhatsAppMessage(items, form, settings.business_name)
    openWhatsApp(settings.whatsapp_number, message)
    addOrder(items, form, orderTotal)
    clearCart()
    navigate('/', { replace: true })
  }

  if (items.length === 0) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <p className="text-5xl mb-4">🛒</p>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Carrito vacío</h2>
        <p className="text-gray-500 mb-6">Agregá productos antes de continuar</p>
        <Button onClick={() => navigate('/catalogo')}>Ver catálogo</Button>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-700 transition"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver
        </button>
        <Link
          to="/mis-pedidos"
          className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-primary-600 transition-colors"
        >
          <Clock className="h-4 w-4" />
          Ver mis pedidos
        </Link>
      </div>

      <h1 className="text-3xl font-bold text-gray-900 mb-8">Confirmar pedido</h1>

      <div className="grid md:grid-cols-2 gap-8 items-start">
        {/* Form */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 shadow-card space-y-4">
            <h2 className="font-bold text-gray-900">Tus datos</h2>
            <Input
              id="name"
              label="Nombre y apellido"
              value={form.name}
              onChange={(e) => set('name', e.target.value)}
              error={errors.name}
              placeholder="Juan Pérez"
            />
            <Input
              id="phone"
              label="Teléfono / WhatsApp"
              type="tel"
              value={form.phone}
              onChange={(e) => set('phone', e.target.value)}
              error={errors.phone}
              placeholder="11 2233 4455"
            />
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-card space-y-4">
            <h2 className="font-bold text-gray-900">Tipo de entrega</h2>
            <div className="grid grid-cols-2 gap-3">
              {[
                { value: 'delivery', label: 'Envío a domicilio', icon: MapPin },
                { value: 'pickup', label: 'Retiro en local', icon: Store },
              ].map(({ value, label, icon: Icon }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => set('delivery_type', value as 'delivery' | 'pickup')}
                  className={cn(
                    'flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition font-medium text-sm',
                    form.delivery_type === value
                      ? 'border-primary-500 bg-primary-50 text-primary-700'
                      : 'border-gray-200 text-gray-600 hover:border-primary-300',
                  )}
                >
                  <Icon className="h-5 w-5" />
                  {label}
                </button>
              ))}
            </div>

            {/* Shipping cost info */}
            {form.delivery_type === 'delivery' && (
              <div className={`flex items-center gap-2 rounded-2xl px-4 py-3 text-sm ${hasFreeShipping ? 'bg-primary-50 border border-primary-200' : 'bg-orange-50 border border-orange-200'}`}>
                {hasFreeShipping ? (
                  <>
                    <CheckCircle className="h-4 w-4 text-primary-600 shrink-0" />
                    <span className="text-primary-700 font-semibold">¡Envío gratis! Tu pedido supera {formatPrice(threshold)}</span>
                  </>
                ) : (
                  <>
                    <Truck className="h-4 w-4 text-orange-500 shrink-0" />
                    <span className="text-orange-700">
                      Costo de envío: <strong>{formatPrice(deliveryFee)}</strong>
                      <span className="text-gray-400 text-xs block">Envío gratis a partir de {formatPrice(threshold)}</span>
                    </span>
                  </>
                )}
              </div>
            )}

            {form.delivery_type === 'delivery' && (
              <Input
                id="address"
                label="Dirección"
                value={form.address}
                onChange={(e) => set('address', e.target.value)}
                error={errors.address}
                placeholder="Av. Corrientes 1234, CABA"
              />
            )}
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-card">
            <Textarea
              id="notes"
              label="Notas adicionales"
              value={form.notes}
              onChange={(e) => set('notes', e.target.value)}
              placeholder="Ej: dejar en portería, sin cáscara, etc."
              rows={3}
            />
          </div>
        </div>

        {/* Order summary */}
        <div className="space-y-4 md:sticky md:top-24">
          <div className="bg-white rounded-3xl p-6 shadow-card">
            <h2 className="font-bold text-gray-900 mb-4">Tu pedido</h2>
            <div className="max-h-72 overflow-y-auto">
              {items.map((item) => (
                <CartItem key={item.product.id} item={item} />
              ))}
            </div>
            <div className="border-t border-gray-100 mt-4 pt-4 space-y-2">
              <div className="flex justify-between text-sm text-gray-500">
                <span>Subtotal productos</span>
                <span>{formatPrice(cartTotal)}</span>
              </div>
              {form.delivery_type === 'delivery' && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Envío</span>
                  {hasFreeShipping
                    ? <span className="text-primary-600 font-semibold">Gratis</span>
                    : <span className="text-gray-700">{formatPrice(deliveryFee)}</span>
                  }
                </div>
              )}
              <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                <span className="text-gray-700 font-semibold">Total estimado</span>
                <span className="text-2xl font-bold text-primary-700">{formatPrice(orderTotal)}</span>
              </div>
            </div>
          </div>

          <Button size="lg" className="w-full" onClick={handleSend}>
            <MessageCircle className="h-5 w-5" />
            Enviar pedido por WhatsApp
          </Button>

          <button
            type="button"
            onClick={() => { saveList(items); alert('¡Lista guardada! La próxima vez podés repetirla desde "Mis pedidos".') }}
            className="w-full text-sm text-gray-400 hover:text-primary-600 transition-colors py-1"
          >
            Guardar como lista habitual
          </button>

          <p className="text-xs text-center text-gray-400 px-2">
            Al tocar el botón se abrirá WhatsApp con tu pedido listo para enviar. Los precios son estimados y pueden variar según disponibilidad.
          </p>
        </div>
      </div>
    </div>
  )
}
