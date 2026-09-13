import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useState, useEffect, lazy, Suspense } from 'react'
import { LanguageProvider } from './contexts/LanguageContext'
import { ThemeProvider } from './contexts/ThemeContext'
import { CartProvider } from './contexts/CartContext'
import { FavoritesProvider } from './contexts/FavoritesContext'
import SplashScreen from './components/SplashScreen'
import InstallAppBanner from './components/InstallAppBanner'
import { ProtectedRoute } from './components/ProtectedRoute'
import BottomNav from './components/BottomNav'
import { Analytics } from '@vercel/analytics/react'

const Home = lazy(() => import('./pages/Home'))
const Sobre = lazy(() => import('./pages/Sobre'))
const AdminDashboard = lazy(() => import('./pages/AdminDashboard').then(m => ({ default: m.AdminDashboard })))
const Login = lazy(() => import('./pages/Login'))
const ExperienceDetail = lazy(() => import('./pages/ExperienceDetail'))
const ProductCategory = lazy(() => import('./pages/ProductCategory'))
const ProductDetail = lazy(() => import('./pages/ProductDetail'))
const CustomerDashboard = lazy(() => import('./pages/CustomerDashboard'))
const UserProfile = lazy(() => import('./pages/UserProfile'))
const CartCheckout = lazy(() => import('./components/CartCheckout'))
const GaleriaPage = lazy(() => import('./pages/GaleriaPage'))
const ExperienciasPage = lazy(() => import('./pages/ExperienciasPage'))
const KiteCoursePage = lazy(() => import('./pages/KiteCoursePage'))
const WishlistPage = lazy(() => import('./pages/WishlistPage'))
const ConversationsList = lazy(() => import('./pages/ConversationsList'))
const Chat = lazy(() => import('./pages/Chat'))
const FriendsPage = lazy(() => import('./pages/FriendsPage'))
const NotificationsPage = lazy(() => import('./pages/NotificationsPage'))
const Community = lazy(() => import('./pages/Community'))
const TripsPage = lazy(() => import('./pages/TripsPage'))
const TripDetailPage = lazy(() => import('./pages/TripDetailPage'))
const TripCreatePage = lazy(() => import('./pages/TripCreatePage'))
const TripEditPage = lazy(() => import('./pages/TripEditPage'))
const NotFound = lazy(() => import('./pages/NotFound'))

export default function App() {
  const [showSplash, setShowSplash] = useState(true)

  useEffect(() => {
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (navigator as Navigator & { standalone?: boolean }).standalone === true

    const splashSeen = sessionStorage.getItem('amzwind-splash-seen')

    if (!isStandalone || splashSeen) {
      setShowSplash(false)
    }
  }, [])

  const handleSplashComplete = () => {
    sessionStorage.setItem('amzwind-splash-seen', '1')
    setShowSplash(false)
  }

  if (showSplash) {
    return (
      <LanguageProvider>
        <ThemeProvider>
          <SplashScreen onComplete={handleSplashComplete} />
        </ThemeProvider>
      </LanguageProvider>
    )
  }

  return (
    <LanguageProvider>
      <ThemeProvider>
        <FavoritesProvider>
          <CartProvider>
            <BrowserRouter>
            <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="animate-spin w-8 h-8 border-2 border-amz-dourado border-t-transparent rounded-full" /></div>}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/sobre" element={<Sobre />} />
              <Route path="/galeria" element={<GaleriaPage />} />
              <Route path="/experiencias" element={<ExperienciasPage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
              <Route path="/minha-conta" element={<ProtectedRoute><CustomerDashboard /></ProtectedRoute>} />
              <Route path="/perfil" element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />
              <Route path="/experiencia/:id" element={<ExperienceDetail />} />
              <Route path="/aula/iniciante" element={<KiteCoursePage />} />
              <Route path="/favoritos" element={<ProtectedRoute><WishlistPage /></ProtectedRoute>} />
              <Route path="/conversas" element={<ProtectedRoute><ConversationsList /></ProtectedRoute>} />
              <Route path="/chat/:id" element={<ProtectedRoute><Chat /></ProtectedRoute>} />
              <Route path="/amigos" element={<ProtectedRoute><FriendsPage /></ProtectedRoute>} />
              <Route path="/notifications" element={<ProtectedRoute><NotificationsPage /></ProtectedRoute>} />
              <Route path="/comunidade" element={<Community />} />
              <Route path="/trips" element={<TripsPage />} />
              <Route path="/trips/new" element={<ProtectedRoute><TripCreatePage /></ProtectedRoute>} />
              <Route path="/trips/:id" element={<TripDetailPage />} />
              <Route path="/trips/:id/edit" element={<ProtectedRoute><TripEditPage /></ProtectedRoute>} />
              <Route path="/produtos" element={<ProductCategory />} />
              <Route path="/produtos/:slug" element={<ProductCategory />} />
              <Route path="/produto/:id" element={<ProductDetail />} />
              <Route path="/checkout" element={<ProtectedRoute><div className="pt-24 pb-24 md:pb-16 px-4 max-w-7xl mx-auto"><CartCheckout /></div></ProtectedRoute>} />
              <Route path="*" element={<NotFound />} />
            </Routes>
            </Suspense>
            <BottomNav />
            <InstallAppBanner />
            <Analytics />
          </BrowserRouter>
          </CartProvider>
        </FavoritesProvider>
      </ThemeProvider>
    </LanguageProvider>
  )
}
