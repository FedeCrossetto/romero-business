import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import type { Product } from '@/types'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price)
}

export function formatQty(qty: number, unitType: string): string {
  if (unitType === 'kg') return qty < 1 ? `${qty * 1000}g` : `${qty}kg`
  return `${qty}`
}

export function effectivePrice(product: Product): number {
  if (!product.discount_price) return product.price
  if (!product.promo_until) return product.discount_price
  return new Date(product.promo_until) > new Date() ? product.discount_price : product.price
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}
