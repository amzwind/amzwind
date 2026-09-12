import { portraitImages } from './media'

export type ExperienceType = 'individual' | 'package'

export interface StaticExperience {
  id: string
  title: string
  titleKey: string
  description: string
  descKey: string
  badge: string
  level: string
  duration: string
  price: number
  image_url: string | null
  community: string
  category_id: string | null
  type: ExperienceType
  includes?: string[]
  gallery?: string[]
  originalPrice?: number
}

export const staticExperiences: StaticExperience[] = [
  // ── INDIVIDUAL: Aula Avulsa de Kitesurf ──
  {
    id: 'exp-kite-avulsa',
    title: 'Aula de Kitesurf (Avulsa)',
    titleKey: 'expKiteAvulsa',
    description: 'Aula individual de kitesurf para quem quer experimentar ou aperfeiçoar técnicas pontuais. Duração de 1 hora com instrutor certificado IKO, equipamento completo incluso. Ideal para iniciantes que querem dar o primeiro passo ou para atletas que buscam ajustes específicos.',
    descKey: 'expKiteAvulsaDesc',
    badge: 'Aula Avulsa',
    level: 'Todos os níveis',
    duration: '1h',
    price: 300,
    image_url: portraitImages[0]?.src || '/kite-surfing.jpeg',
    community: 'Amazon Wind',
    category_id: null,
    type: 'individual',
    includes: [
      '1 hora de aula particular com instrutor IKO',
      'Equipamento completo (kite, barra, prancha, colete)',
      'Análise técnica personalizada',
      'Água e hidratação',
    ],
    gallery: [
      '/kite-surfing.jpeg', '/kite-dentro-agua.jpeg', '/kite2.jpeg', '/kite5.jpeg',
    ],
  },

  // ── PACKAGE: Curso Completo de Kitesurf ──
  {
    id: 'exp-kite-curso',
    title: 'Curso Completo de Kitesurf — Iniciante',
    titleKey: 'expKiteCurso',
    description: 'O programa mais completo para aprender kitesurf do zero. 10 aulas práticas distribuídas em 3 módulos progressivos, totalizando 30 horas de imersão. Você sai da teoria na praia até realizar manobras de forma independente. Equipamento, certificação IKO e seguro incluso.',
    descKey: 'expKiteCursoDesc',
    badge: 'Pacote Completo',
    level: 'Iniciante',
    duration: '30h (10 aulas)',
    price: 3000,
    image_url: '/aula-kitesurf-kids.jpeg',
    community: 'Amazon Wind Kite School',
    category_id: null,
    type: 'package',
    originalPrice: 3000,
    includes: [
      '10 aulas práticas (duração total: 30h)',
      'Equipamento completo incluído (kite, barra, prancha, colete)',
      'Teoria de segurança e meteorologia',
      'Instrutor certificado IKO',
      'Seguro de acidente durante as aulas',
      'Certificado de conclusão do nível Iniciante',
      'Vídeo análise das sessões',
      'Água e lanches durante as aulas',
    ],
    gallery: [
      '/aula-kitesurf-kids.jpeg', '/aula-kitesurf-kids2.jpeg', '/aula-kitesurf-kids3.jpeg',
      '/kite-surfing.jpeg', '/kite7.jpeg', '/kite11.jpeg',
    ],
  },

  // ── INDIVIDUAL: Downwind Barra do Cunhaú / Pipa ──
  {
    id: 'exp-downwind-barra',
    title: 'Downwind Barra do Cunhaú / Pipa',
    titleKey: 'exp1Title',
    description: 'Downwind clássico pelas praias de vento constante entre Barra do Cunhaú e Pipa. Vento lateral off-shore, águas cristalinas e paradas para mergulho. Rota perfeita para intermediários e avançados que buscam navegação costeira com paisagens paradisíacas.',
    descKey: 'exp1Desc',
    badge: 'Downwind',
    level: 'Intermediário',
    duration: '3h',
    price: 350,
    image_url: portraitImages[15]?.src || portraitImages[0]?.src,
    community: 'Amazon Wind',
    category_id: null,
    type: 'individual',
    includes: [
      'Guia local experimentado',
      'Equipamento de segurança (rádio, colete)',
      'Parada para mergulho e fotos',
      'Água e snack na praia',
    ],
    gallery: [
      portraitImages[15]?.src || '', portraitImages[20]?.src || '', portraitImages[25]?.src || '',
    ].filter(Boolean),
  },

  // ── INDIVIDUAL: Downwind Rota dos Ventos ──
  {
    id: 'exp-downwind-rotam',
    title: 'Downwind Rota dos Ventos',
    titleKey: 'exp2Title',
    description: 'Navegue entre praias selvagens e águas cristalinas do Pará. Vento constante e ondas perfeitas para um downwind inesquecível pela Rota dos Ventos amazônica. Experiência de pura navegação e contato com a natureza intocada.',
    descKey: 'exp2Desc',
    badge: 'Downwind',
    level: 'Intermediário/Avançado',
    duration: '4h',
    price: 450,
    image_url: portraitImages[40]?.src || portraitImages[5]?.src,
    community: 'Amazon Wind',
    category_id: null,
    type: 'individual',
    includes: [
      'Guia especializado em rotas amazônicas',
      'Equipamento de segurança completo',
      'Comunicação via rádio',
      'Paradas em praias desertas',
    ],
    gallery: [
      portraitImages[40]?.src || '', portraitImages[45]?.src || '', portraitImages[50]?.src || '',
    ].filter(Boolean),
  },

  // ── INDIVIDUAL: Downwind Salinas > Marieta ──
  {
    id: 'exp-downwind-marieta',
    title: 'Downwind Salinas > Marieta',
    titleKey: 'expDownwindMarieta',
    description: 'Rota premium de downwind entre Salinas e Marieta, com 6 horas de navegação contínua. Águas azuis-turquesa, costões rochosos e paradas em praias isoladas. Uma das rotas mais exclusivas do litoral norte, para atletas que buscam desafio e beleza natural.',
    descKey: 'expDownwindMarietaDesc',
    badge: 'Downwind Premium',
    level: 'Intermediário',
    duration: '6h',
    price: 5000,
    image_url: portraitImages[25]?.src || '/velejando.jpeg',
    community: 'Amazon Wind',
    category_id: null,
    type: 'individual',
    includes: [
      '6 horas de navegação guiada',
      'Rota Salinas > Marieta (ida e volta no support)',
      'Equipamento de segurança e rádio',
      'Parada para almoço na praia',
      'Fotos e vídeo da experiência',
      'Suporte aquático completo',
    ],
    gallery: [
      '/velejando.jpeg', '/velejando2.jpeg', '/velejando3.jpeg', '/velejando 4.jpeg',
    ],
  },

  // ── PACKAGE: Marieta Trip (All-Inclusive) ──
  {
    id: 'exp-marieta-trip',
    title: 'Marieta Trip — Pacote All-Inclusive',
    titleKey: 'expMarietaTrip',
    description: 'A experiência mais completa e exclusiva da Amazon Wind. Pacote all-inclusive que combina downwind premium, voo de avuado sobre as ilhas, visita ao Chapéu de Palha, lycra personalizada e todas as experiências da região. Uma imersão total de 2 dias na costa mais paradisíaca do Brasil.',
    descKey: 'expMarietaTripDesc',
    badge: 'Pacote All-Inclusive',
    level: 'Intermediário/Avançado',
    duration: '2 dias completos',
    price: 10000,
    image_url: '/amazon-wind.jpeg',
    community: 'Amazon Wind Premium',
    category_id: null,
    type: 'package',
    originalPrice: 14500,
    includes: [
      'Downwind Salinas > Marieta (6h de navegação)',
      'Voo de Avuado sobre as ilhas (helicóptero/avião)',
      'Visita guiada ao Chapéu de Palha (Ilha de Noronha)',
      'Lycra personalizada Amazon Wind (sua pra sempre)',
      'Almoço premium na praia com frutos do mar',
      'Fotos e vídeos profissionais da experiência',
      'Equipamento completo de segurança',
      'Suporte aquático e terrestre 24h',
      'Seguro de acidente completo',
      'Hospedagem 1 diária em pousada parceira',
    ],
    gallery: [
      '/amazon-wind.jpeg', '/amazon-wind2.jpeg', '/velejando.jpeg', '/velejando2.jpeg',
      '/por-do-sol.jpeg', '/por-do-sol2.jpeg', '/bontio.jpeg',
    ],
  },

  // ── INDIVIDUAL: Expedição Ilha do Marajó ──
  {
    id: 'exp-3',
    title: 'Expedição Ilha do Marajó',
    titleKey: 'exp3Title',
    description: 'Expedição completa pela Ilha do Marajó. Parada para mergulho, contemplação da fauna amazônica e pôr do sol entre as dunas. Uma jornada de descoberta pela maior ilha fluvial do mundo.',
    descKey: 'exp3Desc',
    badge: 'Expedição',
    level: 'Avançado',
    duration: '5h',
    price: 600,
    image_url: portraitImages[50]?.src || portraitImages[10]?.src,
    community: 'Amazon Wind',
    category_id: null,
    type: 'individual',
    includes: [
      'Guia local especializado em Marajó',
      'Mergulho em águas cristalinas',
      'Contemplação da fauna amazônica',
      'Pôr do sol entre as dunas',
    ],
    gallery: [
      portraitImages[50]?.src || '', portraitImages[55]?.src || '', portraitImages[60]?.src || '',
    ].filter(Boolean),
  },

  // ── INDIVIDUAL: Voo dos Guarás ──
  {
    id: 'exp-4',
    title: 'Voo dos Guarás',
    titleKey: 'exp4Title',
    description: 'Acompanhe o voo dos guarás vermelhos ao entardecer. Uma experiência mágica de contemplação e natureza na costa amazônica. Momento único de conexão com a fauna local.',
    descKey: 'exp4Desc',
    badge: 'Vivência Cultural',
    level: 'Todos os níveis',
    duration: '4h',
    price: 280,
    image_url: portraitImages[55]?.src || portraitImages[20]?.src,
    community: 'Amazon Wind',
    category_id: null,
    type: 'individual',
    includes: [
      'Observação dos guarás vermelhos',
      'Guia de fauna amazônica',
      'Pôr do sol panorâmico',
      'Água e snack local',
    ],
    gallery: [
      '/experiencia-por-do-sol.jpeg', '/por-do-sol.jpeg', '/por-do-sol2.jpeg',
    ],
  },
]

export function getStaticExperience(id: string): StaticExperience | undefined {
  return staticExperiences.find((e) => e.id === id)
}
