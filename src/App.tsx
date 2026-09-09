import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { LanguageProvider } from './contexts/LanguageContext'
import { ThemeProvider } from './contexts/ThemeContext'
import SplashScreen from './components/SplashScreen'
import Home from './pages/Home'
import AdminDashboard from './pages/AdminDashboard'

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
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/admin" element={<AdminDashboard />} />
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </LanguageProvider>
  )
}
