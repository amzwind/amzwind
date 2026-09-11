import { useState, useRef, useEffect } from 'react'
import { useLanguage } from '../contexts/LanguageContext'
import { allMedia, type MediaCategory } from '../data/media'

const categoryLabels: Record<MediaCategory, Record<string, string>> = {
  kite: { pt: 'Kitesurf', en: 'Kitesurf', es: 'Kitesurf' },
  sunset: { pt: 'Pôr do Sol', en: 'Sunset', es: 'Atardecer' },
  sailing: { pt: 'Vela', en: 'Sailing', es: 'Vela' },
  expedition: { pt: 'Expedição', en: 'Expedition', es: 'Expedición' },
  school: { pt: 'Escola', en: 'School', es: 'Escuela' },
  landscape: { pt: 'Paisagem', en: 'Landscape', es: 'Paisaje' },
  lifestyle: { pt: 'Lifestyle', en: 'Lifestyle', es: 'Estilo de vida' },
}

const categories: MediaCategory[] = ['kite', 'sunset', 'sailing', 'expedition', 'school', 'landscape', 'lifestyle']

export default function Gallery() {
  const { t, locale } = useLanguage()
  const [activeCategory, setActiveCategory] = useState<MediaCategory | 'all'>('all')
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  const [visibleImages, setVisibleImages] = useState<Set<number>>(new Set())
  const observerRef = useRef<IntersectionObserver | null>(null)

  const filteredMedia = activeCategory === 'all'
    ? allMedia
    : allMedia.filter((m) => m.category === activeCategory)

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = Number(entry.target.getAttribute('data-index'))
            setVisibleImages((prev) => new Set(prev).add(idx))
          }
        })
      },
      { rootMargin: '200px' }
    )
    return () => observerRef.current?.disconnect()
  }, [])

  const imgRef = (_idx: number) => (el: HTMLDivElement | null) => {
    if (el) observerRef.current?.observe(el)
  }

  function openLightbox(index: number) {
    setLightboxIndex(index)
    document.body.style.overflow = 'hidden'
  }

  function closeLightbox() {
    setLightboxIndex(null)
    document.body.style.overflow = ''
  }

  function navLightbox(dir: -1 | 1) {
    if (lightboxIndex === null) return
    setLightboxIndex((lightboxIndex + dir + filteredMedia.length) % filteredMedia.length)
  }

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (lightboxIndex === null) return
      if (e.key === 'Escape') closeLightbox()
      if (e.key === 'ArrowLeft') navLightbox(-1)
      if (e.key === 'ArrowRight') navLightbox(1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [lightboxIndex, filteredMedia.length])

  return (
    <section id="galeria" className="py-16 md:py-24 px-4 bg-white dark:bg-[#2A1508] transition-colors duration-500">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10 fade-up">
          <p className="section-subtitle mb-2 dark:text-amz-areia/50">{t.galleryLabel}</p>
          <h2 className="section-title dark:text-amz-areia">{t.galleryTitle}</h2>
          <p className="text-amz-terra-light dark:text-amz-areia/60 mt-3 max-w-lg mx-auto">
            {t.gallerySubtitle}
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-10 fade-up">
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
              activeCategory === 'all'
                ? 'bg-amz-terra text-white shadow-lg'
                : 'bg-amz-areia/50 dark:bg-white/5 text-amz-terra-light dark:text-amz-areia/60 hover:bg-amz-areia dark:hover:bg-white/10'
            }`}
          >
            {t.galleryAll}
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                activeCategory === cat
                  ? 'bg-amz-terra text-white shadow-lg'
                  : 'bg-amz-areia/50 dark:bg-white/5 text-amz-terra-light dark:text-amz-areia/60 hover:bg-amz-areia dark:hover:bg-white/10'
              }`}
            >
              {categoryLabels[cat][locale]}
            </button>
          ))}
        </div>

        {/* Masonry Grid */}
        <div className="columns-2 md:columns-3 lg:columns-4 gap-3 space-y-3">
          {filteredMedia.map((media, i) => (
            <div
              key={`${media.src}-${i}`}
              ref={imgRef(i)}
              data-index={i}
              className="break-inside-avoid cursor-pointer group relative overflow-hidden rounded-2xl"
              onClick={() => openLightbox(i)}
            >
              {visibleImages.has(i) ? (
                <img
                  src={media.src}
                  alt={media.alt}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-110"
                />
              ) : (
                <div className={`w-full ${media.orientation === 'portrait' ? 'aspect-[9/16]' : media.orientation === 'landscape' ? 'aspect-[16/9]' : 'aspect-square'} bg-amz-areia/30 dark:bg-white/5 animate-pulse`} />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                <p className="text-white text-xs font-medium truncate">{media.alt}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Lightbox */}
        {lightboxIndex !== null && filteredMedia[lightboxIndex] && (
          <div
            className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center"
            onClick={closeLightbox}
          >
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors z-10"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <button
              onClick={(e) => { e.stopPropagation(); navLightbox(-1) }}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <button
              onClick={(e) => { e.stopPropagation(); navLightbox(1) }}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            <img
              key={lightboxIndex}
              src={filteredMedia[lightboxIndex].src}
              alt={filteredMedia[lightboxIndex].alt}
              className="max-w-[90vw] max-h-[85vh] object-contain rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />

            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/60 text-sm">
              {lightboxIndex + 1} / {filteredMedia.length}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
