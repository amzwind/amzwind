import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { supabase } from '../services/supabase'

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

const fallbackSlides: HeroSlide[] = [
  {
    id: 'default-1',
    title: 'Amazônia Atlântica & Kitesurf',
    subtitle: 'Explore a rota dos ventos alísios e downwinds épicos na costa norte do Brasil.',
    media_url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&q=80&w=1920',
    media_type: 'image',
    cta_text: 'Explorar Roteiros',
    cta_link: '#experiencias'
  }
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
          className="absolute inset-0 w-full h-full object-cover"
        />
      )}
    </div>
  )
}

export default function Hero() {
  const [slides, setSlides] = useState<HeroSlide[]>(fallbackSlides)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [prevSlide, setPrevSlide] = useState<number | null>(null)

  const heroRef = useRef<HTMLDivElement>(null)
  const currentLayerRef = useRef<HTMLDivElement>(null)
  const prevLayerRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    async function fetchHeroSlides() {
      try {
        const { data, error } = await supabase
          .from('hero_slides' as any)
          .select('*')
          .order('display_order', { ascending: true })

        if (error) throw error
        if (data && data.length > 0) {
          setSlides(data as unknown as HeroSlide[])
        }
      } catch (err) {
        console.error('Usando slides padrão da Hero:', err)
      }
    }
    fetchHeroSlides()
  }, [])

  // 5-second auto-advance
  useEffect(() => {
    if (slides.length <= 1) return
    const timer = setInterval(() => {
      setCurrentSlide((prev) => {
        setPrevSlide(prev)
        return (prev + 1) % slides.length
      })
    }, 5000)
    return () => clearInterval(timer)
  }, [slides.length])

  // GSAP crossfade + Ken Burns
  useEffect(() => {
    if (!currentLayerRef.current) return

    const ctx = gsap.context(() => {
      // Crossfade: fade out prev, fade in current
      if (prevLayerRef.current) {
        gsap.fromTo(
          prevLayerRef.current,
          { opacity: 1 },
          { opacity: 0, duration: 0.8, ease: 'power2.inOut' }
        )
      }

      gsap.fromTo(
        currentLayerRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.8, ease: 'power2.inOut' }
      )

      // Ken Burns zoom on current
      gsap.fromTo(
        currentLayerRef.current,
        { scale: 1 },
        {
          scale: 1.08,
          duration: 5,
          ease: 'power1.out',
          repeat: 0,
        }
      )

      // Content fade in
      if (contentRef.current) {
        gsap.fromTo(
          contentRef.current,
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out', delay: 0.3 }
        )
      }
    }, heroRef)

    return () => ctx.revert()
  }, [currentSlide, slides])

  const slide = slides[currentSlide] || slides[0]

  return (
    <div ref={heroRef} className="relative h-screen w-full overflow-hidden flex items-center justify-center">
      {/* Media layers for crossfade */}
      {prevSlide !== null && slides[prevSlide] && (
        <MediaLayer slide={slides[prevSlide]} layerRef={prevLayerRef} />
      )}
      <MediaLayer slide={slide} layerRef={currentLayerRef} />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40 z-[1]" />

      {/* Content */}
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
