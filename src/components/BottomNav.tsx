import { useLocation, useNavigate } from 'react-router-dom'
import { useLanguage } from '../contexts/LanguageContext'
import { useFavorites } from '../contexts/FavoritesContext'
import { useCart } from '../contexts/CartContext'

const NAV_ITEMS = [
  { path: '/', icon: 'home', labelKey: 'navHome' },
  { path: '/experiencias', icon: 'exp', labelKey: 'expTitle' },
  { path: '/checkout', icon: 'cart', labelKey: 'cartTitle' },
  { path: '/favoritos', icon: 'heart', labelKey: 'favorites' },
  { path: '/perfil', icon: 'user', labelKey: 'navProfile' },
] as const

const ADMIN_NAV_ITEMS = [
  { tab: 'dashboard', icon: 'dash', labelKey: 'adminOverview' },
  { tab: 'bookings', icon: 'calendar', labelKey: 'adminBookings' },
  { tab: 'experiences', icon: 'exp', labelKey: 'adminExperiences' },
  { tab: 'products', icon: 'box', labelKey: 'adminProducts' },
  { tab: '__home', icon: 'home', labelKey: 'adminBackToSite' },
] as const

export default function BottomNav() {
  const location = useLocation()
  const navigate = useNavigate()
  const { t } = useLanguage()
  const { getFavoritesCount } = useFavorites()
  const { getItemCount } = useCart()
  const favoritesCount = getFavoritesCount()
  const cartCount = getItemCount()

  const isAdminRoute = location.pathname.startsWith('/admin')
  const activeAdminTab = new URLSearchParams(location.search).get('tab') || 'dashboard'

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/'
    return location.pathname.startsWith(path)
  }

  const icons: Record<string, JSX.Element> = {
    home: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>,
    exp: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
    cart: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" /></svg>,
    heart: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>,
    user: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>,
    dash: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>,
    calendar: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>,
    box: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>,
  }

  if (isAdminRoute) {
    return (
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 dark:bg-[#1a0f08]/95 backdrop-blur-lg border-t border-gray-200 dark:border-white/[0.06] safe-area-pb">
        <div className="flex items-center justify-around h-16 px-1">
          {ADMIN_NAV_ITEMS.map((item) => {
            const active = item.tab !== '__home' && activeAdminTab === item.tab
            const isHome = item.tab === '__home'
            return (
              <button
                key={item.tab}
                onClick={() => isHome ? navigate('/') : navigate(`/admin?tab=${item.tab}`)}
                className={`relative flex flex-col items-center justify-center gap-0.5 w-14 h-14 rounded-2xl transition-all duration-200 ${
                  active
                    ? 'text-amz-dourado'
                    : 'text-gray-400 dark:text-white/30 active:scale-95'
                }`}
              >
                {icons[item.icon]}
                <span className="text-[9px] font-medium leading-none">{(t as any)[item.labelKey]?.split(' ')[0] || ''}</span>
                {active && (
                  <div className="absolute -bottom-0.5 w-5 h-0.5 rounded-full bg-amz-dourado" />
                )}
              </button>
            )
          })}
        </div>
      </nav>
    )
  }

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 dark:bg-[#1a0f08]/95 backdrop-blur-lg border-t border-gray-200 dark:border-white/[0.06] safe-area-pb">
      <div className="flex items-center justify-around h-16 px-1">
        {NAV_ITEMS.map((item) => {
          const active = isActive(item.path)
          const isCart = item.icon === 'cart'
          const isHeart = item.icon === 'heart'
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`relative flex flex-col items-center justify-center gap-0.5 w-14 h-14 rounded-2xl transition-all duration-200 ${
                active
                  ? 'text-amz-dourado'
                  : 'text-gray-400 dark:text-white/30 active:scale-95'
              }`}
            >
              <div className="relative">
                {icons[item.icon]}
                {isCart && cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-2 w-4 h-4 bg-amz-dourado text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
                {isHeart && favoritesCount > 0 && (
                  <span className="absolute -top-1.5 -right-2 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                    {favoritesCount}
                  </span>
                )}
              </div>
              <span className="text-[9px] font-medium leading-none">{(t as any)[item.labelKey]?.split(' ')[0] || ''}</span>
              {active && (
                <div className="absolute -bottom-0.5 w-5 h-0.5 rounded-full bg-amz-dourado" />
              )}
            </button>
          )
        })}
      </div>
    </nav>
  )
}
