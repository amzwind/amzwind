import { useRef, useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../contexts/LanguageContext'
import { useTheme } from '../contexts/ThemeContext'
import { supabase } from '../services/supabase'
import { staticExperiences } from '../data/experiences'
import { portraitImages, heroDesktopFallback } from '../data/media'

const badgeColors: Record<string, string> = {
  Downwind: 'bg-amz-oceano/10 text-amz-oceano dark:bg-amz-oceano/20 dark:text-amz-oceano',
  Expedition: 'bg-amz-terra/10 text-amz-terra dark:bg-amz-terra/20 dark:text-amz-terra-light',
  'Expedição': 'bg-amz-terra/10 text-amz-terra dark:bg-amz-terra/20 dark:text-amz-terra-light',
  'Cultural Experience': 'bg-amz-dourado/10 text-amz-dourado dark:bg-amz-dourado/20 dark:text-amz-dourado',
  'Vivência Cultural': 'bg-amz-dourado/10 text-amz-dourado dark:bg-amz-dourado/20 dark:text-amz-dourado',
}

const FALLBACK_IMAGES = [
  portraitImages[0]?.src,
  portraitImages[5]?.src,
  portraitImages[10]?.src,
  portraitImages[15]?.src,
  portraitImages[20]?.src,
  portraitImages[25]?.src,
  portraitImages[30]?.src,
  portraitImages[35]?.src,
  portraitImages[40]?.src,
  portraitImages[45]?.src,
].filter(Boolean)

function getFallbackImage(index: number): string {
  return FALLBACK_IMAGES[index % FALLBACK_IMAGES.length] || heroDesktopFallback.src
}

export default function ExperienciasCarousel() {
  const { t } = useLanguage()
  useTheme()
  const scrollRef = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)
  const [dbExperiences, setDbExperiences] = useState<any[]>([])

  useEffect(() => {
    fetchDbExperiences()
  }, [])

  const fetchDbExperiences = async () => {
    try {
      const { data, error } = await supabase
        .from('experiences')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      if (data && data.length > 0) {
        setDbExperiences(
          data.map((exp, i) => ({
            ...exp,
            image_url: exp.image_url || getFallbackImage(i),
          }))
        )
      }
    } catch (err) {
      console.error('Erro ao buscar experiencias do banco:', err)
    }
  }

  const hasDbItems = dbExperiences.length > 0
  const totalItems = hasDbItems ? dbExperiences.length : staticExperiences.length

  const updateScrollState = useCallback(() => {
    const el = scrollRef.current
    if (!el) return
    setCanScrollLeft(el.scrollLeft > 10)
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10)

    const cardWidth = el.children[0]?.getBoundingClientRect().width || 320
    const gap = 24
    const index = Math.round(el.scrollLeft / (cardWidth + gap))
    setActiveIndex(Math.min(index, totalItems - 1))
  }, [totalItems])

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    el.addEventListener('scroll', updateScrollState, { passive: true })
    updateScrollState()
    return () => el.removeEventListener('scroll', updateScrollState)
  }, [updateScrollState])

  const scrollTo = (direction: 'left' | 'right') => {
    const el = scrollRef.current
    if (!el) return
    const cardWidth = el.children[0]?.getBoundingClientRect().width || 320
    const gap = 24
    const amount = direction === 'left' ? -(cardWidth + gap) : cardWidth + gap
    el.scrollBy({ left: amount, behavior: 'smooth' })
  }

  return (
    <section id="experiencias" className="py-16 md:py-24 px-4 bg-amz-areia dark:bg-amz-terra-dark transition-colors duration-500">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12 fade-up">
          <p className="section-subtitle mb-2">{t.expLabel}</p>
          <h2 className="section-title dark:text-amz-areia">{t.expTitle}</h2>
          <p className="text-amz-terra-light dark:text-amz-areia/60 mt-3 max-w-md mx-auto">
            {t.expSubtitle}
          </p>
        </div>

        <div className="relative fade-up">
          {canScrollLeft && (
            <button
              onClick={() => scrollTo('left')}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 z-10 w-10 h-10 rounded-full bg-white dark:bg-amz-terra shadow-lg flex items-center justify-center text-amz-terra dark:text-amz-areia hover:bg-amz-areia dark:hover:bg-amz-terra-light transition-colors cursor-pointer"
              aria-label="Scroll left"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}
          {canScrollRight && (
            <button
              onClick={() => scrollTo('right')}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 z-10 w-10 h-10 rounded-full bg-white dark:bg-amz-terra shadow-lg flex items-center justify-center text-amz-terra dark:text-amz-areia hover:bg-amz-areia dark:hover:bg-amz-terra-light transition-colors cursor-pointer"
              aria-label="Scroll right"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}

          <div
            ref={scrollRef}
            className="flex gap-6 overflow-x-auto hide-scrollbar snap-x snap-mandatory scroll-smooth px-1 py-2"
          >
            {hasDbItems ? (
              dbExperiences.map((exp, i) => (
                <Link
                  to={`/experiencia/${exp.id}`}
                  key={exp.id}
                  className="flex-shrink-0 w-[85vw] sm:w-[70vw] md:w-[420px] snap-center group cursor-pointer block"
                >
                  <div className="bg-white dark:bg-amz-terra/40 rounded-3xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-amz-areia-dark/30 dark:border-white/5 backdrop-blur-sm flex flex-col h-full">
                    <div className="relative h-48 overflow-hidden">
                      {exp.image_url ? (
                        <img src={exp.image_url} alt={exp.title} loading="lazy" decoding="async" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      ) : (
                        <img src={getFallbackImage(i)} alt={exp.title} loading="lazy" decoding="async" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      )}
                      <div className="absolute top-4 left-4">
                        <span className="text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full bg-amz-oceano/10 text-amz-oceano dark:bg-amz-oceano/20 dark:text-amz-oceano backdrop-blur-sm">
                          {exp.community || 'Amazon Wind'}
                        </span>
                      </div>
                      {exp.level && (
                        <div className="absolute bottom-4 right-4">
                          <span className="text-xs font-medium text-white/90 bg-black/40 backdrop-blur-sm px-3 py-1 rounded-full">
                            {exp.level}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="p-6 flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="text-xl font-maybug text-amz-terra dark:text-amz-areia group-hover:text-amz-oceano dark:group-hover:text-amz-dourado transition-colors mb-2">
                          {exp.title}
                        </h3>
                        <p className="text-sm text-amz-terra-light dark:text-amz-areia/60 leading-relaxed mb-5 line-clamp-2">
                          {exp.description}
                        </p>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-amz-areia-dark/30 dark:border-white/5">
                        <span className="font-maybug text-lg text-amz-terra dark:text-amz-dourado">
                          R$ {Number(exp.price).toFixed(2)}
                        </span>
                        <span className="btn-primary text-xs py-2 px-4 rounded-full font-semibold">
                          {t.expDetailBook || 'Ver Detalhes'}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              staticExperiences.map((exp) => {
                return (
                  <Link
                    to={`/experiencia/${exp.id}`}
                    key={exp.id}
                    className="flex-shrink-0 w-[85vw] sm:w-[70vw] md:w-[420px] snap-center group cursor-pointer block"
                  >
                    <div className="bg-white dark:bg-amz-terra/40 rounded-3xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-amz-areia-dark/30 dark:border-white/5 backdrop-blur-sm">
                      <div className="relative h-48 overflow-hidden">
                        <img
                          src={exp.image_url || ''}
                          alt={exp.title}
                          loading="lazy"
                          decoding="async"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                        <div className="absolute top-4 left-4">
                          <span className={`text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full backdrop-blur-sm ${badgeColors[exp.badge] || badgeColors['Downwind']}`}>
                            {exp.badge}
                          </span>
                        </div>
                        <div className="absolute bottom-4 right-4">
                          <span className="text-xs font-medium text-white/90 bg-black/40 backdrop-blur-sm px-3 py-1 rounded-full">
                            {exp.level}
                          </span>
                        </div>
                      </div>

                      <div className="p-6">
                        <div className="flex items-start justify-between mb-3">
                          <h3 className="text-xl font-maybug text-amz-terra dark:text-amz-areia group-hover:text-amz-oceano dark:group-hover:text-amz-dourado transition-colors">
                            {exp.title}
                          </h3>
                        </div>

                        <p className="text-sm text-amz-terra-light dark:text-amz-areia/60 leading-relaxed mb-5 line-clamp-2">
                          {exp.description}
                        </p>

                        <div className="flex items-center gap-4 text-xs text-amz-terra-light dark:text-amz-areia/50 pt-4 border-t border-amz-areia-dark/30 dark:border-white/5">
                          <span className="flex items-center gap-1.5">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {exp.duration}
                          </span>
                          <span className="w-1 h-1 rounded-full bg-amz-terra-light/30" />
                          <span className="flex items-center gap-1.5">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                            {exp.level}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                )
              })
            )}
          </div>

          <div className="flex justify-center gap-2 mt-8">
            {Array.from({ length: totalItems }).map((_, i) => (
              <button
                key={i}
                onClick={() => {
                  const el = scrollRef.current
                  if (!el) return
                  const cardWidth = el.children[0]?.getBoundingClientRect().width || 320
                  el.scrollTo({ left: i * (cardWidth + 24), behavior: 'smooth' })
                }}
                className={`transition-all duration-300 rounded-full cursor-pointer ${activeIndex === i
                    ? 'w-8 h-2 bg-amz-terra dark:bg-amz-dourado'
                    : 'w-2 h-2 bg-amz-terra/30 dark:bg-amz-areia/30 hover:bg-amz-terra/50 dark:hover:bg-amz-areia/50'
                  }`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
