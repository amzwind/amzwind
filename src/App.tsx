import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { LanguageProvider } from './contexts/LanguageContext'
import { ThemeProvider } from './contexts/ThemeContext'
import { CartProvider } from './contexts/CartContext'
import SplashScreen from './components/SplashScreen'
import InstallAppBanner from './components/InstallAppBanner'
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
        <CartProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/sobre" element={<Sobre />} />
              <Route path="/login" element={<Login />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/minha-conta" element={<CustomerDashboard />} />
              <Route path="/perfil" element={<UserProfile />} />
              <Route path="/experiencia/:id" element={<ExperienceDetail />} />
              <Route path="/produtos" element={<ProductCategory />} />
              <Route path="/produtos/:slug" element={<ProductCategory />} />
              <Route path="/produto/:id" element={<ProductDetail />} />
              <Route path="/checkout" element={<div className="pt-24 pb-16 px-4 max-w-7xl mx-auto"><CartCheckout /></div>} />
              <Route path="*" element={<Home />} />
            </Routes>
            <InstallAppBanner />
            <Analytics />
          </BrowserRouter>
        </CartProvider>
      </ThemeProvider>
    </LanguageProvider>
  )
}
