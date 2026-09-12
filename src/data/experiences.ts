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
    title: 'Downwind Barra do Cunhaú / Pipa',
    titleKey: 'exp1Title',
    description: 'Downwind clássico pelas praias de vento constante entre Barra do Cunhaú e Pipa. Vento lateral off-shore, águas cristalinas e paradas para mergulho. Rota perfeita para intermediários e avançados.',
    descKey: 'exp1Desc',
    badge: 'Downwind',
    level: 'Intermediário',
    duration: '3h',
    price: 350,
    image_url: portraitImages[15]?.src || portraitImages[0]?.src,
    community: 'Amazon Wind',
    category_id: null,
  },
  {
    id: 'exp-2',
    title: 'Downwind Rota dos Ventos',
    titleKey: 'exp2Title',
    description: 'Navegue entre praias selvagens e águas cristalinas do Pará. Vento constante e ondas perfeitas para um downwind inesquecível pela Rota dos Ventos amazônica.',
    descKey: 'exp2Desc',
    badge: 'Downwind',
    level: 'Intermediário/Avançado',
    duration: '4h',
    price: 450,
    image_url: portraitImages[40]?.src || portraitImages[5]?.src,
    community: 'Amazon Wind',
    category_id: null,
  },
  {
    id: 'exp-3',
    title: 'Expedição Ilha do Marajó',
    titleKey: 'exp3Title',
    description: 'Expedição completa pela Ilha do Marajó. Parada para mergulho, contemplação da fauna amazônica e pôr do sol entre as dunas.',
    descKey: 'exp3Desc',
    badge: 'Expedição',
    level: 'Avançado',
    duration: '5h',
    price: 600,
    image_url: portraitImages[50]?.src || portraitImages[10]?.src,
    community: 'Amazon Wind',
    category_id: null,
  },
  {
    id: 'exp-4',
    title: 'Voo dos Guarás',
    titleKey: 'exp4Title',
    description: 'Acompanhe o voo dos guarás vermelhos ao entardecer. Uma experiência mágica de contemplação e natureza na costa amazônica.',
    descKey: 'exp4Desc',
    badge: 'Vivência Cultural',
    level: 'Todos os níveis',
    duration: '4h',
    price: 280,
    image_url: portraitImages[55]?.src || portraitImages[20]?.src,
    community: 'Amazon Wind',
    category_id: null,
  },
]

export function getStaticExperience(id: string): StaticExperience | undefined {
  return staticExperiences.find((e) => e.id === id)
}
