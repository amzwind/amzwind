import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../services/supabase'
import { useLanguage } from '../contexts/LanguageContext'


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

const FALLBACK_DATA: Record<string, AboutData> = {
  pt: {
    cover_url: null,
    title: 'Sobre a Amazon Wind',
    subtitle: 'Escola de Kitesurf & Expedições na Amazônia Atlântica',
    description: `Fundada por Pingo, Pablo e Rafael, a Amazon Wind nasceu da paixão pelo vento, pela água e pela cultura paraense. Localizada em Salinópolis, no litoral do Pará, somos referência em aulas de kitesurf, downwinds épicos e expedições que conectam o viajante à essência da Amazônia Atlântica.

Nossa história começou nas praias de Ajuruteua e Algodoal, onde os ventos constantes e as águas cristalinas criam o cenário perfeito para o kitesurf. Ao longo dos anos, expandimos nossas operações para incluir vivências culturais na Ilha do Marajó, trilhas pela restinga e mergulhos em águas-transparentes.

Acreditamos no turismo de impacto positivo. Cada experiência que criamos respeita o meio ambiente, valoriza as comunidades locais e preserva a cultura amazônica. Nosso time de instrutores certificados garante segurança e diversão para todos os níveis, desde o primeiro contato com a barra até manobras avançadas.`,
    video_url: null,
    gallery_urls: [],
    mission: 'Democratizar o kitesurf e o ecoturismo na Amazônia, oferecendo experiências seguras, sustentáveis e transformadoras que conectam pessoas à natureza e à cultura paraense.',
    vision: 'Ser a principal referência em kitesurf e turismo de aventura no Norte do Brasil, reconhecida pela excelência, sustentabilidade e pelo impacto positivo nas comunidades locais.',
  },
  en: {
    cover_url: null,
    title: 'About Amazon Wind',
    subtitle: 'Kitesurf School & Expeditions in the Amazon',
    description: `Founded by Pingo, Pablo and Rafael, Amazon Wind was born from a passion for wind, water, and Pará culture. Based in Salinópolis on the coast of Pará, we are a reference in kitesurf lessons, epic downwinds, and expeditions that connect travelers to the essence of the Atlantic Amazon.

Our story began on the beaches of Ajuruteua and Algodoal, where constant winds and crystal-clear waters create the perfect setting for kitesurfing. Over the years, we expanded our operations to include cultural experiences on Marajó Island, restinga trails, and dives in transparent waters.

We believe in positive impact tourism. Every experience we create respects the environment, values local communities, and preserves Amazonian culture. Our team of certified instructors ensures safety and fun for all levels, from first contact with the bar to advanced maneuvers.`,
    video_url: null,
    gallery_urls: [],
    mission: 'Democratize kitesurfing and ecotourism in the Amazon, offering safe, sustainable, and transformative experiences that connect people to nature and Pará culture.',
    vision: 'To be the leading reference in kitesurfing and adventure tourism in Northern Brazil, recognized for excellence, sustainability, and positive impact on local communities.',
  },
  es: {
    cover_url: null,
    title: 'Sobre Amazon Wind',
    subtitle: 'Escuela de Kitesurf y Expediciones en la Amazonía',
    description: `Fundada por Pingo, Pablo y Rafael, Amazon Wind nació de la pasión por el viento, el agua y la cultura de Pará. Ubicada en Salinópolis, en la costa de Pará, somos referencia en clases de kitesurf, downwinds épicos y expediciones que conectan al viajante con la esencia de la Amazonía Atlántica.

Nuestra historia comenzó en las playas de Ajuruteua y Algodoal, donde los vientos constantes y las aguas cristalinas crean el escenario perfecto para el kitesurf. A lo largo de los años, expandimos nuestras operaciones para incluir experiencias culturales en la Isla de Marajó, senderos por la restinga y buceo en aguas transparentes.

Creemos en el turismo de impacto positivo. Cada experiencia que creamos respeta el medio ambiente, valoriza las comunidades locales y preserva la cultura amazónica. Nuestro equipo de instructores certificados garantiza seguridad y diversión para todos los niveles.`,
    video_url: null,
    gallery_urls: [],
    mission: 'Democratizar el kitesurf y el ecoturismo en la Amazonía, ofreciendo experiencias seguras, sostenibles y transformadoras que conectan a las personas con la naturaleza y la cultura paraense.',
    vision: 'Ser la principal referencia en kitesurf y turismo de aventura en el Norte de Brasil, reconocida por la excelencia, sostenibilidad y el impacto positivo en las comunidades locales.',
  },
}

export default function Sobre() {
  const { t, locale } = useLanguage()

  const [aboutData, setAboutData] = useState<AboutData | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeImage, setActiveImage] = useState(0)

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
        setAboutData(FALLBACK_DATA[locale] || FALLBACK_DATA.pt)
      }
    } catch {
      setAboutData(FALLBACK_DATA[locale] || FALLBACK_DATA.pt)
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
      <section className="relative h-[50vh] min-h-[400px] overflow-hidden">
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
              <Link to="/" className="text-white/60 hover:text-white text-sm transition-colors">← {t.navExperiencias ? 'Voltar' : 'Back'}</Link>
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
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            <div className="prose prose-lg max-w-none">
              {paragraphs.map((p, i) => (
                <p key={i} className="text-amz-terra dark:text-amz-areia/80 leading-relaxed text-base">
                  {p}
                </p>
              ))}
            </div>

            {/* Video */}
            {aboutData.video_url && (
              <div className="rounded-3xl overflow-hidden shadow-xl border border-amz-areia-dark/20 dark:border-white/5">
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

            {/* Gallery */}
            {aboutData.gallery_urls.length > 0 && (
              <div className="space-y-4">
                <h2 className="font-maybug text-2xl text-amz-terra dark:text-amz-areia">Galeria</h2>
                <div className="rounded-3xl overflow-hidden shadow-xl border border-amz-areia-dark/20 dark:border-white/5">
                  <img
                    src={aboutData.gallery_urls[activeImage]}
                    alt={`Galeria ${activeImage + 1}`}
                    className="w-full h-80 object-cover"
                  />
                </div>
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {aboutData.gallery_urls.map((url, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveImage(i)}
                      className={`shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${
                        i === activeImage
                          ? 'border-amz-dourado scale-105'
                          : 'border-transparent opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={url} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Mission & Vision */}
            <div className="bg-white dark:bg-white/5 rounded-3xl p-8 shadow-md border border-amz-areia-dark/20 dark:border-white/5">
              <div className="w-12 h-12 rounded-2xl bg-amz-dourado/10 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-amz-dourado" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="font-maybug text-lg text-amz-terra dark:text-amz-areia mb-3">Missão</h3>
              <p className="text-sm text-amz-terra-light dark:text-amz-areia/60 leading-relaxed">{aboutData.mission}</p>
            </div>

            <div className="bg-white dark:bg-white/5 rounded-3xl p-8 shadow-md border border-amz-areia-dark/20 dark:border-white/5">
              <div className="w-12 h-12 rounded-2xl bg-amz-oceano/10 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-amz-oceano" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <h3 className="font-maybug text-lg text-amz-terra dark:text-amz-areia mb-3">Visão</h3>
              <p className="text-sm text-amz-terra-light dark:text-amz-areia/60 leading-relaxed">{aboutData.vision}</p>
            </div>

            {/* Contact Info */}
            <div className="bg-amz-terra-dark dark:bg-white/5 rounded-3xl p-8 text-white">
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
                  Fortalezinha
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

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
