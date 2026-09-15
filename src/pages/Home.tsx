import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Header from '../components/Header'
import Hero from '../components/Hero'
import ExperienciasCarousel from '../components/ExperienciasCarousel'
import KiteSchool from '../components/KiteSchool'
import Servicos from '../components/Servicos'
import GalleryPreview from '../components/GalleryPreview'
import ContactNewsletter from '../components/ContactNewsletter'
import Footer from '../components/Footer'
import { useLanguage } from '../contexts/LanguageContext'
import { supabase } from '../services/supabase'

gsap.registerPlugin(ScrollTrigger)

export default function Home() {
  const mainRef = useRef<HTMLDivElement>(null)
  const { t } = useLanguage()
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const fetchAuthState = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setIsAuthenticated(Boolean(user))
    }

    fetchAuthState()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(Boolean(session))
    })

    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('.fade-up').forEach((el) => {
        gsap.fromTo(
          el,
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 85%',
              toggleActions: 'play none none none',
            },
          }
        )
      })
    }, mainRef)

    return () => ctx.revert()
  }, [])

  const quickLinks = [
    {
      title: t.homeStartExperiences,
      description: t.homeStartExperiencesDesc,
      to: '/experiencias',
      accent: 'from-amz-oceano/15 to-amz-oceano/5',
      icon: '🌊',
    },
    {
      title: t.homeStartTrips,
      description: t.homeStartTripsDesc,
      to: '/trips',
      accent: 'from-amber-500/15 to-amber-500/5',
      icon: '🗺️',
    },
    {
      title: t.homeStartCommunity,
      description: t.homeStartCommunityDesc,
      to: '/comunidade',
      accent: 'from-emerald-500/15 to-emerald-500/5',
      icon: '🤝',
    },
    {
      title: isAuthenticated ? t.homeStartProfile : t.homeStartLogin,
      description: isAuthenticated ? t.homeStartProfileDesc : t.homeStartLoginDesc,
      to: isAuthenticated ? '/perfil' : '/login',
      accent: 'from-violet-500/15 to-violet-500/5',
      icon: '👤',
    },
  ]

  return (
    <div ref={mainRef} className="min-h-screen bg-amz-areia dark:bg-amz-terra-dark transition-colors duration-500">
      <Header />
      <Hero />
      <section className="max-w-6xl mx-auto px-4 py-12 md:py-16">
        <div className="mb-8 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-amz-dourado dark:text-amz-dourado/80">
            {t.homeStartLabel}
          </p>
          <h2 className="mt-3 text-3xl md:text-4xl font-maybug text-amz-terra dark:text-amz-areia">
            {t.homeStartTitle}
          </h2>
          <p className="mt-3 text-sm md:text-base text-amz-terra-light dark:text-amz-areia/60 max-w-2xl mx-auto">
            {t.homeStartSubtitle}
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {quickLinks.map((item) => (
            <Link
              key={item.title}
              to={item.to}
              className={`group block rounded-3xl border border-amz-areia-dark/20 dark:border-white/10 bg-gradient-to-br ${item.accent} p-5 transition-transform duration-200 hover:-translate-y-1 hover:shadow-lg`}
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-3xl">{item.icon}</span>
                <span className="inline-flex items-center rounded-full bg-white/70 dark:bg-black/20 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-amz-terra dark:text-amz-areia">
                  {t.homeStartGo}
                </span>
              </div>
              <h3 className="text-lg font-bold text-amz-terra dark:text-amz-areia">{item.title}</h3>
              <p className="mt-2 text-sm text-amz-terra-light dark:text-amz-areia/60">{item.description}</p>
            </Link>
          ))}
        </div>
      </section>
      <ExperienciasCarousel />
      <KiteSchool />
      <Servicos />
      <GalleryPreview />
      <ContactNewsletter />
      <Footer />
    </div>
  )
}
