import { lazy, useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { HelmetProvider } from 'react-helmet-async'
import { useAuthStore } from '@/stores/authStore'
import PublicLayout from '@/components/PublicLayout'
import AdminLayout from '@/components/AdminLayout'
import PrivateRoute from '@/components/PrivateRoute'
import AdminRoute from '@/components/AdminRoute'
import GuestRoute from '@/components/GuestRoute'
import { PageSkeleton } from '@/components/PageSkeleton'
import ErrorBoundary from '@/components/ErrorBoundary'
import ToastContainer from '@/components/Toast'

// ─── Public pages (lazy) ───
const Home = lazy(() => import('@/pages/public/Home'))
const Catalog = lazy(() => import('@/pages/public/Catalog'))
const ProductDetail = lazy(() => import('@/pages/public/ProductDetail'))
const Cart = lazy(() => import('@/pages/public/Cart'))
const Checkout = lazy(() => import('@/pages/public/Checkout'))
const Profile = lazy(() => import('@/pages/public/Profile'))
const MyOrders = lazy(() => import('@/pages/public/MyOrders'))
const OrderDetail = lazy(() => import('@/pages/public/OrderDetail'))
const Addresses = lazy(() => import('@/pages/public/Addresses'))
const Landing = lazy(() => import('@/pages/public/Landing'))
const Policies = lazy(() => import('@/pages/public/Policies'))
const Contact = lazy(() => import('@/pages/public/Contact'))
const PaymentResult = lazy(() => import('@/pages/public/PaymentResult'))
const OrderConfirmation = lazy(() => import('@/pages/public/OrderConfirmation'))

// ─── Auth pages (lazy) ───
const Login = lazy(() => import('@/pages/auth/Login'))
const Register = lazy(() => import('@/pages/auth/Register'))
const ForgotPassword = lazy(() => import('@/pages/auth/ForgotPassword'))

// ─── Admin pages — chunk separado (solo se carga si el usuario es admin) ───
const AdminDashboard = lazy(() => import('@/pages/admin/Dashboard'))
const AdminProducts = lazy(() => import('@/pages/admin/AdminProducts'))
const AdminProductForm = lazy(() => import('@/pages/admin/AdminProductForm'))
const AdminCatalog = lazy(() => import('@/pages/admin/AdminCatalog'))
const AdminBrands = lazy(() => import('@/pages/admin/AdminBrands'))
const AdminCategories = lazy(() => import('@/pages/admin/AdminCategories'))
const AdminHeroes = lazy(() => import('@/pages/admin/AdminHeroes'))
const AdminImages = lazy(() => import('@/pages/admin/AdminImages'))
const AdminOrders = lazy(() => import('@/pages/admin/AdminOrders'))
const AdminOrderDetail = lazy(() => import('@/pages/admin/AdminOrderDetail'))
const AdminClients = lazy(() => import('@/pages/admin/AdminClients'))
const AdminRoles = lazy(() => import('@/pages/admin/AdminRoles'))
const AdminSettings = lazy(() => import('@/pages/admin/AdminSettings'))
const AdminLogs = lazy(() => import('@/pages/admin/AdminLogs'))
const AdminContactMessages = lazy(() => import('@/pages/admin/AdminContactMessages'))

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})

function AuthInitializer({ children }: { children: React.ReactNode }) {
  const checkAuth = useAuthStore((s) => s.checkAuth)

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  return <>{children}</>
}

export default function AppRouter() {
  return (
    <HelmetProvider>
    <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <AuthInitializer>
      <BrowserRouter>
        <ToastContainer />
        <Routes>
          {/* Public routes */}
          <Route element={<PublicLayout />}>
            {/* Public — sin restricción */}
            <Route path="/" element={<Home />} />
            <Route path="/catalogo" element={<Catalog />} />
            <Route path="/categoria/:slug" element={<Catalog />} />
            <Route path="/busqueda" element={<Catalog />} />
            <Route path="/producto/:slug" element={<ProductDetail />} />
            <Route path="/carrito" element={<Cart />} />
            <Route path="/landing/:slug" element={<Landing />} />
            <Route path="/politicas" element={<Policies />} />
            <Route path="/contacto" element={<Contact />} />
            <Route path="/pago/resultado" element={<PaymentResult />} />

            {/* Solo invitados (si ya está logueado, redirige a /) */}
            <Route element={<GuestRoute />}>
              <Route path="/login" element={<Login />} />
              <Route path="/registro" element={<Register />} />
              <Route path="/recuperacion" element={<ForgotPassword />} />
              <Route path="/recuperacion/:token" element={<ForgotPassword />} />
            </Route>

            {/* Requiere autenticación */}
            <Route element={<PrivateRoute />}>
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/perfil" element={<Profile />} />
              <Route path="/mis-pedidos" element={<MyOrders />} />
              <Route path="/mis-pedidos/:id" element={<OrderDetail />} />
              <Route path="/pedido/confirmacion/:id" element={<OrderConfirmation />} />
              <Route path="/direcciones" element={<Addresses />} />
            </Route>
          </Route>

          {/* Admin routes — requieren rol admin u operador */}
          {/* AdminLayout ya tiene un Suspense interno para lazy loading */}
          <Route path="/admin" element={<AdminRoute />}>
            <Route element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="productos" element={<AdminProducts />} />
            <Route path="productos/nuevo" element={<AdminProductForm />} />
            <Route path="productos/:id/editar" element={<AdminProductForm />} />
            <Route path="catalogo" element={<AdminCatalog />} />
            <Route path="marcas" element={<AdminBrands />} />
            <Route path="categorias" element={<AdminCategories />} />
            <Route path="heroes" element={<AdminHeroes />} />
            <Route path="imagenes" element={<AdminImages />} />
            <Route path="pedidos" element={<AdminOrders />} />
            <Route path="pedidos/:id" element={<AdminOrderDetail />} />
            <Route path="clientes" element={<AdminClients />} />
            <Route path="roles" element={<AdminRoles />} />
            <Route path="configuracion" element={<AdminSettings />} />
            <Route path="logs" element={<AdminLogs />} />
            <Route path="mensajes" element={<AdminContactMessages />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthInitializer>
    </QueryClientProvider>
    </ErrorBoundary>
    </HelmetProvider>
  )
}
