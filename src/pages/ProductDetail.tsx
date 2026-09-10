import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase, type Tables } from '../services/supabase'
import { useLanguage } from '../contexts/LanguageContext'
import { useCart } from '../contexts/CartContext'
import Header from '../components/Header'
import Footer from '../components/Footer'

type Product = Tables<'products'>

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { t } = useLanguage()
  const { addItem } = useCart()
  const [product, setProduct] = useState<Product | null>(null)
  const [related, setRelated] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [qty, setQty] = useState(1)

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
      <div className="min-h-screen bg-amz-areia dark:bg-amz-terra-dark flex items-center justify-center">
        <p className="text-amz-terra dark:text-amz-areia">Produto não encontrado.</p>
      </div>
    )
  }

  function handleAdd() {
    if (!product) return
    for (let i = 0; i < qty; i++) {
      addItem({ id: product.id, type: 'product', title: product.title, price: product.price, image_url: product.image_url })
    }
    navigate('/admin')
  }

  const inStock = (product?.stock ?? 0) > 0

  return (
    <div className="min-h-screen bg-amz-areia dark:bg-amz-terra-dark transition-colors duration-500">
      <Header />

      <div className="pt-24 pb-16 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Image */}
            <div className="rounded-3xl overflow-hidden bg-white dark:bg-white/5 border border-amz-areia-dark/20 dark:border-white/5">
              {product.image_url ? (
                <img src={product.image_url} alt={product.title} className="w-full h-[400px] object-cover" />
              ) : (
                <div className="w-full h-[400px] flex items-center justify-center text-6xl">📦</div>
              )}
            </div>

            {/* Info */}
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-maybug text-amz-terra dark:text-amz-areia">{product.title}</h1>
                <p className="text-2xl font-maybug text-amz-dourado mt-3">R$ {Number(product.price).toFixed(2)}</p>
              </div>

              <div className="flex items-center gap-2">
                <span className={`text-xs font-bold px-3 py-1 rounded-full ${inStock ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400' : 'bg-red-50 text-red-500 dark:bg-red-500/10 dark:text-red-400'}`}>
                  {inStock ? `${t.prodDetailInStock} (${product.stock})` : t.prodDetailOutOfStock}
                </span>
              </div>

              {product.description && (
                <div className="bg-white dark:bg-white/5 rounded-2xl p-5 border border-amz-areia-dark/20 dark:border-white/5">
                  <h3 className="font-semibold text-amz-terra dark:text-amz-areia mb-2">{t.prodDetailDescription}</h3>
                  <p className="text-sm text-amz-terra-light dark:text-amz-areia/60 leading-relaxed">{product.description}</p>
                </div>
              )}

              {inStock && (
                <div className="flex items-center gap-4">
                  <div className="flex items-center border border-amz-areia-dark/20 dark:border-white/10 rounded-xl overflow-hidden">
                    <button onClick={() => setQty(Math.max(1, qty - 1))} className="px-4 py-3 text-amz-terra dark:text-amz-areia hover:bg-amz-areia dark:hover:bg-white/5 transition-colors">−</button>
                    <span className="px-4 py-3 font-semibold text-amz-terra dark:text-amz-areia min-w-[48px] text-center">{qty}</span>
                    <button onClick={() => setQty(Math.min(product.stock, qty + 1))} className="px-4 py-3 text-amz-terra dark:text-amz-areia hover:bg-amz-areia dark:hover:bg-white/5 transition-colors">+</button>
                  </div>
                  <button onClick={handleAdd} className="btn-primary flex-1 !py-3.5">
                    {t.prodDetailAddToCart}
                  </button>
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
                  <a key={r.id} href={`/produto/${r.id}`} className="bg-white dark:bg-white/5 rounded-2xl overflow-hidden border border-amz-areia-dark/20 dark:border-white/5 hover:shadow-lg transition-all group">
                    {r.image_url && <div className="h-28 overflow-hidden"><img src={r.image_url} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform" /></div>}
                    <div className="p-3">
                      <p className="text-sm font-semibold text-amz-terra dark:text-amz-areia truncate">{r.title}</p>
                      <p className="text-xs text-amz-dourado font-bold mt-1">R$ {Number(r.price).toFixed(2)}</p>
                    </div>
                  </a>
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
