import { useEffect, useRef } from 'react'
import gsap from 'gsap'

interface SplashScreenProps {
  onComplete: () => void
}

export default function SplashScreen({ onComplete }: SplashScreenProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const logoRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLDivElement>(null)
  const subtitleRef = useRef<HTMLDivElement>(null)
  const loaderRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          gsap.to(containerRef.current, {
            opacity: 0,
            duration: 0.5,
            ease: 'power2.inOut',
            onComplete,
          })
        },
      })

      tl.fromTo(
        logoRef.current,
        { scale: 0.5, opacity: 0, rotation: -10 },
        { scale: 1, opacity: 1, rotation: 0, duration: 0.8, ease: 'back.out(1.4)' }
      )
        .fromTo(
          titleRef.current,
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out' },
          '-=0.3'
        )
        .fromTo(
          subtitleRef.current,
          { y: 15, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.5, ease: 'power3.out' },
          '-=0.2'
        )
        .fromTo(
          loaderRef.current,
          { scaleX: 0, opacity: 0 },
          { scaleX: 1, opacity: 1, duration: 0.4, ease: 'power2.out' },
          '-=0.2'
        )
        .to(loaderRef.current, {
          scaleX: 0,
          opacity: 0,
          duration: 0.3,
          ease: 'power2.in',
          delay: 0.8,
        })
    })

    return () => ctx.revert()
  }, [onComplete])

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center"
      style={{
        background: 'linear-gradient(135deg, #5C2C16 0%, #3D1D0F 100%)',
      }}
    >
      <div className="absolute inset-0 opacity-5">
        <svg className="w-full h-full" viewBox="0 0 400 400" preserveAspectRatio="xMidYMid slice">
          <pattern id="leaves" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
            <circle cx="15" cy="15" r="8" fill="white" opacity="0.3" />
            <circle cx="45" cy="45" r="5" fill="white" opacity="0.2" />
            <circle cx="30" cy="5" r="3" fill="white" opacity="0.15" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#leaves)" />
        </svg>
      </div>

      <div ref={logoRef} className="relative mb-6">
        <div className="w-28 h-28 md:w-36 md:h-36 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/20 shadow-2xl">
          <img
            src="/logo/logo-redonda-branco.svg"
            alt="Amazon Wind"
            className="w-20 h-20 md:w-24 md:h-24"
          />
        </div>
      </div>

      <div ref={titleRef} className="text-center mb-2">
        <h1 className="text-4xl md:text-5xl font-maybug text-white tracking-wide">
          Amazon Wind
        </h1>
      </div>

      <div ref={subtitleRef} className="text-center mb-8 px-6">
        <p className="text-white/70 text-sm md:text-base font-sans tracking-widest uppercase">
          Kitesurf & Expedições
        </p>
      </div>

      <div
        ref={loaderRef}
        className="w-32 h-1 rounded-full origin-left"
        style={{
          background: 'linear-gradient(90deg, #A36217, #F5F2EB)',
        }}
      />
    </div>
  )
}
