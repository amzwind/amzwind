import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { supabase } from '../services/supabase'

gsap.registerPlugin(ScrollTrigger)

const fallbackSlides = [
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

export default function Hero() {
  const [slides, setSlides] = useState<any[]>(fallbackSlides)
  const [currentSlide, setCurrentSlide] = useState(0)

  const heroRef = useRef<HTMLDivElement>(null)
  const mediaRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    async function fetchHeroSlides() {
      try {
        const { data, error } = await supabase
          .from('hero_slides')
          .select('*')
          .order('display_order', { ascending: true })

        if (error) throw error
        if (data && data.length > 0) {
          setSlides(data)
        }
      } catch (err) {
        console.error('Usando slides padrão da Hero:', err)
      }
    }
    fetchHeroSlides()
  }, [])

  // Auto-play do carrossel a cada 6 segundos
  useEffect(() => {
    if (slides.length <= 1) return
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 6000)
    return () => clearInterval(timer)
  }, [slides.length])

  // Animações GSAP de Zoom Cinematográfico e ScrollTrigger (Desfoque/Parallax)
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Efeito Ken Burns (Zoom sutil contínuo na mídia ativa)
      if (mediaRef.current) {
        gsap.fromTo(
          mediaRef.current,
          { scale: 1, filter: 'blur(0px)' },
          {
            scale: 1.12,
            duration: 7,
            ease: 'power1.out',
            repeat: -1,
            yoyo: true
          }
        )

        // Efeito ScrollTrigger: Desfoca e escurece ao rolar para baixo
        gsap.to(mediaRef.current, {
          scrollTrigger: {
            trigger: heroRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: true
          },
          filter: 'blur(12px) brightness(0.5)',
          y: 100
        })
      }

      // Animação de entrada do texto
      if (contentRef.current) {
        gsap.fromTo(
          contentRef.current,
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 1, ease: 'power3.out' }
        )
      }
    }, heroRef)

    return () => ctx.revert()
  }, [currentSlide])

  const slide = slides[currentSlide] || slides[0]

  return (
    <div ref={heroRef} className="relative h-screen w-full overflow-hidden flex items-center justify-center">
      {/* Container da Mídia com Efeito de Fundo */}
      <div ref={mediaRef} className="absolute inset-0 w-full h-full overflow-hidden z-0">
        {slide.media_type === 'video' ? (
          <video
            key={slide.media_url}
            src={slide.media_url}
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover"
          />
        ) : (
          <img
            key={slide.media_url}
            src={slide.media_url}
            alt={slide.title}
            className="w-full h-full object-cover"
          />
        )}
        {/* Overlay escuro elegante para legibilidade */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
      </div>

      {/* Conteúdo Central */}
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

      {/* Indicadores de Slide (Dots) */}
      {slides.length > 1 && (
        <div className="absolute bottom-8 z-20 flex gap-2">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${currentSlide === idx ? 'w-8 bg-amz-dourado' : 'w-2 bg-white/50 hover:bg-white/80'
                }`}
              aria-label={`Ir para slide ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}