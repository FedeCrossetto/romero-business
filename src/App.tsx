import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import { Layout } from '@/components/layout/Layout'
import { Home } from '@/pages/Home'
import { Catalog } from '@/pages/Catalog'
import { Checkout } from '@/pages/Checkout'
import { Mayoristas } from '@/pages/Mayoristas'
import { ProductDetail } from '@/pages/ProductDetail'
import { OrderHistory } from '@/pages/OrderHistory'
import { Favorites } from '@/pages/Favorites'
import { NotFound } from '@/pages/NotFound'
import { useAuth } from '@/hooks/useAuth'
import { PageSpinner } from '@/components/ui/Spinner'
import type { ReactNode } from 'react'

// Admin routes — lazy loaded to keep public bundle small
const AdminLogin = lazy(() => import('@/pages/admin/Login').then(m => ({ default: m.AdminLogin })))
const AdminDashboard = lazy(() => import('@/pages/admin/Dashboard').then(m => ({ default: m.AdminDashboard })))
const AdminProducts = lazy(() => import('@/pages/admin/Products').then(m => ({ default: m.AdminProducts })))
const AdminSettings = lazy(() => import('@/pages/admin/Settings').then(m => ({ default: m.AdminSettings })))
const AdminCategories = lazy(() => import('@/pages/admin/Categories').then(m => ({ default: m.AdminCategories })))
const FinanzasDashboard = lazy(() => import('@/pages/admin/finanzas/FinanzasDashboard').then(m => ({ default: m.FinanzasDashboard })))
const FinanzasVentas = lazy(() => import('@/pages/admin/finanzas/FinanzasVentas').then(m => ({ default: m.FinanzasVentas })))
const FinanzasGastos = lazy(() => import('@/pages/admin/finanzas/FinanzasGastos').then(m => ({ default: m.FinanzasGastos })))
const FinanzasStock = lazy(() => import('@/pages/admin/finanzas/FinanzasStock').then(m => ({ default: m.FinanzasStock })))

function AdminGuard({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth()
  if (loading) return <PageSpinner />
  if (!user) return <Navigate to="/admin/login" replace />
  return <>{children}</>
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/" element={<Layout><Home /></Layout>} />
        <Route path="/catalogo" element={<Layout><Catalog /></Layout>} />
        <Route path="/mayoristas" element={<Layout><Mayoristas /></Layout>} />
        <Route path="/checkout" element={<Layout><Checkout /></Layout>} />
        <Route path="/producto/:slug" element={<Layout><ProductDetail /></Layout>} />
        <Route path="/mis-pedidos" element={<Layout><OrderHistory /></Layout>} />
        <Route path="/favoritos" element={<Layout><Favorites /></Layout>} />

        {/* Admin — lazy loaded */}
        <Route path="/admin/login" element={<Suspense fallback={<PageSpinner />}><AdminLogin /></Suspense>} />
        <Route path="/admin" element={<AdminGuard><Suspense fallback={<PageSpinner />}><AdminDashboard /></Suspense></AdminGuard>} />
        <Route path="/admin/products" element={<AdminGuard><Suspense fallback={<PageSpinner />}><AdminProducts /></Suspense></AdminGuard>} />
        <Route path="/admin/categories" element={<AdminGuard><Suspense fallback={<PageSpinner />}><AdminCategories /></Suspense></AdminGuard>} />
        <Route path="/admin/settings" element={<AdminGuard><Suspense fallback={<PageSpinner />}><AdminSettings /></Suspense></AdminGuard>} />
        <Route path="/admin/finanzas" element={<AdminGuard><Suspense fallback={<PageSpinner />}><FinanzasDashboard /></Suspense></AdminGuard>} />
        <Route path="/admin/finanzas/ventas" element={<AdminGuard><Suspense fallback={<PageSpinner />}><FinanzasVentas /></Suspense></AdminGuard>} />
        <Route path="/admin/finanzas/gastos" element={<AdminGuard><Suspense fallback={<PageSpinner />}><FinanzasGastos /></Suspense></AdminGuard>} />
        <Route path="/admin/finanzas/stock" element={<AdminGuard><Suspense fallback={<PageSpinner />}><FinanzasStock /></Suspense></AdminGuard>} />

        {/* 404 */}
        <Route path="*" element={<Layout><NotFound /></Layout>} />
      </Routes>
    </BrowserRouter>
  )
}
