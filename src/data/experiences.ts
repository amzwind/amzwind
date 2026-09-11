import { portraitImages } from './media'

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
}

export const staticExperiences: StaticExperience[] = [
  {
    id: 'exp-1',
    title: 'Ajuruteua → Salinas',
    titleKey: 'exp1Title',
    description: 'Navegue entre praias selvagens e águas cristalinas do Pará. Vento constante e ondas perfeitas para um downwind inesquecível.',
    descKey: 'exp1Desc',
    badge: 'Downwind',
    level: 'Intermediário',
    duration: '2h30',
    price: 0,
    image_url: portraitImages[15]?.src || portraitImages[0]?.src,
    community: 'Amazon Wind',
    category_id: null,
  },
  {
    id: 'exp-2',
    title: 'Salinas → Algodoal',
    titleKey: 'exp2Title',
    description: 'Expedição completa entre ilhas paradisíacas. Parada para mergulho e contemplação da fauna amazônica.',
    descKey: 'exp2Desc',
    badge: 'Expedição',
    level: 'Intermediário/Avançado',
    duration: '3h',
    price: 0,
    image_url: portraitImages[40]?.src || portraitImages[5]?.src,
    community: 'Amazon Wind',
    category_id: null,
  },
  {
    id: 'exp-3',
    title: 'Voo dos Guarás',
    titleKey: 'exp3Title',
    description: 'Acompanhe o voo dos guarás vermelhos ao entardecer. Uma experiência mágica de contemplação e natureza.',
    descKey: 'exp3Desc',
    badge: 'Vivência Cultural',
    level: 'Todos os níveis',
    duration: '4h',
    price: 0,
    image_url: portraitImages[50]?.src || portraitImages[10]?.src,
    community: 'Amazon Wind',
    category_id: null,
  },
  {
    id: 'exp-4',
    title: 'Carimbó na Praia',
    titleKey: 'exp4Title',
    description: 'Roda de Carimbó com mestres locais ao som do mar. Mergulho na cultura e no ritmo amazônico.',
    descKey: 'exp4Desc',
    badge: 'Vivência Cultural',
    level: 'Todos os níveis',
    duration: '2h',
    price: 0,
    image_url: portraitImages[55]?.src || portraitImages[20]?.src,
    community: 'Amazon Wind',
    category_id: null,
  },
]

export function getStaticExperience(id: string): StaticExperience | undefined {
  return staticExperiences.find((e) => e.id === id)
}
