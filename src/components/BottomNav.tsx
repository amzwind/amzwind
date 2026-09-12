import { useLocation, useNavigate } from 'react-router-dom'
import { useLanguage } from '../contexts/LanguageContext'
import { useCart } from '../contexts/CartContext'

const NAV_ITEMS = [
  { path: '/', icon: 'home', labelKey: 'navHome' },
  { path: '/experiencia', icon: 'exp', labelKey: 'expTitle' },
  { path: '/checkout', icon: 'cart', labelKey: 'cartTitle' },
  { path: '/minha-conta', icon: 'user', labelKey: 'cartMyBookings' },
] as const

export default function BottomNav() {
  const location = useLocation()
  const navigate = useNavigate()
  const { t } = useLanguage()
  const { getItemCount } = useCart()
  const cartCount = getItemCount()

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/'
    return location.pathname.startsWith(path)
  }

  const icons: Record<string, JSX.Element> = {
    home: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>,
    exp: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
    cart: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" /></svg>,
    user: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>,
  }

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 dark:bg-[#1a0f08]/95 backdrop-blur-lg border-t border-gray-200 dark:border-white/[0.06] safe-area-pb">
      <div className="flex items-center justify-around h-16 px-2">
        {NAV_ITEMS.map((item) => {
          const active = isActive(item.path)
          const isCart = item.icon === 'cart'
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`relative flex flex-col items-center justify-center gap-0.5 w-16 h-14 rounded-2xl transition-all duration-200 ${
                active
                  ? 'text-amz-dourado'
                  : 'text-gray-400 dark:text-white/30 active:scale-95'
              }`}
            >
              <div className="relative">
                {icons[item.icon]}
                {isCart && cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-2 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </div>
              <span className="text-[10px] font-medium leading-none">{(t as any)[item.labelKey]?.split(' ')[0] || ''}</span>
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
