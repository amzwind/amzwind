import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { useLanguage } from '../contexts/LanguageContext'
import { heroVideo, heroDesktopFallback, portraitImages } from '../data/media'

interface HeroSlide {
  id: string
  title: string
  subtitle: string | null
  media_url: string
  media_type: 'image' | 'video'
  cta_text: string | null
  cta_link: string | null
}

function isYouTubeUrl(url: string): boolean {
  return /(?:youtube\.com\/|youtu\.be\/)/i.test(url)
}

function getYouTubeEmbedUrl(url: string): string {
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/)
  if (!match) return url
  const id = match[1]
  return `https://www.youtube.com/embed/${id}?autoplay=1&mute=1&controls=0&loop=1&playlist=${id}&modestbranding=1&rel=0&showinfo=0&iv_load_policy=3&disablekb=1&fs=0&playsinline=1`
}

const SLIDES: HeroSlide[] = [
  {
    id: 'default-video',
    title: 'Expedições. Downwinds. Experiências na Amazônia Atlântica.',
    subtitle: 'A Amazônia é o nosso ponto de partida. Não queremos apenas organizar viagens. Queremos revelar um território.',
    media_url: heroVideo,
    media_type: 'video',
    cta_text: 'Explorar Roteiros',
    cta_link: '#experiencias',
  },
  {
    id: 'default-img-1',
    title: 'Kitesurf na Amazônia Atlântica',
    subtitle: 'Ventos alísios constantes, águas cristalinas e praias selvagens. O cenário perfeito para sua aventura.',
    media_url: portraitImages[5]?.src || heroDesktopFallback.src,
    media_type: 'image',
    cta_text: 'Agendar Aula',
    cta_link: '#escola',
  },
  {
    id: 'default-img-2',
    title: 'Downwinds Épicos',
    subtitle: 'Navegue entre ilhas paradisíacas, praias de águas-transparentes e restingas intocadas.',
    media_url: portraitImages[30]?.src || heroDesktopFallback.src,
    media_type: 'image',
    cta_text: 'Ver Roteiros',
    cta_link: '#experiencias',
  },
]

function MediaLayer({ slide, layerRef }: { slide: HeroSlide; layerRef: React.RefObject<HTMLDivElement> }) {
  return (
    <div ref={layerRef} className="absolute inset-0 w-full h-full">
      {slide.media_type === 'video' && isYouTubeUrl(slide.media_url) ? (
        <div className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden scale-[1.3]">
          <iframe
            key={slide.id}
            src={getYouTubeEmbedUrl(slide.media_url)}
            className="absolute inset-0 w-full h-full pointer-events-none"
            style={{ border: 'none' }}
            allow="autoplay; encrypted-media"
            title={slide.title}
          />
        </div>
      ) : slide.media_type === 'video' ? (
        <video
          key={slide.id}
          src={slide.media_url}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          disablePictureInPicture
          controls={false}
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        />
      ) : (
        <img
          key={slide.id}
          src={slide.media_url}
          alt={slide.title}
          loading="eager"
          decoding="async"
          className="absolute inset-0 w-full h-full object-cover"
        />
      )}
    </div>
  )
}

export default function Hero() {
  useLanguage()
  const [currentSlide, setCurrentSlide] = useState(0)
  const [prevSlide, setPrevSlide] = useState<number | null>(null)

  const heroRef = useRef<HTMLDivElement>(null)
  const currentLayerRef = useRef<HTMLDivElement>(null)
  const prevLayerRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (SLIDES.length <= 1) return
    const timer = setInterval(() => {
      setCurrentSlide((prev) => {
        setPrevSlide(prev)
        return (prev + 1) % SLIDES.length
      })
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    if (!currentLayerRef.current) return

    const ctx = gsap.context(() => {
      if (prevLayerRef.current) {
        gsap.fromTo(
          prevLayerRef.current,
          { opacity: 1 },
          { opacity: 0, duration: 0.8, ease: 'power2.inOut' }
        )
      }

      gsap.fromTo(
        currentLayerRef.current!,
        { opacity: 0 },
        { opacity: 1, duration: 0.8, ease: 'power2.inOut' }
      )

      gsap.fromTo(
        currentLayerRef.current!,
        { scale: 1 },
        { scale: 1.08, duration: 5, ease: 'power1.out', repeat: 0 }
      )

      if (contentRef.current) {
        gsap.fromTo(
          contentRef.current,
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out', delay: 0.3 }
        )
      }
    }, heroRef)

    return () => ctx.revert()
  }, [currentSlide])

  const slide = SLIDES[currentSlide] || SLIDES[0]

  return (
    <div ref={heroRef} className="relative h-screen w-full overflow-hidden flex items-center justify-center">
      {prevSlide !== null && SLIDES[prevSlide] && (
        <MediaLayer slide={SLIDES[prevSlide]} layerRef={prevLayerRef} />
      )}
      <MediaLayer slide={slide} layerRef={currentLayerRef} />

      <div className="absolute inset-0 bg-black/40 z-[1]" />

      <div ref={contentRef} className="relative z-10 max-w-5xl mx-auto px-6 text-center text-white mt-12">
        <span className="inline-block text-xs uppercase tracking-[0.3em] font-bold px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md mb-4 border border-white/20">
          Amazon Wind Expeditions
        </span>
        <h1 className="font-maybug text-4xl sm:text-6xl md:text-7xl leading-tight mb-6 drop-shadow-lg">
          {slide.title}
        </h1>
        {slide.subtitle && (
          <p className="text-base sm:text-xl text-white/90 max-w-2xl mx-auto font-light leading-relaxed mb-8 drop-shadow">
            {slide.subtitle}
          </p>
        )}
        {slide.cta_text && (
          <div className="flex justify-center gap-4">
            <a
              href={slide.cta_link || '#experiencias'}
              className="btn-primary py-3.5 px-8 text-sm font-bold uppercase tracking-wider rounded-full shadow-2xl hover:scale-105 transition-transform"
            >
              {slide.cta_text}
            </a>
          </div>
        )}
      </div>
    </div>
  )
}
