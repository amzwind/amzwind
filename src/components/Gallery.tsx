import { useState, useRef, useEffect } from 'react'
import { useLanguage } from '../contexts/LanguageContext'
import { allMedia, type MediaCategory } from '../data/media'
import Lightbox from './Lightbox'

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
              onClick={() => setLightboxIndex(i)}
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
        {lightboxIndex !== null && (
          <Lightbox
            images={filteredMedia.map((m) => ({ src: m.src, alt: m.alt }))}
            index={lightboxIndex}
            onClose={() => setLightboxIndex(null)}
            onNav={(dir) => setLightboxIndex((prev) => prev !== null ? (prev + dir + filteredMedia.length) % filteredMedia.length : null)}
          />
        )}
      </div>
    </section>
  )
}
