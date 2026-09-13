import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { LanguageProvider } from './contexts/LanguageContext'
import { ThemeProvider } from './contexts/ThemeContext'
import { CartProvider } from './contexts/CartContext'
import { FavoritesProvider } from './contexts/FavoritesContext'
import SplashScreen from './components/SplashScreen'
import InstallAppBanner from './components/InstallAppBanner'
import { ProtectedRoute } from './components/ProtectedRoute'
import Home from './pages/Home'
import Sobre from './pages/Sobre'
import { AdminDashboard } from './pages/AdminDashboard'
import Login from './pages/Login'
import ExperienceDetail from './pages/ExperienceDetail'
import ProductCategory from './pages/ProductCategory'
import ProductDetail from './pages/ProductDetail'
import CustomerDashboard from './pages/CustomerDashboard'
import UserProfile from './pages/UserProfile'
import CartCheckout from './components/CartCheckout'
import BottomNav from './components/BottomNav'
import GaleriaPage from './pages/GaleriaPage'
import ExperienciasPage from './pages/ExperienciasPage'
import KiteCoursePage from './pages/KiteCoursePage'
import WishlistPage from './pages/WishlistPage'
import ConversationsList from './pages/ConversationsList'
import Chat from './pages/Chat'
import FriendsPage from './pages/FriendsPage'
import NotificationsPage from './pages/NotificationsPage'
import Community from './pages/Community'
import TripsPage from './pages/TripsPage'
import TripDetailPage from './pages/TripDetailPage'
import TripCreatePage from './pages/TripCreatePage'
import TripEditPage from './pages/TripEditPage'
import { Analytics } from '@vercel/analytics/react'

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
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/sobre" element={<Sobre />} />
              <Route path="/galeria" element={<GaleriaPage />} />
              <Route path="/experiencias" element={<ExperienciasPage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
              <Route path="/minha-conta" element={<CustomerDashboard />} />
              <Route path="/perfil" element={<UserProfile />} />
              <Route path="/experiencia/:id" element={<ExperienceDetail />} />
              <Route path="/aula/iniciante" element={<KiteCoursePage />} />
              <Route path="/favoritos" element={<WishlistPage />} />
              <Route path="/conversas" element={<ConversationsList />} />
              <Route path="/chat/:id" element={<Chat />} />
              <Route path="/amigos" element={<FriendsPage />} />
              <Route path="/notifications" element={<NotificationsPage />} />
              <Route path="/comunidade" element={<Community />} />
              <Route path="/trips" element={<TripsPage />} />
              <Route path="/trips/new" element={<TripCreatePage />} />
              <Route path="/trips/:id" element={<TripDetailPage />} />
              <Route path="/trips/:id/edit" element={<TripEditPage />} />
              <Route path="/produtos" element={<ProductCategory />} />
              <Route path="/produtos/:slug" element={<ProductCategory />} />
              <Route path="/produto/:id" element={<ProductDetail />} />
              <Route path="/checkout" element={<div className="pt-24 pb-24 md:pb-16 px-4 max-w-7xl mx-auto"><CartCheckout /></div>} />
              <Route path="*" element={<Home />} />
            </Routes>
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
