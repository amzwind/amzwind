import { useNavigate } from 'react-router-dom'
import { useLanguage } from '../contexts/LanguageContext'
import { useCart } from '../contexts/CartContext'
import { schoolImages } from '../data/media'
import FavoriteButton from './FavoriteButton'
import TestimonialsCarousel from './TestimonialsCarousel'

export default function KiteSchool() {
  const { t } = useLanguage()
  const navigate = useNavigate()
  const { addItem } = useCart()

  const aulas = [
    {
      titulo: t.ksBasic,
      preco: 'R$ 150',
      precoNum: 150,
      duracao: '2h',
      inclui: t.ksBasicIncludes,
    },
    {
      titulo: t.ksBeginner,
      preco: 'R$ 250',
      precoNum: 250,
      duracao: '3h',
      inclui: t.ksBeginnerIncludes,
      destaque: true,
    },
    {
      titulo: t.ksSpecific,
      preco: 'R$ 350',
      precoNum: 350,
      duracao: '4h',
      inclui: t.ksSpecificIncludes,
    },
  ]

  function handleSchedule(aula: typeof aulas[number]) {
    if (aula.titulo === t.ksBeginner) {
      navigate('/aula/iniciante')
      return
    }
    addItem({
      id: `class-${aula.titulo}`,
      type: 'class',
      title: `${t.customerTypeClass}: ${aula.titulo}`,
      price: aula.precoNum,
      image_url: null,
    })
    navigate('/checkout')
  }

  return (
    <section id="escola" className="py-16 md:py-24 px-4 bg-white dark:bg-[#2A1508] transition-colors duration-500">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12 fade-up">
          <p className="section-subtitle mb-2 dark:text-amz-areia/50">{t.ksLabel}</p>
          <h2 className="section-title dark:text-amz-areia">{t.ksTitle}</h2>
          <p className="text-amz-terra-light dark:text-amz-areia/60 mt-3 max-w-md mx-auto">
            {t.ksSubtitle}
          </p>
        </div>

        {/* Section Image */}
        <div className="relative rounded-3xl overflow-hidden mb-12 fade-up h-48 md:h-64">
          <img
            src={schoolImages[0]?.src || '/kite-surfing.jpeg'}
            alt="Aula de kitesurf"
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6 text-center">
            <p className="text-white/90 text-sm font-medium">{t.ksSubtitle}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {aulas.map((aula) => (
            <div
              key={aula.titulo}
              className={`group rounded-3xl p-6 transition-all duration-500 hover:-translate-y-2 relative overflow-hidden ${aula.destaque
                  ? 'bg-gradient-to-br from-amz-terra via-amz-terra to-amz-terra-dark text-white shadow-2xl scale-[1.02] ring-2 ring-amz-dourado/30'
                  : 'bg-amz-areia/50 dark:bg-white/5 shadow-md hover:shadow-xl backdrop-blur-sm border border-amz-areia-dark/30 dark:border-white/5'
                }`}
            >
              <div className={`absolute -top-20 -right-20 w-40 h-40 rounded-full blur-3xl transition-opacity duration-500 ${aula.destaque ? 'bg-amz-dourado/20 opacity-100' : 'bg-amz-oceano/10 opacity-0 group-hover:opacity-100'
                }`} />

              {aula.destaque && (
                <span className="relative inline-block text-xs font-bold uppercase tracking-wider bg-amz-dourado text-white px-4 py-1.5 rounded-full mb-4 shadow-lg">
                  {t.ksMostPopular}
                </span>
              )}

              <div className="relative flex items-start justify-between mb-1">
                <h3 className={`relative text-2xl font-maybug ${aula.destaque ? 'text-white' : 'text-amz-terra dark:text-amz-areia'}`}>
                  {aula.titulo}
                </h3>
                <FavoriteButton
                  id={`class-${aula.titulo}`}
                  type="class"
                  title={`${t.customerTypeClass}: ${aula.titulo}`}
                  price={aula.precoNum}
                  image_url={schoolImages[0]?.src || null}
                  size="sm"
                  className={aula.destaque ? 'bg-white/20 text-white hover:bg-white/30' : ''}
                />
              </div>

              <div className="relative flex items-baseline gap-2 mb-6">
                <span className={`text-3xl font-bold ${aula.destaque ? 'text-white' : 'text-amz-terra dark:text-amz-areia'}`}>
                  {aula.preco}
                </span>
                <span className={`text-sm ${aula.destaque ? 'text-white/60' : 'text-amz-terra-light dark:text-amz-areia/50'}`}>
                  / {aula.duracao}
                </span>
              </div>

              <ul className="relative space-y-3 mb-8">
                {aula.inclui.map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${aula.destaque
                        ? 'bg-amz-dourado/20'
                        : 'bg-amz-bio/10 dark:bg-amz-bio/20'
                      }`}>
                      <svg
                        className={`w-3 h-3 ${aula.destaque ? 'text-amz-dourado' : 'text-amz-bio'}`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <span className={aula.destaque ? 'text-white/85' : 'text-amz-terra-light dark:text-amz-areia/60'}>
                      {item}
                    </span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleSchedule(aula)}
                className={`relative w-full py-3.5 rounded-2xl font-semibold text-sm transition-all duration-300 ${aula.destaque
                    ? 'bg-white text-amz-terra hover:bg-amz-areia hover:shadow-lg'
                    : 'bg-amz-terra text-white hover:bg-amz-terra-dark hover:shadow-lg dark:bg-amz-areia dark:text-amz-terra-dark dark:hover:bg-white'
                  }`}
              >
                {t.ksSchedule}
              </button>
            </div>
          ))}
        </div>

        {/* Documentos obrigatórios */}
        <div className="mt-12 fade-up">
          <div className="bg-amz-areia/60 dark:bg-white/[0.03] rounded-3xl border border-amz-areia-dark/20 dark:border-white/5 p-7 md:p-8">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-amz-dourado/10 dark:bg-amz-dourado/20 flex items-center justify-center shrink-0">
                <svg className="w-6 h-6 text-amz-dourado" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <h3 className="font-maybug text-xl text-amz-terra dark:text-amz-areia mb-1">
                  Documentos &amp; Contratos
                </h3>
                <p className="text-sm text-amz-terra-light dark:text-amz-areia/60">
                  Para sua segurança e a nossa, é necessário assinar o contrato e preencher o formulário de saúde antes das atividades.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Contrato de Aulas */}
              <a
                href="/contratos/contrato-aulas.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-3 bg-white dark:bg-white/5 rounded-2xl p-4 border border-amz-areia-dark/15 dark:border-white/5 hover:border-amz-dourado/50 hover:shadow-md transition-all duration-300"
              >
                <div className="w-10 h-10 rounded-xl bg-amz-terra/10 dark:bg-amz-terra/20 flex items-center justify-center shrink-0 group-hover:bg-amz-terra group-hover:text-white transition-all duration-300">
                  <svg className="w-5 h-5 text-amz-terra group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-amz-terra dark:text-amz-areia truncate">Contrato de Aulas</p>
                  <p className="text-xs text-amz-terra-light dark:text-amz-areia/50">Aulas de kitesurf · PDF</p>
                </div>
                <svg className="w-4 h-4 text-amz-terra-light dark:text-amz-areia/30 group-hover:text-amz-dourado shrink-0 ml-auto transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>

              {/* Contrato de Experiências */}
              <a
                href="/contratos/contrato-experiencias.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-3 bg-white dark:bg-white/5 rounded-2xl p-4 border border-amz-areia-dark/15 dark:border-white/5 hover:border-amz-dourado/50 hover:shadow-md transition-all duration-300"
              >
                <div className="w-10 h-10 rounded-xl bg-amz-oceano/10 dark:bg-amz-oceano/20 flex items-center justify-center shrink-0 group-hover:bg-amz-oceano group-hover:text-white transition-all duration-300">
                  <svg className="w-5 h-5 text-amz-oceano group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-amz-terra dark:text-amz-areia truncate">Contrato de Experiências</p>
                  <p className="text-xs text-amz-terra-light dark:text-amz-areia/50">Vivências &amp; pacotes · PDF</p>
                </div>
                <svg className="w-4 h-4 text-amz-terra-light dark:text-amz-areia/30 group-hover:text-amz-dourado shrink-0 ml-auto transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>

              {/* Formulário PAR-Q */}
              <a
                href="https://docs.google.com/forms/d/e/1FAIpQLSfD0XV1rhIq5pkNn8mIfgRHq81aunRaxxHLAMuEjTMt4OoAbw/viewform"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-3 bg-white dark:bg-white/5 rounded-2xl p-4 border border-amz-areia-dark/15 dark:border-white/5 hover:border-amz-bio/50 hover:shadow-md transition-all duration-300"
              >
                <div className="w-10 h-10 rounded-xl bg-amz-bio/10 dark:bg-amz-bio/20 flex items-center justify-center shrink-0 group-hover:bg-amz-bio group-hover:text-white transition-all duration-300">
                  <svg className="w-5 h-5 text-amz-bio group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  </svg>
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-amz-terra dark:text-amz-areia truncate">Formulário PAR-Q</p>
                  <p className="text-xs text-amz-terra-light dark:text-amz-areia/50">Prontidão física · Google Forms</p>
                </div>
                <svg className="w-4 h-4 text-amz-terra-light dark:text-amz-areia/30 group-hover:text-amz-bio shrink-0 ml-auto transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>

            <p className="text-xs text-amz-terra-light dark:text-amz-areia/40 mt-4 text-center">
              ⚠️ O preenchimento do formulário PAR-Q e a assinatura do contrato são obrigatórios antes de qualquer atividade.
            </p>
          </div>
        </div>

        {/* Carrossel de Depoimentos */}
        <TestimonialsCarousel />
      </div>
    </section>
  )
}
