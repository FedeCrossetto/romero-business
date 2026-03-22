import type { ReactNode } from 'react'
import { Header } from './Header'
import { Footer } from './Footer'
import { CartDrawer } from '@/features/cart/CartDrawer'
import { WhatsAppChat } from '@/features/chat/WhatsAppChat'

export function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <CartDrawer />
      <WhatsAppChat />
    </div>
  )
}
