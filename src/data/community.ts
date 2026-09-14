/**
 * Seed de demonstração da comunidade AMZWind.
 *
 * Camada de dados mock para Amigos, Chat, Feed e perfis públicos
 * usada como fallback elegante quando o banco não retorna registros.
 * Segue o mesmo padrão dos demais arquivos em src/data/*.
 */

export interface MockRider {
  id: string
  full_name: string
  avatar_url: string | null
  bio: string
  location: string
  home_spot: string
  level: 'Iniciante' | 'Intermediário' | 'Avançado' | 'Pro'
  mutual_friends: number
  tags: string[]
  is_online: boolean
}

export interface MockFriendRequest {
  id: string
  sender: MockRider
  created_at: string
}

export interface MockConversation {
  conversation_id: string
  rider_id: string
  name: string | null
  avatar_url: string | null
  last_message: string | null
  last_message_at: string | null
  unread_count: number
  member_count: number
}

export interface MockPost {
  id: string
  user_id: string
  content: string | null
  media_url: string | null
  likes_count: number
  comments_count: number
  shares_count: number
  liked_by_me: boolean
  created_at: string
  updated_at: string
  trip_id: string | null
}

function hoursAgo(h: number): string {
  return new Date(Date.now() - h * 3600_000).toISOString()
}

export const MOCK_RIDERS: MockRider[] = [
  {
    id: 'mock-joao-fonseca',
    full_name: 'João Fonseca',
    avatar_url: 'https://i.pravatar.cc/100?img=12',
    bio: 'Kitesurfista de Alter do Chão. Apaixonado por downwinds no Tapajós e pôr do sol no Lago Verde.',
    location: 'Santarém, PA',
    home_spot: 'Alter do Chão',
    level: 'Avançado',
    mutual_friends: 8,
    tags: ['Downwind', 'Freeride', 'Fotografia'],
    is_online: true,
  },
  {
    id: 'mock-marina-vento',
    full_name: 'Marina Vento',
    avatar_url: 'https://i.pravatar.cc/100?img=47',
    bio: 'Instrutora IKO em Salinas. Ensino iniciantes e organizo vivências com as comunidades locais.',
    location: 'Salinópolis, PA',
    home_spot: 'Praia do Atalaia',
    level: 'Pro',
    mutual_friends: 12,
    tags: ['Instrutora', 'Vivência cultural', 'Kids'],
    is_online: true,
  },
  {
    id: 'mock-carlos-rider',
    full_name: 'Carlos Rider',
    avatar_url: 'https://i.pravatar.cc/100?img=53',
    bio: 'Vejo o vento como terapia. Faço a travessia Soure–Pesqueiro todo ano e não canso nunca.',
    location: 'Belém, PA',
    home_spot: 'Ilha do Marajó',
    level: 'Intermediário',
    mutual_friends: 5,
    tags: ['Expedições', 'Marajó', 'Camping'],
    is_online: false,
  },
  {
    id: 'mock-ana-mare',
    full_name: 'Ana Maré',
    avatar_url: 'https://i.pravatar.cc/100?img=44',
    bio: 'Foil é vida! Migrando do twintip para o strapless e documentando tudo por aqui.',
    location: 'Fortaleza, CE',
    home_spot: 'Praia do Preá',
    level: 'Intermediário',
    mutual_friends: 6,
    tags: ['Foil', 'Strapless', 'Conteúdo'],
    is_online: true,
  },
  {
    id: 'mock-pedro-dunas',
    full_name: 'Pedro Dunas',
    avatar_url: 'https://i.pravatar.cc/100?img=59',
    bio: 'Guia de downwind nos Lençóis. Se tem lagoa azul e vento NE, eu estou lá.',
    location: 'Barreirinhas, MA',
    home_spot: 'Atins',
    level: 'Pro',
    mutual_friends: 3,
    tags: ['Guia', 'Lençóis', 'Downwind'],
    is_online: false,
  },
  {
    id: 'mock-luiza-kite',
    full_name: 'Luiza Kite',
    avatar_url: 'https://i.pravatar.cc/100?img=31',
    bio: 'Comecei há 6 meses e já sou viciada. Procuro parceiras de treino em Jeri!',
    location: 'Jijoca de Jericoacoara, CE',
    home_spot: 'Lagoa de Tatajuba',
    level: 'Iniciante',
    mutual_friends: 9,
    tags: ['Iniciante', 'Treino', 'Jeri'],
    is_online: true,
  },
  {
    id: 'mock-rafael-brisa',
    full_name: 'Rafael Brisa',
    avatar_url: null,
    bio: 'Big air nos finais de semana, planilha durante a semana. Vento acima de 25 nós me chama.',
    location: 'São Luís, MA',
    home_spot: 'Praia do Calhau',
    level: 'Avançado',
    mutual_friends: 4,
    tags: ['Big air', 'Freestyle'],
    is_online: false,
  },
  {
    id: 'mock-camila-ondas',
    full_name: 'Camila Ondas',
    avatar_url: 'https://i.pravatar.cc/100?img=26',
    bio: 'Kite wave e SUP. Organizadora do mutirão de limpeza das praias de Salinas.',
    location: 'Salinópolis, PA',
    home_spot: 'Farol Velho',
    level: 'Avançado',
    mutual_friends: 7,
    tags: ['Wave', 'Sustentabilidade'],
    is_online: true,
  },
  {
    id: 'mock-thiago-vela',
    full_name: 'Thiago Vela',
    avatar_url: null,
    bio: 'Engenheiro e velejador de fim de semana. Curioso por meteorologia e previsão de vento.',
    location: 'Belém, PA',
    home_spot: 'Outeiro',
    level: 'Iniciante',
    mutual_friends: 2,
    tags: ['Meteorologia', 'Iniciante'],
    is_online: false,
  },
  {
    id: 'mock-beatriz-sal',
    full_name: 'Beatriz Sal',
    avatar_url: 'https://i.pravatar.cc/100?img=38',
    bio: 'Viajei o Nordeste de kite e voltei para contar história. Próxima parada: Marajó!',
    location: 'Recife, PE',
    home_spot: 'Porto de Galinhas',
    level: 'Intermediário',
    mutual_friends: 11,
    tags: ['Viagens', 'Downwind', 'Histórias'],
    is_online: true,
  },
]

export function getMockRider(id: string): MockRider | undefined {
  return MOCK_RIDERS.find((r) => r.id === id)
}

export const MOCK_FRIEND_REQUESTS: MockFriendRequest[] = [
  { id: 'mock-req-1', sender: MOCK_RIDERS[1], created_at: hoursAgo(3) },
  { id: 'mock-req-2', sender: MOCK_RIDERS[3], created_at: hoursAgo(26) },
]

export const MOCK_CONVERSATIONS: MockConversation[] = [
  {
    conversation_id: 'mock-conv-marina',
    rider_id: MOCK_RIDERS[1].id,
    name: MOCK_RIDERS[1].full_name,
    avatar_url: MOCK_RIDERS[1].avatar_url,
    last_message: 'Bora pro downwind de sábado? Vai ter barco de apoio! 🪁',
    last_message_at: hoursAgo(0.4),
    unread_count: 2,
    member_count: 2,
  },
  {
    conversation_id: 'mock-conv-joao',
    rider_id: MOCK_RIDERS[0].id,
    name: MOCK_RIDERS[0].full_name,
    avatar_url: MOCK_RIDERS[0].avatar_url,
    last_message: 'As fotos da travessia ficaram insanas, te mandei no grupo',
    last_message_at: hoursAgo(2),
    unread_count: 0,
    member_count: 2,
  },
  {
    conversation_id: 'mock-conv-luiza',
    rider_id: MOCK_RIDERS[5].id,
    name: MOCK_RIDERS[5].full_name,
    avatar_url: MOCK_RIDERS[5].avatar_url,
    last_message: 'Consegui velejar sozinha hoje!! 🎉',
    last_message_at: hoursAgo(5),
    unread_count: 1,
    member_count: 2,
  },
  {
    conversation_id: 'mock-conv-beatriz',
    rider_id: MOCK_RIDERS[9].id,
    name: MOCK_RIDERS[9].full_name,
    avatar_url: MOCK_RIDERS[9].avatar_url,
    last_message: 'Me passa o contato do guia de Atins?',
    last_message_at: hoursAgo(30),
    unread_count: 0,
    member_count: 2,
  },
]

export const MOCK_POSTS: MockPost[] = [
  {
    id: 'mock-post-1',
    user_id: MOCK_RIDERS[1].id,
    content: 'Turma de iniciantes de hoje mandou muito bem na Lagoa do Atalaia! Vento constante de 20 nós e ninguém queria sair da água. 🌊🪁 #KiteSchool #Salinas',
    media_url: 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=800&q=80',
    likes_count: 48,
    comments_count: 12,
    shares_count: 5,
    liked_by_me: false,
    created_at: hoursAgo(4),
    updated_at: hoursAgo(4),
    trip_id: null,
  },
  {
    id: 'mock-post-2',
    user_id: MOCK_RIDERS[0].id,
    content: 'Downwind Alter → Ponta do Cururu concluído! 18km de água flat, botos acompanhando o grupo e aquele pôr do sol... Quem vem na próxima?',
    media_url: null,
    likes_count: 32,
    comments_count: 8,
    shares_count: 3,
    liked_by_me: false,
    created_at: hoursAgo(9),
    updated_at: hoursAgo(9),
    trip_id: null,
  },
  {
    id: 'mock-post-3',
    user_id: MOCK_RIDERS[9].id,
    content: 'Cheguei em Barreirinhas! Olhem essa lagoa... amanhã tem travessia das dunas com o @pedro-dunas. Ansiedade define. 🏜️',
    media_url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80',
    likes_count: 61,
    comments_count: 15,
    shares_count: 9,
    liked_by_me: false,
    created_at: hoursAgo(14),
    updated_at: hoursAgo(14),
    trip_id: null,
  },
  {
    id: 'mock-post-4',
    user_id: MOCK_RIDERS[5].id,
    content: 'Dia 12 de aula: consegui o water start dos dois lados!! Obrigada @marina-vento pela paciência infinita 😭🙏',
    media_url: null,
    likes_count: 27,
    comments_count: 19,
    shares_count: 1,
    liked_by_me: false,
    created_at: hoursAgo(22),
    updated_at: hoursAgo(22),
    trip_id: null,
  },
  {
    id: 'mock-post-5',
    user_id: MOCK_RIDERS[4].id,
    content: 'Temporada das lagoas oficialmente ABERTA. Água no nível perfeito e vento NE de 22 nós. Vagas abertas para a travessia de junho!',
    media_url: 'https://images.unsplash.com/photo-1534351590666-13e3e96b5017?w=800&q=80',
    likes_count: 54,
    comments_count: 21,
    shares_count: 12,
    liked_by_me: false,
    created_at: hoursAgo(31),
    updated_at: hoursAgo(31),
    trip_id: null,
  },
]

export const MOCK_AUTHORS: Record<string, { full_name: string | null; avatar_url: string | null }> =
  Object.fromEntries(
    MOCK_RIDERS.map((r) => [r.id, { full_name: r.full_name, avatar_url: r.avatar_url }])
  )

export function getMockPostsByRider(riderId: string): MockPost[] {
  return MOCK_POSTS.filter((p) => p.user_id === riderId)
}
