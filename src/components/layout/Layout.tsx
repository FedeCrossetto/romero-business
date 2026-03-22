import { useEffect } from 'react'
import type { ReactNode } from 'react'
import { Header } from './Header'
import { Footer } from './Footer'
import { AnnouncementBar } from './AnnouncementBar'
import { CartDrawer } from '@/features/cart/CartDrawer'
import { WhatsAppChat } from '@/features/chat/WhatsAppChat'
import { ToastProvider } from '@/components/ui/Toast'

export function Layout({ children }: { children: ReactNode }) {
  // Re-apply dark class on mount in case localStorage has it
  useEffect(() => {
    const dark = localStorage.getItem('romero-dark') === 'true'
    document.documentElement.classList.toggle('dark', dark)
  }, [])

  return (
    <ToastProvider>
      <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
        <AnnouncementBar />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <CartDrawer />
        <WhatsAppChat />
      </div>
    </ToastProvider>
  )
}
