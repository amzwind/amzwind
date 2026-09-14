import { Link, useNavigate } from 'react-router-dom'
import { useLanguage } from '../contexts/LanguageContext'
import { supabase, type Tables } from '../services/supabase'
import { useEffect, useState, useMemo } from 'react'
import { portraitImages, heroDesktopFallback } from '../data/media'
import { staticExperiences } from '../data/experiences'
import FavoriteButton from '../components/FavoriteButton'
import Header from '../components/Header'
import Footer from '../components/Footer'

type Experience = Tables<'experiences'>
type Category = Tables<'categories'>
type SortMode = 'featured' | 'price-asc' | 'price-desc' | 'title'

const FALLBACK_IMAGES = [
  portraitImages[0]?.src, portraitImages[5]?.src, portraitImages[10]?.src, portraitImages[15]?.src, portraitImages[20]?.src,
].filter(Boolean)

const fallbackExperiences = staticExperiences.map((exp) => ({
  id: exp.id,
  title: exp.title,
  slug: exp.id,
  description: exp.description,
  category_id: '',
  price: exp.price,
  duration: exp.duration,
  level: exp.level,
  community: exp.community,
  image_url: exp.image_url,
  video_url: null,
  featured: false,
  type: exp.type,
  includes: exp.includes ?? null,
  original_price: exp.originalPrice ?? null,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
}) as Experience)

function getExpFallback(id: string): string {
  const hash = id.split('').reduce((a, c) => a + c.charCodeAt(0), 0)
  return FALLBACK_IMAGES[hash % FALLBACK_IMAGES.length] || heroDesktopFallback.src
}

export default function ExperienciasPage() {
  const { t } = useLanguage()
  const navigate = useNavigate()
  const [experiences, setExperiences] = useState<Experience[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [activeCategory, setActiveCategory] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState<SortMode>('featured')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadExperiences()
  }, [])

  async function loadExperiences() {
    try {
      const [expRes, catRes] = await Promise.all([
        supabase.from('experiences').select('*').order('title'),
        supabase.from('categories').select('*').eq('type', 'experience').order('name'),
      ])

      if (expRes.error) throw expRes.error
      if (catRes.error) throw catRes.error

      const nextExperiences = expRes.data && expRes.data.length > 0 ? expRes.data : fallbackExperiences
      setExperiences(nextExperiences)
      setCategories(catRes.data ?? [])
    } catch {
      setExperiences(fallbackExperiences)
      setCategories([])
    } finally {
      setLoading(false)
    }
  }

  const filtered = useMemo(() => {
    const query = searchTerm.trim().toLowerCase()
    let result = activeCategory === 'all' ? [...experiences] : experiences.filter((exp) => exp.category_id === activeCategory)

    if (query) {
      result = result.filter((exp) => {
        const haystack = [exp.title, exp.description, exp.level, exp.community]
          .filter(Boolean)
          .join(' ')
          .toLowerCase()

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
        return result.sort((a, b) => (b.featured === true ? 1 : 0) - (a.featured === true ? 1 : 0) || a.title.localeCompare(b.title))
    }
  }, [experiences, activeCategory, searchTerm, sortBy])

  const getExperienceImage = (exp: Experience) => {
    if (exp.image_url) return exp.image_url
    if (exp.video_url) {
      const match = exp.video_url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/)
      if (match) return `https://img.youtube.com/vi/${match[1]}/hqdefault.jpg`
    }
    return getExpFallback(exp.id)
  }

  const formatBRL = (v: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v)

  return (
    <div className="min-h-screen bg-amz-areia dark:bg-amz-terra-dark">
      <Header />

      {/* Hero Header */}
      <div className="relative bg-gradient-to-br from-amz-terra to-amz-terra-dark text-white pt-28 pb-12 px-4">
        <div className="absolute inset-0 bg-patterns opacity-10 pointer-events-none" />
        <div className="relative max-w-4xl mx-auto">
          {/* Back Button */}
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-2 text-white/70 hover:text-white text-sm font-medium mb-6 transition-colors group"
          >
            <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            {t.navHome}
          </button>

          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-amz-dourado mb-3">
              {t.expLabel}
            </p>
            <h1 className="text-3xl md:text-4xl font-maybug mb-4">
              {t.expTitle}
            </h1>
            <p className="text-sm text-white/60 max-w-md mx-auto">
              {t.expSubtitle}
            </p>
          </div>
        </div>
      </div>

      {/* Experiences Grid */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {!loading && (
          <div className="mb-8 space-y-4">
            <div className="relative">
              <input
                aria-label="Buscar experiência"
                placeholder="Buscar experiência..."
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
              {categories.length > 0 && (
                <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                  <button
                    onClick={() => setActiveCategory('all')}
                    className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                      activeCategory === 'all'
                        ? 'bg-amz-dourado text-white shadow-md'
                        : 'bg-white dark:bg-white/5 text-amz-terra dark:text-amz-areia border border-amz-areia-dark/20 dark:border-white/5 hover:border-amz-dourado hover:text-amz-dourado'
                    }`}
                  >
                    Todas
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setActiveCategory(cat.id)}
                      className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                        activeCategory === cat.id
                          ? 'bg-amz-dourado text-white shadow-md'
                          : 'bg-white dark:bg-white/5 text-amz-terra dark:text-amz-areia border border-amz-areia-dark/20 dark:border-white/5 hover:border-amz-dourado hover:text-amz-dourado'
                      }`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              )}

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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white dark:bg-white/[0.03] rounded-2xl overflow-hidden animate-pulse">
                <div className="h-48 bg-gray-200 dark:bg-white/5" />
                <div className="p-5 space-y-3">
                  <div className="h-4 bg-gray-200 dark:bg-white/5 rounded w-1/3" />
                  <div className="h-6 bg-gray-200 dark:bg-white/5 rounded w-2/3" />
                  <div className="h-16 bg-gray-200 dark:bg-white/5 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 rounded-2xl bg-gray-100 dark:bg-white/5 flex items-center justify-center mx-auto mb-4 text-gray-300 dark:text-white/20">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <p className="text-gray-500 dark:text-white/40">
              {searchTerm
                ? `Nenhuma experiência encontrada para “${searchTerm}”.`
                : activeCategory === 'all'
                  ? 'Nenhuma experiência disponível no momento.'
                  : 'Nenhuma experiência encontrada nesta categoria.'}
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filtered.map((exp) => (
              <Link
                key={exp.id}
                to={`/experiencia/${exp.id}`}
                className="group block rounded-2xl overflow-hidden bg-white dark:bg-white/[0.03] border border-gray-100 dark:border-white/[0.06] hover:shadow-lg hover:border-gray-200 dark:hover:border-white/[0.1] transition-all duration-300 active:scale-[0.98]"
              >
                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={getExperienceImage(exp)}
                    alt={exp.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute top-3 right-3">
                    <FavoriteButton id={exp.id} type="experience" title={exp.title} price={exp.price} image_url={exp.image_url} size="sm" />
                  </div>
                  <div className="absolute bottom-3 left-3 right-3">
                    <div className="flex items-center gap-2 mb-1">
                      {exp.level && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amz-dourado/80 text-white">
                          {exp.level}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-amz-dourado transition-colors mb-2">
                    {exp.title}
                  </h3>
                  {exp.description && (
                    <p className="text-sm text-gray-500 dark:text-white/40 line-clamp-2 mb-4">
                      {exp.description}
                    </p>
                  )}
                  <div className="flex items-center justify-between text-xs text-gray-400 dark:text-white/30 pt-3 border-t border-gray-100 dark:border-white/[0.06]">
                    <div className="flex items-center gap-4">
                      {exp.duration && (
                        <span className="flex items-center gap-1">
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {exp.duration}
                        </span>
                      )}
                    </div>
                    <span className="font-bold text-amz-dourado">
                      {formatBRL(exp.price)}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}
