/**
 * Static trip data — used as local fallback when the Supabase
 * database returns an empty list (no trips seeded yet).
 *
 * Follows the same pattern as src/data/experiences.ts and
 * src/data/products.ts.
 */

export interface StaticTrip {
  id: string
  title: string
  slug: string
  description: string
  body_text: string
  destination: string
  start_date: string
  end_date: string
  cover_url: string
  gallery_urls: string[]
  video_url: string | null
  status: 'published'
  visibility: 'public'
  max_participants: number
  participant_count: number
  is_participant: boolean
  created_by: string
  created_at: string
  updated_at: string
  schedule: Array<{ day: number; title: string; description: string }>
}

function offsetDate(days: number): string {
  const d = new Date()
  d.setDate(d.getDate() + days)
  return d.toISOString().split('T')[0]
}

export const staticTrips: StaticTrip[] = [
  {
    id: 'trip-salinas-marieta',
    title: 'Salinas → Marieta — Premium Coastal Run',
    slug: 'salinas-marieta-premium-coastal-run',
    description:
      'A rota de downwind mais exclusiva do litoral norte. 6 horas de navegação contínua entre Salinas e Marieta, com vento alísio e águas azuis-turquesa.',
    body_text:
      'Esta é a trip flagship da Amazon Wind. A rota entre Salinas e a Ilha de Marieta é longa, exigente e absolutamente espetacular: costões rochosos, praias de areia branca que só aparecem na maré baixa, e vento constante de 20 a 28 nós durante toda a travessia. Você vai acompanhado por nosso barco de suporte, com equipe de filmagem e fotografia a bordo. No final do dia, almoço premium com frutos do mar na praia de Marieta.',
    destination: 'Salinas — Marieta, Pará — Brasil',
    start_date: offsetDate(15),
    end_date: offsetDate(16),
    cover_url: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=800&q=80',
    gallery_urls: [
      'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=800&q=80',
      'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800&q=80',
      'https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=800&q=80',
    ],
    video_url: null,
    status: 'published',
    visibility: 'public',
    max_participants: 6,
    participant_count: 3,
    is_participant: false,
    created_by: '00000000-0000-0000-0000-000000000001',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    schedule: [
      { day: 1, title: 'Briefing e Preparação', description: 'Encontro em Salinas às 7h. Check de equipamentos, briefing meteorológico.' },
      { day: 1, title: 'Largada às 9h', description: 'Saída de Salinas com vento alísio. Primeira parada em praia isolada após 15km.' },
      { day: 1, title: 'Chegada a Marieta (15h)', description: 'Arrival em Marieta. Almoço premium com frutos do mar locais.' },
      { day: 2, title: 'Sessão Bônus', description: 'Kite matinal em Marieta antes do retorno.' },
    ],
  },
  {
    id: 'trip-downwind-marajo',
    title: 'Downwind Marajó — Expedição Amazônica',
    slug: 'downwind-marajo-expedicao-amazonica',
    description:
      'A rota de downwind mais selvagem do Brasil: pelo estuário do Amazonas, com golfinhos cor-de-rosa, igarapés e pôr do sol dourado sobre o Marajó.',
    body_text:
      'A Ilha do Marajó tem mais de 49.000 km² e abriga uma das concentrações mais impressionantes de fauna aquática do planeta. Nossa rota de downwind percorre o canal entre Soure e a costa atlântica, aproveitando o vento alísio constante de E/SE. Águas rasas e quentes, sem ondas, com visibilidade de fundo. Nos intervalos, paramos em praias desertas e igarapés cristalinos.',
    destination: 'Ilha do Marajó, Pará — Brasil',
    start_date: offsetDate(30),
    end_date: offsetDate(34),
    cover_url: 'https://images.unsplash.com/photo-1476611338391-6f395a0ebc7b?w=800&q=80',
    gallery_urls: [
      'https://images.unsplash.com/photo-1476611338391-6f395a0ebc7b?w=800&q=80',
      'https://images.unsplash.com/photo-1518098268026-4e89f1a2cd8e?w=800&q=80',
      'https://images.unsplash.com/photo-1591170498521-4e1cfaf72ffe?w=800&q=80',
    ],
    video_url: null,
    status: 'published',
    visibility: 'public',
    max_participants: 8,
    participant_count: 4,
    is_participant: false,
    created_by: '00000000-0000-0000-0000-000000000001',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    schedule: [
      { day: 1, title: 'Belém → Soure', description: 'Voo para Belém, barco até Soure. Check-in na pousada e briefing da expedição.' },
      { day: 2, title: 'Downwind Principal', description: 'Rota Soure > Pesqueiro (22km). Vento constante, golfinhos cor-de-rosa no canal.' },
      { day: 3, title: 'Igarapés e Natureza', description: 'Kayak pelos igarapés, trilha para ver búfalos e aves. Sessão de kite ao entardecer.' },
      { day: 4, title: 'Retorno', description: 'Última sessão matinal, almoço típico do Marajó, barco de volta a Belém.' },
    ],
  },
  {
    id: 'trip-kite-camp-prea',
    title: 'Kite Camp Preá — Temporada dos Ventos',
    slug: 'kite-camp-prea-temporada-dos-ventos',
    description:
      'Viva a temporada de kitesurf mais intensa do Nordeste. Preá, no Ceará, é o coração dos ventos do Brasil: constante, fresco e com spot incomparável para todos os níveis.',
    body_text:
      'O Preá é um dos spots de kite mais famosos do mundo — e por um bom motivo. O vento chega a 25 nós todos os dias, as lagoas de água doce são perfeitas para iniciantes e o mar aberto oferece surf e manobras para os mais avançados. Nesta trip você terá sessões guiadas de manhã e tarde, tempo livre para explorar a vila, e encontros ao pôr do sol com outros riders.',
    destination: 'Preá, Ceará — Brasil',
    start_date: offsetDate(45),
    end_date: offsetDate(52),
    cover_url: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&q=80',
    gallery_urls: [
      'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&q=80',
      'https://images.unsplash.com/photo-1506953823976-52e1fdc0149a?w=800&q=80',
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
    ],
    video_url: null,
    status: 'published',
    visibility: 'public',
    max_participants: 12,
    participant_count: 7,
    is_participant: false,
    created_by: '00000000-0000-0000-0000-000000000001',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    schedule: [
      { day: 1, title: 'Chegada e Check-in', description: 'Recepção no aeroporto de Fortaleza, transfer para Preá, jantar de boas-vindas.' },
      { day: 2, title: 'Primeira Sessão', description: 'Manhã: avaliação de nível e sessão guiada na lagoa. Tarde: kite no mar com instrutor.' },
      { day: 3, title: 'Downwind Lagoas', description: 'Rota de downwind entre as lagoas de Tatajuba — 2h de pura adrenalina.' },
      { day: 4, title: 'Dia Livre + Sunset', description: 'Sessão livre no spot favorito, happy hour com riders de todo o Brasil.' },
      { day: 5, title: 'Encerramento', description: 'Sessão de fotos e vídeo, almoço de despedida, transfer de volta.' },
    ],
  },
  {
    id: 'trip-lencois-maranhenses',
    title: 'Lençóis Maranhenses — Travessia dos Ventos',
    slug: 'lencois-maranhenses-travessia-dos-ventos',
    description:
      'Kite entre as dunas dos Lençóis Maranhenses, com lagoas azuis e turquesas. Uma das paisagens mais únicas do planeta.',
    body_text:
      'Os Lençóis Maranhenses são um dos lugares mais surreais do Brasil: dunas brancas que se estendem por centenas de quilômetros, intercaladas com lagoas de água doce de cor esmeralda e turquesa. No período certo (maio a setembro), essas lagoas estão cheias e o vento alísio está na sua melhor forma — condições perfeitas para body drag, kite leve e sessões de fotos cinematográficas.',
    destination: 'Lençóis Maranhenses, Maranhão — Brasil',
    start_date: offsetDate(60),
    end_date: offsetDate(65),
    cover_url: 'https://images.unsplash.com/photo-1534351590666-13e3e96b5017?w=800&q=80',
    gallery_urls: [
      'https://images.unsplash.com/photo-1534351590666-13e3e96b5017?w=800&q=80',
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80',
      'https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=800&q=80',
    ],
    video_url: null,
    status: 'published',
    visibility: 'public',
    max_participants: 10,
    participant_count: 2,
    is_participant: false,
    created_by: '00000000-0000-0000-0000-000000000001',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    schedule: [
      { day: 1, title: 'São Luís → Barreirinhas', description: 'Voo para São Luís, traslado até Barreirinhas. Jantar e briefing.' },
      { day: 2, title: 'Lagoa Azul e Lagoa Bonita', description: 'Trekking/kite até as lagoas mais famosas. Sessão de fotos ao meio-dia.' },
      { day: 3, title: 'Travessia das Dunas', description: 'Kite body drag nas dunas, chegada até Lagoa Esperança.' },
      { day: 4, title: 'Lagoa Preta e Retorno', description: 'Aurora sobre as dunas. Kite matinal. Retorno a Barreirinhas.' },
      { day: 5, title: 'Volta', description: 'Transfer para São Luís, flight de retorno.' },
    ],
  },
]

export function getStaticTrip(id: string): StaticTrip | undefined {
  return staticTrips.find((t) => t.id === id)
}
