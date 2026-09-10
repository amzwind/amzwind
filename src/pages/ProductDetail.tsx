import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { supabase, type Tables } from '../services/supabase'
import { useLanguage } from '../contexts/LanguageContext'
import { useCart } from '../contexts/CartContext'
import Header from '../components/Header'
import Footer from '../components/Footer'

type Product = Tables<'products'>

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>()
  const { t } = useLanguage()
  const { addItem, items } = useCart()
  const [product, setProduct] = useState<Product | null>(null)
  const [related, setRelated] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [qty, setQty] = useState(1)
  const [added, setAdded] = useState(false)

  useEffect(() => {
    if (!id) return
    async function load() {
      const { data } = await supabase.from('products').select('*').eq('id', id).single()
      if (data) {
        setProduct(data)
        const { data: rel } = await supabase.from('products').select('*').eq('category_id', data.category_id).neq('id', data.id).limit(4)
        if (rel) setRelated(rel)
      }
      setLoading(false)
    }
    load()
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen bg-amz-areia dark:bg-amz-terra-dark flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-amz-dourado border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-amz-areia dark:bg-amz-terra-dark">
        <Header />
        <div className="pt-24 pb-16 px-4 flex flex-col items-center justify-center min-h-[60vh]">
          <p className="text-lg text-amz-terra dark:text-amz-areia mb-4">Produto não encontrado.</p>
          <Link to="/produtos" className="btn-primary text-sm">{t.adminBack}</Link>
        </div>
        <Footer />
      </div>
    )
  }

  const p = product
  const inStock = p.stock > 0
  const cartItem = items.find((i) => i.id === p.id && i.type === 'product')
  const cartQty = cartItem?.quantity ?? 0

  function handleAdd() {
    addItem({ id: p.id, type: 'product', title: p.title, price: p.price, image_url: p.image_url })
    setAdded(true)
    setTimeout(() => setAdded(false), 3000)
  }

  return (
    <div className="min-h-screen bg-amz-areia dark:bg-amz-terra-dark transition-colors duration-500">
      <Header />

      {/* Toast */}
      {added && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[60] bg-emerald-600 text-white px-5 py-3 rounded-xl shadow-2xl text-sm font-semibold flex items-center gap-2 animate-[slideDown_0.3s_ease-out]">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
          Adicionado ao carrinho!
        </div>
      )}

      <div className="pt-24 pb-16 px-4">
        <div className="max-w-5xl mx-auto">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-amz-terra-light dark:text-amz-areia/40 mb-8">
            <Link to="/" className="hover:text-amz-oceano dark:hover:text-amz-dourado transition-colors">Home</Link>
            <span>/</span>
            <Link to="/produtos" className="hover:text-amz-oceano dark:hover:text-amz-dourado transition-colors">{t.prodCategoryTitle}</Link>
            <span>/</span>
            <span className="text-amz-terra dark:text-amz-areia font-medium truncate">{p.title}</span>
          </nav>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Image */}
            <div className="rounded-3xl overflow-hidden bg-white dark:bg-white/5 border border-amz-areia-dark/20 dark:border-white/5">
              {p.image_url ? (
                <img src={p.image_url} alt={p.title} className="w-full h-[400px] object-cover" />
              ) : (
                <div className="w-full h-[400px] flex items-center justify-center text-6xl">📦</div>
              )}
            </div>

            {/* Info */}
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-maybug text-amz-terra dark:text-amz-areia">{p.title}</h1>
                <p className="text-2xl font-maybug text-amz-dourado mt-3">R$ {Number(p.price).toFixed(2)}</p>
              </div>

              <div className="flex items-center gap-3">
                <span className={`text-xs font-bold px-3 py-1 rounded-full ${inStock ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400' : 'bg-red-50 text-red-500 dark:bg-red-500/10 dark:text-red-400'}`}>
                  {inStock ? `${t.prodDetailInStock} (${p.stock})` : t.prodDetailOutOfStock}
                </span>
                {cartQty > 0 && (
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-amz-dourado/10 text-amz-dourado">
                    {cartQty} no carrinho
                  </span>
                )}
              </div>

              {p.description && (
                <div className="bg-white dark:bg-white/5 rounded-2xl p-5 border border-amz-areia-dark/20 dark:border-white/5">
                  <h3 className="font-semibold text-amz-terra dark:text-amz-areia mb-2">{t.prodDetailDescription}</h3>
                  <p className="text-sm text-amz-terra-light dark:text-amz-areia/60 leading-relaxed">{p.description}</p>
                </div>
              )}

              {inStock ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center border border-amz-areia-dark/20 dark:border-white/10 rounded-xl overflow-hidden">
                      <button onClick={() => setQty(Math.max(1, qty - 1))} className="px-4 py-3 text-amz-terra dark:text-amz-areia hover:bg-amz-areia dark:hover:bg-white/5 transition-colors text-lg">−</button>
                      <span className="px-4 py-3 font-semibold text-amz-terra dark:text-amz-areia min-w-[48px] text-center">{qty}</span>
                      <button onClick={() => setQty(Math.min(p.stock, qty + 1))} className="px-4 py-3 text-amz-terra dark:text-amz-areia hover:bg-amz-areia dark:hover:bg-white/5 transition-colors text-lg">+</button>
                    </div>
                    <button onClick={handleAdd} className="btn-primary flex-1 !py-3.5">
                      {t.prodDetailAddToCart}
                    </button>
                  </div>

                  {added && (
                    <div className="flex gap-3">
                      <Link to="/produtos" className="flex-1 text-center py-2.5 rounded-xl text-sm font-semibold border border-amz-areia-dark/20 dark:border-white/10 text-amz-terra dark:text-amz-areia hover:bg-amz-areia dark:hover:bg-white/5 transition-colors">
                        Continuar Comprando
                      </Link>
                      <Link to="/checkout" className="flex-1 text-center py-2.5 rounded-xl text-sm font-semibold bg-amz-dourado text-white hover:bg-amber-700 transition-colors">
                        Ver Carrinho
                      </Link>
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-red-50 dark:bg-red-500/10 rounded-2xl p-5 text-center">
                  <p className="text-sm text-red-600 dark:text-red-400 font-semibold">Este produto está esgotado no momento.</p>
                  <Link to="/produtos" className="inline-block mt-3 text-sm text-amz-dourado hover:underline font-semibold">Ver outros produtos</Link>
                </div>
              )}
            </div>
          </div>

          {/* Related */}
          {related.length > 0 && (
            <div className="mt-16">
              <h3 className="font-maybug text-xl text-amz-terra dark:text-amz-areia mb-6">{t.prodDetailRelated}</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {related.map((r) => (
                  <Link key={r.id} to={`/produto/${r.id}`} className="bg-white dark:bg-white/5 rounded-2xl overflow-hidden border border-amz-areia-dark/20 dark:border-white/5 hover:shadow-lg transition-all group">
                    {r.image_url && <div className="h-28 overflow-hidden"><img src={r.image_url} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform" /></div>}
                    <div className="p-3">
                      <p className="text-sm font-semibold text-amz-terra dark:text-amz-areia truncate">{r.title}</p>
                      <p className="text-xs text-amz-dourado font-bold mt-1">R$ {Number(r.price).toFixed(2)}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  )
}
