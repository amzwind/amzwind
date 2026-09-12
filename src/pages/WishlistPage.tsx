import { Link, useNavigate } from 'react-router-dom'
import { useFavorites, type FavoriteItem, type FavoriteItemType } from '../contexts/FavoritesContext'
import { useCart } from '../contexts/CartContext'
import { useLanguage } from '../contexts/LanguageContext'
import { useState } from 'react'
import { Toast } from '../components/admin/SharedUI'

function getItemLink(item: FavoriteItem): string {
  if (item.type === 'experience') return `/experiencia/${item.id}`
  if (item.type === 'product') return `/produto/${item.id}`
  return '/aula/iniciante'
}

function getItemTypeLabel(type: FavoriteItemType, t: any): string {
  if (type === 'experience') return t.expLabel || 'Experiência'
  if (type === 'product') return t.prodCategoryTitle || 'Produto'
  return t.customerTypeClass || 'Aula'
}

const formatBRL = (v: number) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v)

export default function WishlistPage() {
  const { t } = useLanguage()
  const navigate = useNavigate()
  const { favorites, removeFavorite } = useFavorites()
  const { addItem, items: cartItems } = useCart()
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  function handleSendToCart(item: FavoriteItem) {
    const alreadyInCart = cartItems.some((c) => c.id === item.id && c.type === item.type)
    if (alreadyInCart) {
      setToast({ message: 'Este item já está no carrinho', type: 'error' })
      return
    }
    addItem({
      id: item.id,
      type: item.type,
      title: item.title,
      price: item.price,
      image_url: item.image_url,
    })
    setToast({ message: `${item.title} adicionado ao carrinho!`, type: 'success' })
  }

  function handleRemove(item: FavoriteItem) {
    removeFavorite(item.id, item.type)
    setToast({ message: 'Removido dos favoritos', type: 'success' })
  }

  return (
    <div className="min-h-screen bg-amz-areia dark:bg-amz-terra-dark transition-colors duration-500 pb-24 md:pb-16">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div className="max-w-4xl mx-auto px-4 pt-8">
        {/* Header */}
        <div className="mb-8">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-amz-terra-light dark:text-amz-areia/50 hover:text-amz-terra dark:hover:text-amz-areia transition-colors mb-4">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            {t.adminBack}
          </button>
          <h1 className="text-2xl font-bold text-amz-terra dark:text-amz-areia">Lista de Desejos</h1>
          <p className="text-sm text-amz-terra-light dark:text-amz-areia/50 mt-1">
            Itens salvos para reserva futura
          </p>
        </div>

        {favorites.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 rounded-full bg-white dark:bg-white/5 flex items-center justify-center mx-auto mb-6 border border-amz-areia-dark/20 dark:border-white/5">
              <svg className="w-10 h-10 text-gray-300 dark:text-white/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <h2 className="text-lg font-semibold text-amz-terra dark:text-amz-areia mb-2">Nenhum favorito ainda</h2>
            <p className="text-sm text-amz-terra-light dark:text-amz-areia/50 mb-6 max-w-sm mx-auto">
              Toque no ícone de coração em qualquer experiência ou produto para salvá-lo aqui.
            </p>
            <Link to="/experiencias" className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-amz-dourado text-white hover:bg-amber-700 transition-colors inline-block">
              {t.expLabel}
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {favorites.map((item) => {
              const inCart = cartItems.some((c) => c.id === item.id && c.type === item.type)
              return (
                <div
                  key={`${item.type}-${item.id}`}
                  className="bg-white dark:bg-white/[0.03] rounded-2xl border border-amz-areia-dark/20 dark:border-white/[0.06] p-4 flex gap-4 items-center hover:shadow-md transition-shadow"
                >
                  {/* Thumbnail */}
                  <Link to={getItemLink(item)} className="flex-shrink-0">
                    {item.image_url ? (
                      <img src={item.image_url} alt={item.title} className="w-20 h-20 rounded-xl object-cover" />
                    ) : (
                      <div className="w-20 h-20 rounded-xl bg-amz-areia dark:bg-white/5 flex items-center justify-center text-2xl">
                        {item.type === 'experience' ? '🧭' : item.type === 'product' ? '📦' : '🪁'}
                      </div>
                    )}
                  </Link>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <Link to={getItemLink(item)} className="block">
                      <h3 className="text-sm font-semibold text-amz-terra dark:text-amz-areia truncate hover:text-amz-dourado transition-colors">
                        {item.title}
                      </h3>
                    </Link>
                    <p className="text-xs text-amz-terra-light dark:text-amz-areia/40 mt-0.5">
                      {getItemTypeLabel(item.type, t)}
                    </p>
                    <p className="text-sm font-bold text-amz-dourado mt-1">
                      {formatBRL(item.price)}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-2 flex-shrink-0">
                    <button
                      onClick={() => handleSendToCart(item)}
                      disabled={inCart}
                      className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors whitespace-nowrap ${
                        inCart
                          ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 cursor-default'
                          : 'bg-amz-dourado text-white hover:bg-amber-700'
                      }`}
                    >
                      {inCart ? '✓ No Carrinho' : 'Enviar ao Carrinho'}
                    </button>
                    <button
                      onClick={() => handleRemove(item)}
                      className="px-4 py-2 rounded-xl text-xs font-semibold border border-amz-areia-dark/20 dark:border-white/10 text-amz-terra-light dark:text-amz-areia/40 hover:border-red-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors whitespace-nowrap"
                    >
                      Remover
                    </button>
                  </div>
                </div>
              )
            })}

            {/* Go to Cart */}
            {cartItems.length > 0 && (
              <div className="pt-4">
                <button
                  onClick={() => navigate('/checkout')}
                  className="w-full py-3 rounded-xl bg-amz-dourado text-white font-bold text-sm hover:bg-amber-700 transition-all"
                >
                  Ver Carrinho ({cartItems.length} {cartItems.length === 1 ? 'item' : 'itens'})
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
