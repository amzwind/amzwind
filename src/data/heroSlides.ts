import { heroVideo, heroDesktopFallback, portraitImages } from './media'

export interface HeroSlide {
  id: string
  title: string
  subtitle: string | null
  media_url: string
  media_type: 'image' | 'video'
  cta_text: string | null
  cta_link: string | null
  display_order?: number
}

export const OFFICIAL_HERO_SLIDES: HeroSlide[] = [
  {
    id: 'default-video',
    title: 'Expedições. Downwinds. Experiências na Amazônia Atlântica.',
    subtitle: 'A Amazônia é o nosso ponto de partida. Não queremos apenas organizar viagens. Queremos revelar um território.',
    media_url: heroVideo,
    media_type: 'video',
    cta_text: 'Explorar Roteiros',
    cta_link: '#experiencias',
  },
  {
    id: 'default-img-1',
    title: 'Kitesurf na Amazônia Atlântica',
    subtitle: 'Ventos alísios constantes, águas cristalinas e praias selvagens. O cenário perfeito para sua aventura.',
    media_url: portraitImages[5]?.src || heroDesktopFallback.src,
    media_type: 'image',
    cta_text: 'Agendar Aula',
    cta_link: '#escola',
  },
  {
    id: 'default-img-2',
    title: 'Downwinds Épicos',
    subtitle: 'Navegue entre ilhas paradisíacas, praias de águas-transparentes e restingas intocadas.',
    media_url: portraitImages[30]?.src || heroDesktopFallback.src,
    media_type: 'image',
    cta_text: 'Ver Roteiros',
    cta_link: '#experiencias',
  },
]
