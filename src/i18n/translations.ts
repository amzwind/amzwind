export type Locale = 'pt' | 'en' | 'es'

export const locales: { code: Locale; label: string; flag: string }[] = [
  { code: 'pt', label: 'PT', flag: '🇧🇷' },
  { code: 'en', label: 'EN', flag: '🇬🇧' },
  { code: 'es', label: 'ES', flag: '🇪🇸' },
]

export type TranslationKeys = {
  // Header
  navExperiencias: string
  navEscola: string
  navServicos: string
  navContato: string

  // Hero
  heroTagline: string
  heroTitle1: string
  heroTitleHighlight: string
  heroSubtitle: string
  heroCTA1: string
  heroCTA2: string

  // Experiências
  expLabel: string
  expTitle: string
  expSubtitle: string

  // Experiência cards
  exp1Title: string
  exp1Desc: string
  exp2Title: string
  exp2Desc: string
  exp3Title: string
  exp3Desc: string
  exp4Title: string
  exp4Desc: string

  badgeDownwind: string
  badgeExpedition: string
  badgeCultural: string
  levelIntermediate: string
  levelIntermediateAdv: string
  levelAll: string

  // KiteSchool
  ksLabel: string
  ksTitle: string
  ksSubtitle: string
  ksMostPopular: string
  ksSchedule: string
  ksBasic: string
  ksBasicIncludes: string[]
  ksBeginner: string
  ksBeginnerIncludes: string[]
  ksSpecific: string
  ksSpecificIncludes: string[]

  // Serviços
  svcLabel: string
  svcTitle: string
  svcSubtitle: string
  svc1Title: string
  svc1Desc: string
  svc1Price: string
  svc2Title: string
  svc2Desc: string
  svc2Price: string
  svc3Title: string
  svc3Desc: string
  svc3Price: string
  svc4Title: string
  svc4Desc: string
  svc4Price: string

  // Footer
  footerAbout: string
  footerContact: string
  footerLocation: string
  footerRights: string
}

const pt: TranslationKeys = {
  navExperiencias: 'Experiências',
  navEscola: 'Escola',
  navServicos: 'Serviços',
  navContato: 'Contato',

  heroTagline: 'Salinópolis · Ilha do Marajó · Ajuruteua',
  heroTitle1: 'A Amazônia é o nosso',
  heroTitleHighlight: 'ponto de partida',
  heroSubtitle: 'A aventura é do cliente, a responsabilidade é nossa. Kitesurf, downwinds e expedições na Amazônia Atlântica.',
  heroCTA1: 'Ver Experiências',
  heroCTA2: 'Agendar Aula',

  expLabel: 'Descubra',
  expTitle: 'Experiências & Downwinds',
  expSubtitle: 'Rotas exclusivas pela Amazônia Atlântica. Cada trajeto é uma nova aventura.',

  exp1Title: 'Ajuruteua → Salinas',
  exp1Desc: 'Navegue entre praias selvagens e águas cristalinas do Pará. Vento constante e ondas perfeitas para um downwind inesquecível.',
  exp2Title: 'Salinas → Algodoal',
  exp2Desc: 'Expedição completa entre ilhas paradisíacas. Parada para mergulho e contemplação da fauna amazônica.',
  exp3Title: 'Voo dos Guarás',
  exp3Desc: 'Acompanhe o voo dos guarás vermelhos ao entardecer. Uma experiência mágica de contemplação e natureza.',
  exp4Title: 'Carimbó na Praia',
  exp4Desc: 'Roda de Carimbó com mestres locais ao som do mar. Mergulho na cultura e no ritmo amazônico.',

  badgeDownwind: 'Downwind',
  badgeExpedition: 'Expedição',
  badgeCultural: 'Vivência Cultural',
  levelIntermediate: 'Intermediário',
  levelIntermediateAdv: 'Intermediário/Avançado',
  levelAll: 'Todos os níveis',

  ksLabel: 'Aprenda',
  ksTitle: 'KiteSchool',
  ksSubtitle: 'Aulas particulares e em grupo com instrutores certificados. Do primeiro voo à independência.',
  ksMostPopular: 'Mais Popular',
  ksSchedule: 'Agendar Aula',
  ksBasic: 'Básico',
  ksBasicIncludes: ['Teoria na praia', 'Montagem do equipamento', 'Primeiros voos na areia', 'Supervisão individual'],
  ksBeginner: 'Iniciante',
  ksBeginnerIncludes: ['Revisão de segurança', 'Controle na água', 'Voo assistido', 'Prática de manobras básicas'],
  ksSpecific: 'Específico',
  ksSpecificIncludes: ['Técnica avançada', 'Downwind guiado', 'Corte e transição', 'Análise de vídeo'],

  svcLabel: 'Complementos',
  svcTitle: 'Serviços & Produtos',
  svcSubtitle: 'Tudo que você precisa para sua experiência amazônica, em um só lugar.',
  svc1Title: 'Camisas UV',
  svc1Desc: 'Proteção solar com design da Amazon Wind. Tecido technical de secagem rápida.',
  svc1Price: 'A partir de R$ 89',
  svc2Title: 'Bonés',
  svc2Desc: 'Bonés com abas bordadas. Ideais para os ventos amazônicos.',
  svc2Price: 'A partir de R$ 59',
  svc3Title: 'Transfer',
  svc3Desc: 'Recolocação e transfer entre praias. Veículos adaptados para areia.',
  svc3Price: 'Sob consulta',
  svc4Title: 'Hospedagem',
  svc4Desc: 'Parceria com pousadas e residências em Salinópolis e Ajuruteua.',
  svc4Price: 'Sob consulta',

  footerAbout: 'Escola de Kitesurf e Expedições na Amazônia Atlântica. Fundada por Pingo, Pablo e Rafael.',
  footerContact: 'Contato',
  footerLocation: 'Localização',
  footerRights: 'Todos os direitos reservados.',
}

const en: TranslationKeys = {
  navExperiencias: 'Experiences',
  navEscola: 'School',
  navServicos: 'Services',
  navContato: 'Contact',

  heroTagline: 'Salinópolis · Marajó Island · Ajuruteua',
  heroTitle1: 'The Amazon is our',
  heroTitleHighlight: 'starting point',
  heroSubtitle: 'The adventure belongs to the customer, the responsibility is ours. Kitesurf, downwinds and expeditions in the Atlantic Amazon.',
  heroCTA1: 'See Experiences',
  heroCTA2: 'Book a Lesson',

  expLabel: 'Discover',
  expTitle: 'Experiences & Downwinds',
  expSubtitle: 'Exclusive routes through the Atlantic Amazon. Every journey is a new adventure.',

  exp1Title: 'Ajuruteua → Salinas',
  exp1Desc: 'Navigate through wild beaches and crystal-clear waters of Pará. Constant wind and perfect waves for an unforgettable downwind.',
  exp2Title: 'Salinas → Algodoal',
  exp2Desc: 'Complete expedition between paradise islands. Stop for diving and observing the Amazonian fauna.',
  exp3Title: 'Scarlet Ibis Flight',
  exp3Desc: 'Follow the flight of the scarlet ibis at sunset. A magical experience of contemplation and nature.',
  exp4Title: 'Carimbó on the Beach',
  exp4Desc: 'Carimbó circle with local masters to the sound of the sea. Immersion in Amazonian culture and rhythm.',

  badgeDownwind: 'Downwind',
  badgeExpedition: 'Expedition',
  badgeCultural: 'Cultural Experience',
  levelIntermediate: 'Intermediate',
  levelIntermediateAdv: 'Intermediate/Advanced',
  levelAll: 'All levels',

  ksLabel: 'Learn',
  ksTitle: 'KiteSchool',
  ksSubtitle: 'Private and group lessons with certified instructors. From your first flight to independence.',
  ksMostPopular: 'Most Popular',
  ksSchedule: 'Book a Lesson',
  ksBasic: 'Basic',
  ksBasicIncludes: ['Beach theory', 'Equipment setup', 'First flights on sand', 'Individual supervision'],
  ksBeginner: 'Beginner',
  ksBeginnerIncludes: ['Safety review', 'Water control', 'Assisted flight', 'Basic maneuver practice'],
  ksSpecific: 'Specific',
  ksSpecificIncludes: ['Advanced technique', 'Guided downwind', 'Cut and transition', 'Video analysis'],

  svcLabel: 'Extras',
  svcTitle: 'Services & Products',
  svcSubtitle: 'Everything you need for your Amazonian experience, all in one place.',
  svc1Title: 'UV Shirts',
  svc1Desc: 'Solar protection with Amazon Wind design. Technical quick-dry fabric.',
  svc1Price: 'From R$ 89',
  svc2Title: 'Caps',
  svc2Desc: 'Caps with embroidered brims. Ideal for the Amazonian winds.',
  svc2Price: 'From R$ 59',
  svc3Title: 'Transfer',
  svc3Desc: 'Relocation and transfer between beaches. Vehicles adapted for sand.',
  svc3Price: 'Upon request',
  svc4Title: 'Accommodation',
  svc4Desc: 'Partnership with inns and residences in Salinópolis and Ajuruteua.',
  svc4Price: 'Upon request',

  footerAbout: 'Kitesurf School and Expeditions in the Atlantic Amazon. Founded by Pingo, Pablo and Rafael.',
  footerContact: 'Contact',
  footerLocation: 'Location',
  footerRights: 'All rights reserved.',
}

const es: TranslationKeys = {
  navExperiencias: 'Experiencias',
  navEscola: 'Escuela',
  navServicos: 'Servicios',
  navContato: 'Contacto',

  heroTagline: 'Salinópolis · Isla de Marajó · Ajuruteua',
  heroTitle1: 'La Amazonía es nuestro',
  heroTitleHighlight: 'punto de partida',
  heroSubtitle: 'La aventura es del cliente, la responsabilidad es nuestra. Kitesurf, downwinds y expediciones en la Amazonia Atlántica.',
  heroCTA1: 'Ver Experiencias',
  heroCTA2: 'Agendar Clase',

  expLabel: 'Descubre',
  expTitle: 'Experiencias & Downwinds',
  expSubtitle: 'Rutas exclusivas por la Amazonia Atlántica. Cada trayecto es una nueva aventura.',

  exp1Title: 'Ajuruteua → Salinas',
  exp1Desc: 'Navega entre playas salvajes y aguas cristalinas de Pará. Viento constante y olas perfectas para un downwind inolvidable.',
  exp2Title: 'Salinas → Algodoal',
  exp2Desc: 'Expedición completa entre islas paradisíacas. Parada para buceo y contemplación de la fauna amazónica.',
  exp3Title: 'Vuelo de los Guáros',
  exp3Desc: 'Sigue el vuelo de los guáros rojos al atardecer. Una experiencia mágica de contemplación y naturaleza.',
  exp4Title: 'Carimbó en la Playa',
  exp4Desc: 'Rueda de Carimbó con maestros locales al son del mar. Inmersión en la cultura y el ritmo amazónico.',

  badgeDownwind: 'Downwind',
  badgeExpedition: 'Expedición',
  badgeCultural: 'Experiencia Cultural',
  levelIntermediate: 'Intermedio',
  levelIntermediateAdv: 'Intermedio/Avanzado',
  levelAll: 'Todos los niveles',

  ksLabel: 'Aprende',
  ksTitle: 'KiteSchool',
  ksSubtitle: 'Clases particulares y en grupo con instructores certificados. Desde tu primer vuelo hasta la independencia.',
  ksMostPopular: 'Más Popular',
  ksSchedule: 'Agendar Clase',
  ksBasic: 'Básico',
  ksBasicIncludes: ['Teoría en la playa', 'Montaje del equipo', 'Primeros vuelos en la arena', 'Supervisión individual'],
  ksBeginner: 'Principiante',
  ksBeginnerIncludes: ['Revisión de seguridad', 'Control en el agua', 'Vuelo asistido', 'Práctica de maniobras básicas'],
  ksSpecific: 'Específico',
  ksSpecificIncludes: ['Técnica avanzada', 'Downwind guiado', 'Corte y transición', 'Análisis de video'],

  svcLabel: 'Extras',
  svcTitle: 'Servicios & Productos',
  svcSubtitle: 'Todo lo que necesitas para tu experiencia amazónica, en un solo lugar.',
  svc1Title: 'Camisas UV',
  svc1Desc: 'Protección solar con diseño Amazon Wind. Tejido técnico de secado rápido.',
  svc1Price: 'Desde R$ 89',
  svc2Title: 'Gorras',
  svc2Desc: 'Gorras con viseras bordadas. Ideales para los vientos amazónicos.',
  svc2Price: 'Desde R$ 59',
  svc3Title: 'Transfer',
  svc3Desc: 'Reubicación y transfer entre playas. Vehículos adaptados para arena.',
  svc3Price: 'Bajo consulta',
  svc4Title: 'Alojamiento',
  svc4Desc: 'Asociación con posadas y residencias en Salinópolis y Ajuruteua.',
  svc4Price: 'Bajo consulta',

  footerAbout: 'Escuela de Kitesurf y Expediciones en la Amazonia Atlántica. Fundada por Pingo, Pablo y Rafael.',
  footerContact: 'Contacto',
  footerLocation: 'Ubicación',
  footerRights: 'Todos los derechos reservados.',
}

export const translations: Record<Locale, TranslationKeys> = { pt, en, es }
