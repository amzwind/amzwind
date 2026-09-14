import { useState, useEffect, useMemo } from 'react'
import { useParams, Link } from 'react-router-dom'
import { supabase, type Tables } from '../services/supabase'
import { useLanguage } from '../contexts/LanguageContext'
import Header from '../components/Header'
import Footer from '../components/Footer'
import FavoriteButton from '../components/FavoriteButton'
import { staticProducts, staticProductCategories } from '../data/products'

type Product = Tables<'products'>
type Category = Tables<'categories'>
type SortMode = 'featured' | 'price-asc' | 'price-desc' | 'title'

const fallbackProducts = staticProducts.map((product) => ({
  id: product.id,
  title: product.title,
  description: product.description,
  price: product.price,
  stock: product.stock,
  image_url: product.image_url,
  category_id: product.category_id,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
}) as Product)

export default function ProductCategory() {
  const { slug } = useParams<{ slug: string }>()
  const { t } = useLanguage()
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [activeCategory, setActiveCategory] = useState<string>(slug || 'all')
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState<SortMode>('featured')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const [pRes, cRes] = await Promise.all([
          supabase.from('products').select('*').order('created_at', { ascending: false }),
          supabase.from('categories').select('*').eq('type', 'product').order('name'),
        ])

        if (pRes.error) throw pRes.error
        if (cRes.error) throw cRes.error

        setProducts(pRes.data && pRes.data.length > 0 ? pRes.data : fallbackProducts)
        setCategories(cRes.data && cRes.data.length > 0 ? cRes.data : (staticProductCategories as Category[]))
      } catch {
        setProducts(fallbackProducts)
        setCategories(staticProductCategories as Category[])
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  useEffect(() => {
    if (slug) setActiveCategory(slug)
  }, [slug])

  const filtered = useMemo(() => {
    const query = searchTerm.trim().toLowerCase()
    let result = activeCategory === 'all'
      ? [...products]
      : products.filter((p) => {
          const cat = categories.find((c) => c.id === p.category_id)
          return cat?.slug === activeCategory || p.category_id === activeCategory
        })

    if (query) {
      result = result.filter((p) => {
        const haystack = [p.title, p.description].filter(Boolean).join(' ').toLowerCase()
        return haystack.includes(query)
      })
    }

    switch (sortBy) {
      case 'price-asc':
        return result.sort((a, b) => a.price - b.price)
      case 'price-desc':
        return result.sort((a, b) => b.price - a.price)
      case 'title':
        return result.sort((a, b) => a.title.localeCompare(b.title))
      default:
        return result.sort((a, b) => Number(b.stock > 0) - Number(a.stock > 0) || a.title.localeCompare(b.title))
    }
  }, [products, categories, activeCategory, searchTerm, sortBy])

  return (
    <div className="min-h-screen bg-amz-areia dark:bg-amz-terra-dark transition-colors duration-500">
      <Header />

      <div className="pt-24 pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <p className="section-subtitle mb-2">{t.prodCategoryTitle}</p>
            <h1 className="section-title dark:text-amz-areia">{t.prodCategoryTitle}</h1>
          </div>

          {!loading && (
            <div className="mb-8 space-y-4">
              <div className="relative mx-auto max-w-xl">
                <input
                  aria-label="Buscar produto"
                  placeholder="Buscar produto..."
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  className="w-full rounded-2xl border border-amz-areia-dark/20 bg-white px-4 py-3 pr-11 text-sm text-amz-terra outline-none transition focus:border-amz-dourado focus:ring-2 focus:ring-amz-dourado/20 dark:border-white/10 dark:bg-white/5 dark:text-amz-areia"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-amz-terra-light dark:text-white/30">
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35m1.85-5.15a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </span>
              </div>

              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div className="flex flex-wrap justify-center gap-2 md:justify-start">
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

                <label className="flex items-center gap-2 self-end text-xs font-semibold uppercase tracking-[0.2em] text-amz-terra-light dark:text-white/40">
                  <span>Ordenar</span>
                  <select
                    value={sortBy}
                    onChange={(event) => setSortBy(event.target.value as SortMode)}
                    className="rounded-xl border border-amz-areia-dark/20 bg-white px-3 py-2 text-xs font-medium text-amz-terra outline-none focus:border-amz-dourado dark:border-white/10 dark:bg-white/5 dark:text-amz-areia"
                  >
                    <option value="featured">Destaques</option>
                    <option value="price-asc">Preço: menor</option>
                    <option value="price-desc">Preço: maior</option>
                    <option value="title">Título</option>
                  </select>
                </label>
              </div>
            </div>
          )}

          {loading ? (
            <div className="flex justify-center py-16">
              <div className="w-8 h-8 border-4 border-amz-dourado border-t-transparent rounded-full animate-spin" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-amz-terra-light dark:text-amz-areia/40">
                {searchTerm
                  ? `Nenhum produto encontrado para “${searchTerm}”.`
                  : t.adminNoResults}
              </p>
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="mt-4 inline-flex items-center rounded-full bg-amz-dourado px-4 py-2 text-sm font-semibold text-white"
                >
                  Limpar busca
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {filtered.map((p) => (
                <Link key={p.id} to={`/produto/${p.id}`} className="bg-white dark:bg-white/5 rounded-2xl overflow-hidden border border-amz-areia-dark/20 dark:border-white/5 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group relative">
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
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  )
}
