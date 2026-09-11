import { Link } from 'react-router-dom'

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
    <section id="experiencias" className="relative py-16 md:py-24 px-4 bg-amz-areia overflow-hidden">
      <div className="absolute inset-0 bg-patterns opacity-5 pointer-events-none" />
      <div className="relative max-w-7xl mx-auto">
        <div className="text-center mb-12 fade-up">
          <p className="section-subtitle mb-2">Descubra</p>
          <h2 className="section-title">Experiências & Downwinds</h2>
          <p className="text-amz-terra-light mt-3 max-w-md mx-auto">
            Rotas exclusivas pela Amazônia Atlântica. Cada trajeto é uma nova aventura.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {experiencias.map((exp) => (
            <Link
              key={exp.id}
              to={`/experiencia/${exp.id}`}
              className="card-exp fade-up group cursor-pointer block rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-md transition-all duration-300"
            >
              <div className={`h-2 bg-gradient-to-r ${exp.cor}`} />
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-amz-oceano bg-amz-oceano/10 px-2 py-1 rounded-full">
                      {exp.tipo}
                    </span>
                    <h3 className="text-xl font-maybug text-amz-terra mt-2 group-hover:text-amber-700 transition-colors">
                      {exp.titulo}
                    </h3>
                  </div>
                  <span className="text-3xl">{exp.icone}</span>
                </div>

                <p className="text-sm text-amz-terra-light leading-relaxed mb-4">
                  {exp.descricao}
                </p>

                <div className="flex items-center justify-between text-xs text-amz-terra-light pt-3 border-t border-amber-900/10">
                  <div className="flex items-center gap-4">
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
                  <span className="font-semibold text-amz-terra flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    Ver Detalhes →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}