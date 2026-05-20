import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import PublicLayout from '@/components/PublicLayout'
import AdminLayout from '@/components/AdminLayout'
import Home from '@/pages/public/Home'
import Catalog from '@/pages/public/Catalog'
import ProductDetail from '@/pages/public/ProductDetail'
import Cart from '@/pages/public/Cart'
import Checkout from '@/pages/public/Checkout'
import Login from '@/pages/auth/Login'
import Register from '@/pages/auth/Register'
import ForgotPassword from '@/pages/auth/ForgotPassword'
import Profile from '@/pages/public/Profile'
import MyOrders from '@/pages/public/MyOrders'
import OrderDetail from '@/pages/public/OrderDetail'
import Addresses from '@/pages/public/Addresses'
import Landing from '@/pages/public/Landing'
import Policies from '@/pages/public/Policies'
import Contact from '@/pages/public/Contact'
import AdminDashboard from '@/pages/admin/Dashboard'
import AdminProducts from '@/pages/admin/AdminProducts'
import AdminProductForm from '@/pages/admin/AdminProductForm'
import AdminCategories from '@/pages/admin/AdminCategories'
import AdminImages from '@/pages/admin/AdminImages'
import AdminOrders from '@/pages/admin/AdminOrders'
import AdminOrderDetail from '@/pages/admin/AdminOrderDetail'
import AdminClients from '@/pages/admin/AdminClients'
import AdminRoles from '@/pages/admin/AdminRoles'
import AdminSettings from '@/pages/admin/AdminSettings'
import AdminLogs from '@/pages/admin/AdminLogs'
import ToastContainer from '@/components/Toast'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})

export default function AppRouter() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ToastContainer />
        <Routes>
          {/* Public routes */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/catalogo" element={<Catalog />} />
            <Route path="/categoria/:slug" element={<Catalog />} />
            <Route path="/busqueda" element={<Catalog />} />
            <Route path="/producto/:slug" element={<ProductDetail />} />
            <Route path="/carrito" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/login" element={<Login />} />
            <Route path="/registro" element={<Register />} />
            <Route path="/recuperacion" element={<ForgotPassword />} />
            <Route path="/recuperacion/:token" element={<ForgotPassword />} />
            <Route path="/perfil" element={<Profile />} />
            <Route path="/mis-pedidos" element={<MyOrders />} />
            <Route path="/mis-pedidos/:id" element={<OrderDetail />} />
            <Route path="/direcciones" element={<Addresses />} />
            <Route path="/landing/:slug" element={<Landing />} />
            <Route path="/politicas" element={<Policies />} />
            <Route path="/contacto" element={<Contact />} />
          </Route>

          {/* Admin routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="productos" element={<AdminProducts />} />
            <Route path="productos/nuevo" element={<AdminProductForm />} />
            <Route path="productos/:id/editar" element={<AdminProductForm />} />
            <Route path="categorias" element={<AdminCategories />} />
            <Route path="imagenes" element={<AdminImages />} />
            <Route path="pedidos" element={<AdminOrders />} />
            <Route path="pedidos/:id" element={<AdminOrderDetail />} />
            <Route path="clientes" element={<AdminClients />} />
            <Route path="roles" element={<AdminRoles />} />
            <Route path="configuracion" element={<AdminSettings />} />
            <Route path="logs" element={<AdminLogs />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  )
}
