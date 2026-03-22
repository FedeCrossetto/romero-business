export interface Category {
  id: string
  name: string
  slug: string
  sort_order: number
  created_at: string
}

export interface Product {
  id: string
  name: string
  slug: string
  description: string | null
  price: number
  discount_price: number | null
  promo_until: string | null
  unit_type: UnitType
  stock: number
  image_url: string | null
  category_id: string | null
  is_featured: boolean
  is_active: boolean
  created_at: string
  categories?: Category
}

export type UnitType = 'kg' | 'unidad' | 'bolsa' | 'atado' | 'docena'

export interface CartItem {
  product: Product
  quantity: number
  notes?: string
}

export interface CheckoutFormData {
  name: string
  phone: string
  address: string
  delivery_type: 'pickup' | 'delivery'
  notes: string
}

export interface Settings {
  whatsapp_number: string
  business_name: string
  delivery_fee: string
  free_shipping_threshold: string
  business_address: string
  business_hours: string
  announcement_active: string
  announcement_text: string
}
