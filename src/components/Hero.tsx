import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { useLanguage } from '../contexts/LanguageContext'

export default function Hero() {
  const { t } = useLanguage()
  const titleRef = useRef<HTMLHeadingElement>(null)
  const highlightRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    if (!highlightRef.current) return
    const ctx = gsap.context(() => {
      gsap.fromTo(
        highlightRef.current,
        { backgroundSize: '0% 3px' },
        {
          backgroundSize: '100% 3px',
          duration: 1.2,
          delay: 1.5,
          ease: 'power3.out',
        }
      )
    })
    return () => ctx.revert()
  }, [])

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Organic gradient background */}
      <div className="absolute inset-0">
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(160deg, #5C2C16 0%, #7A4A2E 30%, #A36217 55%, #1A6B7C 85%, #0E4F5C 100%)',
          }}
        />
        {/* Animated organic shapes */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-amz-dourado/20 blur-3xl animate-pulse" />
          <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full bg-amz-oceano/20 blur-3xl" style={{ animationDelay: '1s', animation: 'pulse 4s ease-in-out infinite' }} />
          <div className="absolute top-1/3 left-1/4 w-64 h-64 rounded-full bg-white/5 blur-2xl" style={{ animation: 'float 6s ease-in-out infinite' }} />
        </div>

        {/* Brand pattern overlay */}
        <svg className="absolute inset-0 w-full h-full opacity-[0.07]" viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice">
          <pattern id="hero-pattern" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
            <circle cx="25" cy="25" r="15" fill="white" opacity="0.12" />
            <circle cx="75" cy="75" r="10" fill="white" opacity="0.08" />
            <ellipse cx="50" cy="12" rx="8" ry="4" fill="white" opacity="0.06" transform="rotate(25 50 12)" />
            <circle cx="10" cy="80" r="5" fill="white" opacity="0.1" />
            <circle cx="90" cy="20" r="7" fill="white" opacity="0.06" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#hero-pattern)" />
        </svg>
      </div>

      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        <div className="mb-6">
          <span className="inline-flex items-center gap-2 text-white/50 text-xs uppercase tracking-[0.35em] font-sans backdrop-blur-sm bg-white/5 px-4 py-2 rounded-full border border-white/10">
            <span className="w-1.5 h-1.5 rounded-full bg-amz-dourado animate-pulse" />
            {t.heroTagline}
          </span>
        </div>

        <h1 ref={titleRef} className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-maybug text-white leading-[1.1] mb-8 text-shadow">
          {t.heroTitle1}
          <br />
          <span
            ref={highlightRef}
            className="inline-block text-amz-dourado bg-bottom bg-no-repeat"
            style={{
              backgroundImage: 'linear-gradient(90deg, #A36217, #F5F2EB)',
              backgroundSize: '100% 3px',
              backgroundPosition: 'left bottom',
            }}
          >
            {t.heroTitleHighlight}
          </span>
        </h1>

        <p className="text-white/75 text-lg md:text-xl font-sans mb-10 max-w-2xl mx-auto leading-relaxed">
          {t.heroSubtitle}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a href="#experiencias" className="group btn-primary !bg-white !text-amz-terra hover:!bg-amz-areia !px-8 !py-4 !text-base shadow-xl hover:shadow-2xl transition-all duration-300">
            <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
            {t.heroCTA1}
          </a>
          <a href="#escola" className="btn-secondary !border-white/30 !text-white hover:!bg-white/10 hover:!text-white !px-8 !py-4 !text-base backdrop-blur-sm">
            {t.heroCTA2}
          </a>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
        <span className="text-white/40 text-[10px] uppercase tracking-widest font-sans">Scroll</span>
        <div className="w-5 h-8 rounded-full border-2 border-white/30 flex justify-center pt-1.5">
          <div className="w-1 h-2 rounded-full bg-white/60 animate-bounce" />
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
      `}</style>
    </section>
  )
}
