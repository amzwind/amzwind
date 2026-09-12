import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { supabase, type Tables } from '../services/supabase'
import { useLanguage } from '../contexts/LanguageContext'
import Header from '../components/Header'
import Footer from '../components/Footer'
import FavoriteButton from '../components/FavoriteButton'

type Product = Tables<'products'>
type Category = Tables<'categories'>

export default function ProductCategory() {
  const { slug } = useParams<{ slug: string }>()
  const { t } = useLanguage()
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [activeCategory, setActiveCategory] = useState<string>(slug || 'all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const [pRes, cRes] = await Promise.all([
        supabase.from('products').select('*').order('created_at', { ascending: false }),
        supabase.from('categories').select('*').eq('type', 'product').order('name'),
      ])
      if (pRes.data) setProducts(pRes.data)
      if (cRes.data) setCategories(cRes.data)
      setLoading(false)
    }
    load()
  }, [])

  useEffect(() => {
    if (slug) setActiveCategory(slug)
  }, [slug])

  const filtered = activeCategory === 'all'
    ? products
    : products.filter((p) => {
        const cat = categories.find((c) => c.id === p.category_id)
        return cat?.slug === activeCategory
      })

  return (
    <div className="min-h-screen bg-amz-areia dark:bg-amz-terra-dark transition-colors duration-500">
      <Header />

      <div className="pt-24 pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <p className="section-subtitle mb-2">{t.prodCategoryTitle}</p>
            <h1 className="section-title dark:text-amz-areia">{t.prodCategoryTitle}</h1>
          </div>

          {/* Category filters */}
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            <button
              onClick={() => setActiveCategory('all')}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                activeCategory === 'all'
                  ? 'bg-amz-dourado text-white'
                  : 'bg-white dark:bg-white/5 text-amz-terra dark:text-amz-areia border border-amz-areia-dark/20 dark:border-white/5 hover:border-amz-dourado'
              }`}
            >
              {t.prodCategoryAll}
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.slug)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                  activeCategory === cat.slug
                    ? 'bg-amz-dourado text-white'
                    : 'bg-white dark:bg-white/5 text-amz-terra dark:text-amz-areia border border-amz-areia-dark/20 dark:border-white/5 hover:border-amz-dourado'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="flex justify-center py-16">
              <div className="w-8 h-8 border-4 border-amz-dourado border-t-transparent rounded-full animate-spin" />
            </div>
          ) : filtered.length === 0 ? (
            <p className="text-center text-amz-terra-light dark:text-amz-areia/40 py-16">{t.adminNoResults}</p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {filtered.map((p) => (
                <a key={p.id} href={`/produto/${p.id}`} className="bg-white dark:bg-white/5 rounded-2xl overflow-hidden border border-amz-areia-dark/20 dark:border-white/5 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group relative">
                  {p.image_url ? (
                    <div className="h-40 overflow-hidden"><img src={p.image_url} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" /></div>
                  ) : (
                    <div className="h-40 bg-amz-areia-dark/10 dark:bg-white/5 flex items-center justify-center text-3xl">📦</div>
                  )}
                  <div className="absolute top-2 right-2">
                    <FavoriteButton id={p.id} type="product" title={p.title} price={p.price} image_url={p.image_url} size="sm" />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-amz-terra dark:text-amz-areia text-sm truncate">{p.title}</h3>
                    <p className="text-xs text-amz-terra-light dark:text-amz-areia/40 mt-1 line-clamp-2">{p.description || '—'}</p>
                    <div className="flex items-center justify-between mt-3">
                      <span className="font-maybug text-amz-dourado">R$ {Number(p.price).toFixed(2)}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${p.stock > 0 ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400' : 'bg-red-50 text-red-500 dark:bg-red-500/10 dark:text-red-400'}`}>
                        {p.stock > 0 ? t.prodDetailInStock : t.prodDetailOutOfStock}
                      </span>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  )
}
