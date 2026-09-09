const experiencias = [
  {
    id: 1,
    titulo: 'Ajuruteua → Salinas',
    tipo: 'Downwind',
    duracao: '2h30',
    nivel: 'Intermediário',
    descricao: 'Navegue entre praias selvagens e águas cristalinas do Pará. Vento constante e ondas perfeitas para um downwind inesquecível.',
    cor: 'from-amz-oceano to-amz-oceano-dark',
    icone: '🌊',
  },
  {
    id: 2,
    titulo: 'Salinas → Algodoal',
    tipo: 'Downwind',
    duracao: '3h',
    nivel: 'Intermediário/Avançado',
    descricao: 'Expedição completa entre ilhas paradisíacas. Parada para mergulho e contemplação da fauna amazônica.',
    cor: 'from-amz-bio to-amz-bio-dark',
    icone: '🏝️',
  },
  {
    id: 3,
    titulo: 'Voo dos Guarás',
    tipo: 'Expedição',
    duracao: '4h',
    nivel: 'Todos os níveis',
    descricao: 'Acompanhe o voo dos guarás vermelhos ao entardecer. Uma experiência mágica de contemplação e natureza.',
    cor: 'from-amz-terra to-amz-terra-dark',
    icone: '🦜',
  },
  {
    id: 4,
    titulo: 'Carimbó na Praia',
    tipo: 'Vivência Cultural',
    duracao: '2h',
    nivel: 'Todos os níveis',
    descricao: 'Roda de Carimbó com mestres locais ao som do mar. Mergulho na cultura e no ritmo amazônico.',
    cor: 'from-amz-dourado to-amber-700',
    icone: '🥁',
  },
]

export default function Experiencias() {
  return (
    <section id="experiencias" className="py-16 md:py-24 px-4 bg-amz-areia">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12 fade-up">
          <p className="section-subtitle mb-2">Descubra</p>
          <h2 className="section-title">Experiências & Downwinds</h2>
          <p className="text-amz-terra-light mt-3 max-w-md mx-auto">
            Rotas exclusivas pela Amazônia Atlântica. Cada trajeto é uma nova aventura.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {experiencias.map((exp) => (
            <div key={exp.id} className="card-exp fade-up group cursor-pointer">
              <div className={`h-2 bg-gradient-to-r ${exp.cor}`} />
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-amz-oceano bg-amz-oceano/10 px-2 py-1 rounded-full">
                      {exp.tipo}
                    </span>
                    <h3 className="text-xl font-maybug text-amz-terra mt-2">
                      {exp.titulo}
                    </h3>
                  </div>
                  <span className="text-3xl">{exp.icone}</span>
                </div>

                <p className="text-sm text-amz-terra-light leading-relaxed mb-4">
                  {exp.descricao}
                </p>

                <div className="flex items-center gap-4 text-xs text-amz-terra-light">
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {exp.duracao}
                  </span>
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    {exp.nivel}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
