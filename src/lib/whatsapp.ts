import type { CartItem, CheckoutFormData } from '@/types'
import { formatPrice } from './utils'

export function buildWhatsAppMessage(
  items: CartItem[],
  form: CheckoutFormData,
  businessName: string,
): string {
  const deliveryLabel =
    form.delivery_type === 'pickup' ? 'Retiro en local' : 'Envio a domicilio'

  const productLines = items
    .map((item) => {
      const subtotal = item.product.price * item.quantity
      return `• ${item.product.name} x ${item.quantity} ${item.product.unit_type} — ${formatPrice(subtotal)}`
    })
    .join('\n')

  const total = items.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0,
  )

  const lines: string[] = [
    `Hola ${businessName}! Quiero hacer un pedido`,
    '',
    `*Nombre:* ${form.name}`,
    `*Telefono:* ${form.phone}`,
    `*Entrega:* ${deliveryLabel}`,
  ]

  if (form.delivery_type === 'delivery' && form.address) {
    lines.push(`*Direccion:* ${form.address}`)
  }

  lines.push('', '*Productos:*', productLines, '', `*Subtotal estimado:* ${formatPrice(total)}`)

  if (form.notes) {
    lines.push(`*Notas:* ${form.notes}`)
  }

  return lines.join('\n')
}

export function openWhatsApp(whatsappNumber: string, message: string): void {
  const encoded = encodeURIComponent(message)
  const url = `https://wa.me/${whatsappNumber}?text=${encoded}`
  window.open(url, '_blank', 'noopener,noreferrer')
}
