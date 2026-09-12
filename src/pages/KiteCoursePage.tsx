import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLanguage } from '../contexts/LanguageContext'
import { useCart } from '../contexts/CartContext'
import Header from '../components/Header'
import Footer from '../components/Footer'
import TripCalendar from '../components/TripCalendar'
import Lightbox from '../components/Lightbox'
import { kiteImages, schoolImages } from '../data/media'

const COURSE_PRICE = 3000
const TOTAL_CLASSES = 10

const gallerySubset = kiteImages.slice(0, 12)

const includesList = [
  '10 aulas práticas (duração total: 30h)',
  'Equipamento completo incluído (kite, barra, prancha, colete)',
  'Teoria de segurança e meteorologia',
  'Instrutor certificado IKO',
  'Seguro de acidente durante as aulas',
  'Certificado de conclusão do nível Iniciante',
  'Vídeo análise das sessões',
  'Água e lanches durante as aulas',
]

const modules = [
  {
    title: 'Módulo 1 — Fundamentos',
    lessons: 3,
    desc: 'Teoria na praia, montagem do equipamento, primeiros voos com kite na areia, controle básico da barra.',
  },
  {
    title: 'Módulo 2 — Água',
    lessons: 4,
    desc: 'Body drag, water start, controle na água, voo assistido pelo instrutor, primeiras manobras.',
  },
  {
    title: 'Módulo 3 — Independência',
    lessons: 3,
    desc: 'Manobras básicas autônomas, transição, corte, downwind guiado e análise de vídeo.',
  },
]

export default function KiteCoursePage() {
  const { t } = useLanguage()
  const navigate = useNavigate()
  const { addItem } = useCart()
  const [checkIn, setCheckIn] = useState<string | null>(null)
  const [checkOut, setCheckOut] = useState<string | null>(null)
  const [lightboxIndex, setLightboxIndex] = useState(-1)
  const [activeModule, setActiveModule] = useState(0)

  const handleNav = useCallback((dir: -1 | 1) => {
    setLightboxIndex((prev) => {
      const next = prev + dir
      if (next < 0) return gallerySubset.length - 1
      if (next >= gallerySubset.length) return 0
      return next
    })
  }, [])

  function handleSchedule() {
    if (!checkIn) return
    addItem({
      id: 'class-iniciante',
      type: 'class',
      title: `${t.customerTypeClass}: ${t.ksBeginner} — Módulo Completo (10 aulas)`,
      price: COURSE_PRICE,
      image_url: schoolImages[0]?.src || null,
    })
    navigate('/checkout')
  }

  return (
    <div className="min-h-screen bg-amz-areia dark:bg-amz-terra-dark">
      <Header />

      {/* Hero Cover */}
      <div className="relative h-[50vh] min-h-[350px] overflow-hidden">
        <img
          src={kiteImages[0]?.src || '/kite-surfing.jpeg'}
          alt="Aula de Kitesurf Iniciante"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        <div className="absolute inset-0 flex items-end">
          <div className="max-w-5xl mx-auto px-4 pb-10 w-full">
            <button
              onClick={() => navigate('/')}
              className="inline-flex items-center gap-2 text-white/70 hover:text-white text-sm font-medium mb-4 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              {t.navHome}
            </button>
            <p className="text-amz-dourado text-xs font-semibold uppercase tracking-widest mb-2">{t.ksLabel}</p>
            <h1 className="font-maybug text-3xl md:text-5xl text-white mb-3">
              {t.ksBeginner} — Módulo Completo
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-sm text-white/70">
              <span className="flex items-center gap-1.5">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                30h totais
              </span>
              <span className="w-1 h-1 rounded-full bg-white/40" />
              <span>{TOTAL_CLASSES} aulas</span>
              <span className="w-1 h-1 rounded-full bg-white/40" />
              <span className="text-amz-dourado font-bold text-lg">R$ {COURSE_PRICE.toLocaleString('pt-BR')}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 py-12 space-y-16">
        {/* Price Highlight */}
        <div className="bg-gradient-to-br from-amz-terra via-amz-terra to-amz-terra-dark rounded-3xl p-8 text-white text-center shadow-2xl">
          <p className="text-white/60 text-sm uppercase tracking-widest mb-2">Investimento</p>
          <p className="text-5xl font-bold font-maybug mb-2">R$ {COURSE_PRICE.toLocaleString('pt-BR')}</p>
          <p className="text-white/70 text-sm">{TOTAL_CLASSES} aulas completas • Equipamento incluso • Certificação IKO</p>
        </div>

        {/* Description */}
        <div className="space-y-4">
          <h2 className="font-maybug text-2xl text-amz-terra dark:text-amz-areia">Sobre o Curso</h2>
          <p className="text-amz-terra-light dark:text-amz-areia/70 leading-relaxed">
            Nosso módulo Iniciante é o programa completo para quem quer aprender kitesurf do zero.
            Com 10 aulas práticas distribuídas em 3 módulos progressivos, você sai da teoria na praia
            até realizar suas primeiras manobras de forma independente. Todo o equipamento é fornecido
            e as aulas são ministradas por instrutores certificados IKO nas melhores condições de vento
            e água da costa amazônica.
          </p>
        </div>

        {/* Video */}
        <div className="rounded-3xl overflow-hidden shadow-xl border border-amz-areia-dark/20 dark:border-white/5">
          <div className="relative pb-[56.25%] h-0 bg-black">
            <iframe
              src="https://www.youtube.com/embed/dQw4w9WgXcQ"
              className="absolute inset-0 w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title="Aula de Kitesurf Iniciante"
            />
          </div>
        </div>

        {/* Includes */}
        <div>
          <h2 className="font-maybug text-2xl text-amz-terra dark:text-amz-areia mb-6">O que está incluído</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {includesList.map((item) => (
              <div key={item} className="flex items-start gap-3 bg-white dark:bg-white/5 rounded-xl p-4 border border-amz-areia-dark/10 dark:border-white/5">
                <div className="w-6 h-6 rounded-full bg-amz-bio/10 dark:bg-amz-bio/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-3.5 h-3.5 text-amz-bio" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-sm text-amz-terra dark:text-amz-areia/80">{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Modules */}
        <div>
          <h2 className="font-maybug text-2xl text-amz-terra dark:text-amz-areia mb-6">Módulos do Curso</h2>
          <div className="space-y-4">
            {modules.map((mod, i) => (
              <div
                key={mod.title}
                className={`rounded-2xl p-6 cursor-pointer transition-all duration-300 border ${
                  activeModule === i
                    ? 'bg-amz-terra text-white border-amz-terra shadow-xl'
                    : 'bg-white dark:bg-white/5 border-amz-areia-dark/10 dark:border-white/5 hover:border-amz-dourado'
                }`}
                onClick={() => setActiveModule(i)}
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className={`font-bold ${activeModule === i ? 'text-white' : 'text-amz-terra dark:text-amz-areia'}`}>{mod.title}</h3>
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${activeModule === i ? 'bg-white/20 text-white' : 'bg-amz-dourado/10 text-amz-dourado'}`}>
                    {mod.lessons} aulas
                  </span>
                </div>
                <p className={`text-sm leading-relaxed ${activeModule === i ? 'text-white/80' : 'text-amz-terra-light dark:text-amz-areia/50'}`}>
                  {mod.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Gallery */}
        <div>
          <h2 className="font-maybug text-2xl text-amz-terra dark:text-amz-areia mb-6">Galeria</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {gallerySubset.map((img, i) => (
              <div
                key={img.src}
                className="relative rounded-xl overflow-hidden aspect-square cursor-pointer group"
                onClick={() => setLightboxIndex(i)}
              >
                <img src={img.src} alt={img.alt} loading="lazy" decoding="async" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
              </div>
            ))}
          </div>
        </div>

        {/* Scheduling + Calendar */}
        <div className="bg-white dark:bg-white/[0.03] rounded-3xl p-8 border border-amz-areia-dark/10 dark:border-white/5 shadow-lg">
          <h2 className="font-maybug text-2xl text-amz-terra dark:text-amz-areia mb-2">Agendar Aulas</h2>
          <p className="text-sm text-amz-terra-light dark:text-amz-areia/50 mb-6">
            Selecione as datas de início e término das suas aulas. O calendário abaixo ajuda a planejar seu curso.
          </p>

          <TripCalendar checkIn={checkIn} checkOut={checkOut} onCheckInChange={setCheckIn} onCheckOutChange={setCheckOut} />

          <div className="mt-6 flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div>
              <p className="text-sm text-amz-terra-light dark:text-amz-areia/50">Total do investimento</p>
              <p className="text-3xl font-bold font-maybug text-amz-dourado">R$ {COURSE_PRICE.toLocaleString('pt-BR')}</p>
            </div>
            <button
              onClick={handleSchedule}
              disabled={!checkIn}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-amz-dourado text-white font-bold text-sm hover:bg-amber-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {checkIn ? 'Agendar e Prosseguir' : 'Selecione uma data'}
            </button>
          </div>
        </div>

        {/* Reviews Placeholder */}
        <div>
          <h2 className="font-maybug text-2xl text-amz-terra dark:text-amz-areia mb-6">Avaliações</h2>
          <div className="bg-white dark:bg-white/5 rounded-2xl p-8 border border-amz-areia-dark/10 dark:border-white/5 text-center">
            <div className="w-16 h-16 rounded-full bg-amz-dourado/10 flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-amz-dourado" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
            </div>
            <p className="text-sm text-amz-terra-light dark:text-amz-areia/50">Avaliações dos alunos aparecerão aqui após conclusão dos cursos.</p>
          </div>
        </div>
      </div>

      {lightboxIndex >= 0 && (
        <Lightbox
          images={gallerySubset}
          index={lightboxIndex}
          onClose={() => setLightboxIndex(-1)}
          onNav={handleNav}
        />
      )}

      <Footer />
    </div>
  )
}
