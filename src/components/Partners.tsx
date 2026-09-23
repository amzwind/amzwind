export default function Partners() {
  const partners = [
    {
      name: 'Salinópolis Turismo',
      description: 'Guias e receptivo local',
      initials: 'ST',
      color: 'from-amz-oceano to-amz-oceano-dark',
    },
    {
      name: 'Pousada do Vento',
      description: 'Hospedagem parceira',
      initials: 'PV',
      color: 'from-amz-terra to-amz-terra-dark',
    },
    {
      name: 'Aerosurf Brasil',
      description: 'Fornecedor de equipamentos',
      initials: 'AB',
      color: 'from-amz-dourado to-amber-700',
    },
    {
      name: 'Marajó Expedições',
      description: 'Parcerias em expedições',
      initials: 'ME',
      color: 'from-amz-bio to-emerald-700',
    },
    {
      name: 'Foto & Drone PA',
      description: 'Cobertura fotográfica',
      initials: 'FD',
      color: 'from-violet-600 to-violet-800',
    },
    {
      name: 'Rescue Kite',
      description: 'Segurança e resgate aquático',
      initials: 'RK',
      color: 'from-red-600 to-rose-800',
    },
  ]

  return (
    <section id="parceiros" className="py-16 md:py-24 px-4 bg-white dark:bg-[#2A1508] transition-colors duration-500">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12 fade-up">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-amz-dourado dark:text-amz-dourado/80 mb-2">
            Parceiros
          </p>
          <h2 className="text-3xl md:text-4xl font-maybug text-amz-terra dark:text-amz-areia">
            Quem caminha com a gente
          </h2>
          <p className="mt-3 text-sm md:text-base text-amz-terra-light dark:text-amz-areia/60 max-w-xl mx-auto">
            Trabalhamos com parceiros comprometidos com a segurança, qualidade e a vivência autêntica da Amazônia.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 fade-up">
          {partners.map((partner) => (
            <div
              key={partner.name}
              className="group flex flex-col items-center gap-3 p-5 rounded-3xl bg-amz-areia/50 dark:bg-white/[0.03] border border-amz-areia-dark/15 dark:border-white/5 hover:border-amz-dourado/40 hover:shadow-lg hover:-translate-y-1 transition-all duration-400 text-center cursor-default"
            >
              {/* Logo placeholder com gradiente */}
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${partner.color} flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300`}>
                <span className="text-white font-bold text-lg tracking-wide">{partner.initials}</span>
              </div>
              <div>
                <p className="text-sm font-semibold text-amz-terra dark:text-amz-areia leading-tight">{partner.name}</p>
                <p className="text-xs text-amz-terra-light dark:text-amz-areia/50 mt-0.5">{partner.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA para parceiros */}
        <div className="mt-10 text-center fade-up">
          <p className="text-sm text-amz-terra-light dark:text-amz-areia/50 mb-4">
            Quer ser um parceiro Amazon Wind?
          </p>
          <a
            href={`https://wa.me/5591991912067?text=${encodeURIComponent('Olá! Tenho interesse em me tornar parceiro da Amazon Wind.')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-amz-terra dark:bg-amz-dourado text-white font-semibold text-sm hover:bg-amz-terra-dark dark:hover:bg-amber-700 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
            </svg>
            Entrar em contato
          </a>
        </div>
      </div>
    </section>
  )
}
