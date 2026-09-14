/**
 * Static trip data — used as local fallback when the Supabase
 * database returns an empty list (no trips seeded yet).
 *
 * Follows the same pattern as src/data/experiences.ts and
 * src/data/products.ts.
 */

export interface RoutePoint {
  lat: number
  lng: number
  name: string
  type: 'start' | 'waypoint' | 'end'
  notes?: string
}

export interface WindCondition {
  direction: string
  speed_min_kts: number
  speed_max_kts: number
  tide?: string
  best_swell?: string
}

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
  start_point?: string | null
  end_point?: string | null
  start_coords?: [number, number] | null
  end_coords?: [number, number] | null
  route_points?: RoutePoint[]
  distance_km?: number
  estimated_duration?: string
  wind_condition?: WindCondition
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
    start_point: 'Praia do Farol Velho, Salinas (PA)',
    end_point: 'Ilha da Marieta (PA)',
    start_coords: [-0.602, -47.356],
    end_coords: [-0.591, -47.319],
    distance_km: 38.5,
    estimated_duration: '3h 30min',
    wind_condition: {
      direction: 'NE',
      speed_min_kts: 20,
      speed_max_kts: 28,
      tide: 'Vazante',
      best_swell: '1.2m',
    },
    route_points: [
      { lat: -0.602, lng: -47.356, name: 'Largada: Farol Velho (Salinas)', type: 'start', notes: 'Decolagem com suporte de praia e vento constante' },
      { lat: -0.5965, lng: -47.338, name: 'Praia do Atalaia', type: 'waypoint', notes: 'Ponto de apoio, transição e hidratação' },
      { lat: -0.594, lng: -47.329, name: 'Canal da Marieta', type: 'waypoint', notes: 'Água flat espelhada na maré seca' },
      { lat: -0.591, lng: -47.319, name: 'Chegada: Ilha de Marieta', type: 'end', notes: 'Pouso dos kites e almoço com frutos do mar frescos' },
    ],
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
    start_point: 'Soure - Canal do Rio Paracauari (PA)',
    end_point: 'Praia do Pesqueiro - Marajó (PA)',
    start_coords: [-0.725, -48.515],
    end_coords: [-0.662, -48.475],
    distance_km: 22.0,
    estimated_duration: '2h 15min',
    wind_condition: {
      direction: 'E/SE',
      speed_min_kts: 16,
      speed_max_kts: 22,
      tide: 'Enchendo',
      best_swell: 'Flat',
    },
    route_points: [
      { lat: -0.725, lng: -48.515, name: 'Largada: Soure', type: 'start', notes: 'Saída no canal com barco de apoio náutico' },
      { lat: -0.69, lng: -48.49, name: 'Barra do Paracauari', type: 'waypoint', notes: 'Canal de transição com avistamento de botos' },
      { lat: -0.662, lng: -48.475, name: 'Chegada: Praia do Pesqueiro', type: 'end', notes: 'Dunas e gastronomia típica marajoara' },
    ],
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
    start_point: 'Praia do Preá (CE)',
    end_point: 'Lagoa de Tatajuba (CE)',
    start_coords: [-2.812, -40.42],
    end_coords: [-2.871, -40.575],
    distance_km: 28.0,
    estimated_duration: '2h 45min',
    wind_condition: {
      direction: 'E',
      speed_min_kts: 22,
      speed_max_kts: 30,
      tide: 'Média',
      best_swell: '1.5m',
    },
    route_points: [
      { lat: -2.812, lng: -40.42, name: 'Largada: Preá', type: 'start', notes: 'Mar aberto com vento terral forte' },
      { lat: -2.796, lng: -40.513, name: 'Ponta de Jericoacoara', type: 'waypoint', notes: 'Contorno panorâmico do Parque Nacional' },
      { lat: -2.835, lng: -40.55, name: 'Guriú', type: 'waypoint', notes: 'Travessia de balsa e manguezal' },
      { lat: -2.871, lng: -40.575, name: 'Chegada: Tatajuba', type: 'end', notes: 'Água doce morna e lagoa dos sonhos' },
    ],
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
    start_point: 'Atins (MA)',
    end_point: 'Caburé / Paulino Neves (MA)',
    start_coords: [-2.571, -42.748],
    end_coords: [-2.658, -42.664],
    distance_km: 35.0,
    estimated_duration: '3h 15min',
    wind_condition: {
      direction: 'NE',
      speed_min_kts: 18,
      speed_max_kts: 25,
      tide: 'Secando',
      best_swell: 'Flat',
    },
    route_points: [
      { lat: -2.571, lng: -42.748, name: 'Largada: Atins', type: 'start', notes: 'Foz do Rio Preguiças e água salgada' },
      { lat: -2.61, lng: -42.71, name: 'Boca da Barra', type: 'waypoint', notes: 'Transição mar/rio e resting spot' },
      { lat: -2.658, lng: -42.664, name: 'Chegada: Caburé', type: 'end', notes: 'Península entre o rio Preguiças e o Oceano Atlântico' },
    ],
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
