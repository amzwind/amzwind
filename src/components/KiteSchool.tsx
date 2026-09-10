import { useNavigate } from 'react-router-dom'
import { useLanguage } from '../contexts/LanguageContext'
import { useCart } from '../contexts/CartContext'

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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {aulas.map((aula) => (
            <div
              key={aula.titulo}
              className={`group rounded-3xl p-6 transition-all duration-500 hover:-translate-y-2 relative overflow-hidden ${
                aula.destaque
                  ? 'bg-gradient-to-br from-amz-terra via-amz-terra to-amz-terra-dark text-white shadow-2xl scale-[1.02] ring-2 ring-amz-dourado/30'
                  : 'bg-amz-areia/50 dark:bg-white/5 shadow-md hover:shadow-xl backdrop-blur-sm border border-amz-areia-dark/30 dark:border-white/5'
              }`}
            >
              {/* Glassmorphism decorative element */}
              <div className={`absolute -top-20 -right-20 w-40 h-40 rounded-full blur-3xl transition-opacity duration-500 ${
                aula.destaque ? 'bg-amz-dourado/20 opacity-100' : 'bg-amz-oceano/10 opacity-0 group-hover:opacity-100'
              }`} />

              {aula.destaque && (
                <span className="relative inline-block text-xs font-bold uppercase tracking-wider bg-amz-dourado text-white px-4 py-1.5 rounded-full mb-4 shadow-lg">
                  {t.ksMostPopular}
                </span>
              )}

              <h3 className={`relative text-2xl font-maybug mb-1 ${aula.destaque ? 'text-white' : 'text-amz-terra dark:text-amz-areia'}`}>
                {aula.titulo}
              </h3>

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
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                      aula.destaque
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
                className={`relative w-full py-3.5 rounded-2xl font-semibold text-sm transition-all duration-300 ${
                  aula.destaque
                    ? 'bg-white text-amz-terra hover:bg-amz-areia hover:shadow-lg'
                    : 'bg-amz-terra text-white hover:bg-amz-terra-dark hover:shadow-lg dark:bg-amz-areia dark:text-amz-terra-dark dark:hover:bg-white'
                }`}
              >
                {t.ksSchedule}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
