import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Layout } from '@/components/layout/Layout'
import { Home } from '@/pages/Home'
import { Catalog } from '@/pages/Catalog'
import { Checkout } from '@/pages/Checkout'
import { Mayoristas } from '@/pages/Mayoristas'
import { AdminLogin } from '@/pages/admin/Login'
import { AdminProducts } from '@/pages/admin/Products'
import { AdminSettings } from '@/pages/admin/Settings'
import { NotFound } from '@/pages/NotFound'
import { useAuth } from '@/hooks/useAuth'
import { PageSpinner } from '@/components/ui/Spinner'
import type { ReactNode } from 'react'

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
        {/* Public routes */}
        <Route
          path="/"
          element={
            <Layout>
              <Home />
            </Layout>
          }
        />
        <Route
          path="/catalogo"
          element={
            <Layout>
              <Catalog />
            </Layout>
          }
        />
        <Route
          path="/mayoristas"
          element={
            <Layout>
              <Mayoristas />
            </Layout>
          }
        />
        <Route
          path="/checkout"
          element={
            <Layout>
              <Checkout />
            </Layout>
          }
        />

        {/* Admin routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/admin"
          element={
            <AdminGuard>
              <AdminProducts />
            </AdminGuard>
          }
        />
        <Route
          path="/admin/settings"
          element={
            <AdminGuard>
              <AdminSettings />
            </AdminGuard>
          }
        />

        {/* 404 */}
        <Route
          path="*"
          element={
            <Layout>
              <NotFound />
            </Layout>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}
