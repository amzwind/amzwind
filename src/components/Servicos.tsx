import { useLanguage } from '../contexts/LanguageContext'

export default function Servicos() {
  const { t } = useLanguage()

  const servicos = [
    {
      titulo: t.svc1Title,
      descricao: t.svc1Desc,
      preco: t.svc1Price,
      icone: (
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
        </svg>
      ),
      color: 'from-amz-oceano to-amz-oceano-dark',
    },
    {
      titulo: t.svc2Title,
      descricao: t.svc2Desc,
      preco: t.svc2Price,
      icone: (
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
        </svg>
      ),
      color: 'from-amz-dourado to-amber-700',
    },
    {
      titulo: t.svc3Title,
      descricao: t.svc3Desc,
      preco: t.svc3Price,
      icone: (
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
        </svg>
      ),
      color: 'from-amz-bio to-amz-bio-dark',
    },
    {
      titulo: t.svc4Title,
      descricao: t.svc4Desc,
      preco: t.svc4Price,
      icone: (
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
      color: 'from-amz-terra to-amz-terra-dark',
    },
  ]

  return (
    <section id="servicos" className="py-16 md:py-24 px-4 bg-amz-areia dark:bg-amz-terra-dark transition-colors duration-500">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12 fade-up">
          <p className="section-subtitle mb-2 dark:text-amz-areia/50">{t.svcLabel}</p>
          <h2 className="section-title dark:text-amz-areia">{t.svcTitle}</h2>
          <p className="text-amz-terra-light dark:text-amz-areia/60 mt-3 max-w-md mx-auto">
            {t.svcSubtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {servicos.map((servico) => (
            <div
              key={servico.titulo}
              className="group bg-white dark:bg-white/5 rounded-3xl p-6 shadow-md hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 fade-up backdrop-blur-sm border border-amz-areia-dark/20 dark:border-white/5 relative overflow-hidden"
            >
              {/* Gradient accent line */}
              <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${servico.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

              {/* Glassmorphism icon */}
              <div className="w-14 h-14 rounded-2xl bg-amz-terra/5 dark:bg-white/5 text-amz-terra dark:text-amz-dourado flex items-center justify-center mb-5 group-hover:bg-amz-terra dark:group-hover:bg-amz-dourado group-hover:text-white dark:group-hover:text-amz-terra-dark transition-all duration-500 group-hover:scale-110 group-hover:shadow-lg">
                {servico.icone}
              </div>

              <h3 className="text-lg font-maybug text-amz-terra dark:text-amz-areia mb-2 group-hover:text-amz-oceano dark:group-hover:text-amz-dourado transition-colors">
                {servico.titulo}
              </h3>

              <p className="text-sm text-amz-terra-light dark:text-amz-areia/50 leading-relaxed mb-4">
                {servico.descricao}
              </p>

              <p className="text-sm font-semibold text-amz-oceano dark:text-amz-dourado">
                {servico.preco}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
