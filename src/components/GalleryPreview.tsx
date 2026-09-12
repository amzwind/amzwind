import { useState, useCallback } from 'react'
import { useLanguage } from '../contexts/LanguageContext'
import { allMedia } from '../data/media'
import Lightbox from './Lightbox'

const PREVIEW_COUNT = 8

const curatedIndices = [0, 5, 12, 22, 35, 42, 50, 58]

export default function GalleryPreview() {
  const { t } = useLanguage()
  const [lightboxIndex, setLightboxIndex] = useState(-1)

  const previewMedia = curatedIndices
    .map((i) => allMedia[i])
    .filter(Boolean)
    .slice(0, PREVIEW_COUNT)

  const handleNav = useCallback((dir: -1 | 1) => {
    setLightboxIndex((prev) => {
      const next = prev + dir
      if (next < 0) return previewMedia.length - 1
      if (next >= previewMedia.length) return 0
      return next
    })
  }, [previewMedia.length])

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

        {/* Curated Preview Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10 fade-up">
          {previewMedia.map((media, i) => (
            <div
              key={`${media.src}-preview-${i}`}
              className="group relative overflow-hidden rounded-2xl cursor-pointer"
              onClick={() => setLightboxIndex(i)}
            >
              <div className={`${i % 5 === 0 ? 'row-span-2' : ''} overflow-hidden`}>
                <img
                  src={media.src}
                  alt={media.alt}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 aspect-square"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                <p className="text-white text-xs font-medium truncate">{media.alt}</p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Button */}
        <div className="text-center fade-up">
          <a
            href="/galeria"
            className="inline-flex items-center gap-2 btn-primary py-3.5 px-8 text-sm font-bold uppercase tracking-wider rounded-full shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {t.galleryViewFull}
          </a>
        </div>
      </div>

      {lightboxIndex >= 0 && (
        <Lightbox
          images={previewMedia}
          index={lightboxIndex}
          onClose={() => setLightboxIndex(-1)}
          onNav={handleNav}
        />
      )}
    </section>
  )
}
