import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../services/supabase'
import { useLanguage } from '../contexts/LanguageContext'
import GalleryPreview from '../components/GalleryPreview'
import { ABOUT_FALLBACK, type AboutLocale } from '../data/aboutFallback'
import { portraitImages } from '../data/media'


interface AboutData {
  cover_url: string | null
  title: string
  subtitle: string
  description: string
  video_url: string | null
  gallery_urls: string[]
  mission: string
  vision: string
}

const regions = [
  { name: 'Salinópolis', image: '/paisagem.jpeg' },
  { name: 'Ilha do Marajó', image: '/experiencia-por-do-sol.jpeg' },
  { name: 'Algodoal', image: '/por-do-sol.jpeg' },
  { name: 'Ajuruteua', image: '/kite17.jpeg' },
  { name: 'Crispim', image: '/por-do-sol2.jpeg' },
  { name: 'Fortalezinha', image: '/por-do-sol8.jpeg' },
  { name: 'Pirabas', image: '/por-do-sol89.jpeg' },
]

const products = [
  { pt: 'Escola de Kitesurf', en: 'Kitesurf School', es: 'Escuela de Kitesurf', icon: '🏄' },
  { pt: 'Downwinds', en: 'Downwinds', es: 'Downwinds', icon: '🌊' },
  { pt: 'Expedições', en: 'Expeditions', es: 'Expediciones', icon: '🗺️' },
  { pt: 'Kite Camps', en: 'Kite Camps', es: 'Kite Camps', icon: '⛺' },
  { pt: 'Wingfoil', en: 'Wingfoil', es: 'Wingfoil', icon: '🦅' },
  { pt: 'Surf Trips', en: 'Surf Trips', es: 'Surf Trips', icon: '🏖️' },
  { pt: 'Canoagem', en: 'Canoeing', es: 'Canoa', icon: '🛶' },
]

export default function Sobre() {
  const { t, locale } = useLanguage()

  const [aboutData, setAboutData] = useState<AboutData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadAboutData()
  }, [locale])

  const loadAboutData = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('about_page' as any)
        .select('*')
        .eq('locale', locale)
        .single()

      if (!error && data) {
        setAboutData(data as unknown as AboutData)
      } else {
        setAboutData(ABOUT_FALLBACK[(locale as AboutLocale) || 'pt'])
      }
    } catch {
      setAboutData(ABOUT_FALLBACK[(locale as AboutLocale) || 'pt'])
    }
    setLoading(false)
  }

  if (loading || !aboutData) {
    return (
      <div className="min-h-screen bg-amz-areia dark:bg-amz-terra-dark flex items-center justify-center">
        <div className="text-amz-terra dark:text-amz-areia font-maybug text-xl animate-pulse">
          Carregando...
        </div>
      </div>
    )
  }

  const paragraphs = aboutData.description.split('\n\n').filter(Boolean)

  return (
    <div className="min-h-screen bg-amz-areia dark:bg-amz-terra-dark transition-colors duration-500">
      {/* Hero / Cover */}
      <section className="relative h-[60vh] min-h-[400px] overflow-hidden">
        {aboutData.cover_url ? (
          <img src={aboutData.cover_url} alt={aboutData.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-amz-terra via-amz-terra-dark to-amz-oceano-dark" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        <div className="absolute inset-0 flex items-end">
          <div className="max-w-7xl mx-auto px-4 pb-12 w-full">
            <p className="text-amz-dourado text-sm font-semibold uppercase tracking-widest mb-2">{aboutData.subtitle}</p>
            <h1 className="font-maybug text-4xl md:text-5xl lg:text-6xl text-white mb-4">{aboutData.title}</h1>
            <div className="flex items-center gap-4">
              <Link to="/" className="text-white/60 hover:text-white text-sm transition-colors">← {t.navHome || 'Voltar'}</Link>
              <span className="text-white/20">|</span>
              <Link to="/#contato" className="text-white/60 hover:text-white text-sm transition-colors">{t.footerContact || 'Contato'}</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="max-w-7xl mx-auto px-4 py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-12">
            {/* Description */}
            <div className="prose prose-lg max-w-none fade-up">
              {paragraphs.map((p, i) => (
                <p key={i} className="text-amz-terra dark:text-amz-areia/80 leading-relaxed text-base">
                  {p}
                </p>
              ))}
            </div>

            {/* Video */}
            {aboutData.video_url && (
              <div className="rounded-3xl overflow-hidden shadow-xl border border-amz-areia-dark/20 dark:border-white/5 fade-up">
                <div className="relative pb-[56.25%] h-0">
                  <iframe
                    src={aboutData.video_url}
                    className="absolute inset-0 w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              </div>
            )}

            {/* Mission & Vision Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 fade-up">
              <div className="bg-white dark:bg-white/5 rounded-3xl p-8 shadow-md border border-amz-areia-dark/20 dark:border-white/5">
                <div className="w-12 h-12 rounded-2xl bg-amz-dourado/10 flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-amz-dourado" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="font-maybug text-lg text-amz-terra dark:text-amz-areia mb-3">{t.aboutMission}</h3>
                <p className="text-sm text-amz-terra-light dark:text-amz-areia/60 leading-relaxed">{aboutData.mission}</p>
              </div>

              <div className="bg-white dark:bg-white/5 rounded-3xl p-8 shadow-md border border-amz-areia-dark/20 dark:border-white/5">
                <div className="w-12 h-12 rounded-2xl bg-amz-oceano/10 flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-amz-oceano" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </div>
                <h3 className="font-maybug text-lg text-amz-terra dark:text-amz-areia mb-3">{t.aboutVision}</h3>
                <p className="text-sm text-amz-terra-light dark:text-amz-areia/60 leading-relaxed">{aboutData.vision}</p>
              </div>
            </div>

            {/* Values */}
            <div className="fade-up">
              <h2 className="font-maybug text-2xl text-amz-terra dark:text-amz-areia mb-6">{t.aboutValues}</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {[
                  { title: t.aboutValue1Title, desc: t.aboutValue1Desc, icon: '🛡️', color: 'bg-amz-oceano/10' },
                  { title: t.aboutValue2Title, desc: t.aboutValue2Desc, icon: '🌿', color: 'bg-amz-bio/10' },
                  { title: t.aboutValue3Title, desc: t.aboutValue3Desc, icon: '🤝', color: 'bg-amz-dourado/10' },
                ].map((val) => (
                  <div key={val.title} className="bg-white dark:bg-white/5 rounded-3xl p-6 shadow-md border border-amz-areia-dark/20 dark:border-white/5 hover:-translate-y-1 transition-transform duration-300">
                    <div className={`w-12 h-12 rounded-2xl ${val.color} flex items-center justify-center mb-4 text-2xl`}>
                      {val.icon}
                    </div>
                    <h3 className="font-maybug text-lg text-amz-terra dark:text-amz-areia mb-2">{val.title}</h3>
                    <p className="text-sm text-amz-terra-light dark:text-amz-areia/60 leading-relaxed">{val.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Leadership */}
            <div className="fade-up">
              <h2 className="font-maybug text-2xl text-amz-terra dark:text-amz-areia mb-6">{t.aboutLeadership}</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {[
                  { name: t.aboutLeader1Name, role: t.aboutLeader1Role, image: portraitImages[8]?.src, initials: 'PI' },
                  { name: t.aboutLeader2Name, role: t.aboutLeader2Role, image: portraitImages[12]?.src, initials: 'PA' },
                  { name: t.aboutLeader3Name, role: t.aboutLeader3Role, image: portraitImages[16]?.src, initials: 'RC' },
                ].map((leader) => (
                  <div key={leader.name} className="bg-white dark:bg-white/5 rounded-3xl p-6 shadow-md border border-amz-areia-dark/20 dark:border-white/5 text-center hover:-translate-y-1 transition-transform duration-300">
                    <div className="w-20 h-20 rounded-full overflow-hidden mx-auto mb-4 ring-4 ring-amz-dourado/20">
                      {leader.image ? (
                        <img src={leader.image} alt={leader.name} loading="lazy" decoding="async" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-amz-terra flex items-center justify-center text-white font-maybug text-xl">
                          {leader.initials}
                        </div>
                      )}
                    </div>
                    <h3 className="font-maybug text-lg text-amz-terra dark:text-amz-areia">{leader.name}</h3>
                    <p className="text-sm text-amz-dourado font-medium">{leader.role}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Regions */}
            <div className="bg-white dark:bg-white/5 rounded-3xl p-8 shadow-md border border-amz-areia-dark/20 dark:border-white/5 fade-up">
              <h3 className="font-maybug text-lg text-amz-terra dark:text-amz-areia mb-4">{t.aboutRegions}</h3>
              <div className="grid grid-cols-2 gap-3">
                {regions.map((region) => (
                  <div key={region.name} className="relative rounded-xl overflow-hidden h-20 group">
                    <img src={region.image} alt={region.name} loading="lazy" decoding="async" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <span className="text-white text-xs font-semibold">{region.name}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Products */}
            <div className="bg-white dark:bg-white/5 rounded-3xl p-8 shadow-md border border-amz-areia-dark/20 dark:border-white/5 fade-up">
              <h3 className="font-maybug text-lg text-amz-terra dark:text-amz-areia mb-4">{t.aboutProducts}</h3>
              <div className="space-y-2">
                {products.map((prod) => (
                  <div key={prod.pt} className="flex items-center gap-3 py-2 px-3 rounded-xl hover:bg-amz-areia/50 dark:hover:bg-white/5 transition-colors">
                    <span className="text-lg">{prod.icon}</span>
                    <span className="text-sm text-amz-terra dark:text-amz-areia">{prod[locale]}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Contact Info */}
            <div className="bg-amz-terra-dark dark:bg-white/5 rounded-3xl p-8 text-white fade-up">
              <h3 className="font-maybug text-lg mb-4">{t.footerContact || 'Contato'}</h3>
              <ul className="space-y-3 text-sm text-white/60">
                <li className="flex items-center gap-3">
                  <svg className="w-4 h-4 text-amz-dourado shrink-0" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z" />
                  </svg>
                  WhatsApp
                </li>
                <li className="flex items-center gap-3">
                  <svg className="w-4 h-4 text-amz-dourado shrink-0" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                  @amazonwind.kitesurf
                </li>
                <li className="flex items-center gap-3">
                  <svg className="w-4 h-4 text-amz-dourado shrink-0" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                  </svg>
                  contato@amazonwind.com.br
                </li>
              </ul>

              <div className="border-t border-white/10 mt-6 pt-6">
                <h4 className="text-xs uppercase tracking-widest text-white/40 mb-3">{t.footerLocation || 'Localização'}</h4>
                <p className="text-sm text-white/50 leading-relaxed">
                  Salinópolis, Pará<br />
                  Ilha do Marajó<br />
                  Ajuruteua &middot; Algodoal<br />
                  Crispim &middot; Fortalezinha &middot; Pirabas
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <GalleryPreview />

      {/* Footer minimal */}
      <footer className="border-t border-amz-areia-dark/20 dark:border-white/5 py-8 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <Link to="/" className="text-sm text-amz-terra-light dark:text-amz-areia/40 hover:text-amz-terra dark:hover:text-amz-areia transition-colors">
            ← Amazon Wind
          </Link>
          <p className="text-xs text-amz-terra-light/60 dark:text-amz-areia/30">
            &copy; {new Date().getFullYear()} Amazon Wind. {t.footerRights || 'Todos os direitos reservados.'}
          </p>
        </div>
      </footer>
    </div>
  )
}
