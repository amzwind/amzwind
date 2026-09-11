import { portraitImages } from './media'

export type AboutLocale = 'pt' | 'en' | 'es'

export interface AboutFallbackData {
  title: string
  subtitle: string
  description: string
  cover_url: string
  video_url: string
  gallery_urls: string[]
  mission: string
  vision: string
}

export const ABOUT_FALLBACK: Record<AboutLocale, AboutFallbackData> = {
  pt: {
    cover_url: '/paisagem.jpeg',
    title: 'Sobre a Amazon Wind',
    subtitle: 'Expedições, Downwinds & Experiências na Amazônia Atlântica',
    description: `A Amazônia é o nosso ponto de partida. Não queremos apenas organizar viagens. Queremos revelar um território.

Fundada por Pingo, Pablo e Rafael Conceição, a Amazon Wind nasceu da paixão pelo vento, pela água e pela cultura paraense. Localizada em Salinópolis, no litoral do Pará, somos referência em aulas de kitesurf, downwinds épicos e expedições que conectam o viajante à essência da Amazônia Atlântica.

Nossa história começou nas praias de Ajuruteua e Algodoal, onde os ventos constantes e as águas cristalinas criam o cenário perfeito para o kitesurf. Ao longo dos anos, expandimos nossas operações para incluir vivências culturais na Ilha do Marajó, trilhas pela restinga e mergulhos em águas-transparentes.

Acreditamos no turismo de impacto positivo. Cada experiência que criamos respeita o meio ambiente, valoriza as comunidades locais e preserva a cultura amazônica. Nosso time de instrutores certificados garante segurança e diversão para todos os níveis, desde o primeiro contato com a barra até manobras avançadas.`,
    video_url: '',
    gallery_urls: portraitImages.slice(0, 20).map((m) => m.src),
    mission: 'Proporcionar experiências esportivas e culturais na Amazônia Atlântica com excelência operacional, segurança, autenticidade e respeito ao território e às comunidades locais.',
    vision: 'Ser a principal referência em kitesurf e turismo de aventura no Norte do Brasil, reconhecida pela excelência, sustentabilidade e pelo impacto positivo nas comunidades locais.',
  },
  en: {
    cover_url: '/paisagem.jpeg',
    title: 'About Amazon Wind',
    subtitle: 'Expeditions, Downwinds & Experiences in the Atlantic Amazon',
    description: `The Amazon is our starting point. We don't just want to organize trips. We want to reveal a territory.

Founded by Pingo, Pablo and Rafael Conceição, Amazon Wind was born from a passion for wind, water, and Pará culture. Based in Salinópolis on the coast of Pará, we are a reference in kitesurf lessons, epic downwinds, and expeditions that connect travelers to the essence of the Atlantic Amazon.

Our story began on the beaches of Ajuruteua and Algodoal, where constant winds and crystal-clear waters create the perfect setting for kitesurfing. Over the years, we expanded our operations to include cultural experiences on Marajó Island, restinga trails, and dives in transparent waters.

We believe in positive impact tourism. Every experience we create respects the environment, values local communities, and preserves Amazonian culture. Our team of certified instructors ensures safety and fun for all levels, from first contact with the bar to advanced maneuvers.`,
    video_url: '',
    gallery_urls: portraitImages.slice(0, 20).map((m) => m.src),
    mission: 'Provide sports and cultural experiences in the Atlantic Amazon with operational excellence, safety, authenticity, and respect for the territory and local communities.',
    vision: 'To be the leading reference in kitesurfing and adventure tourism in Northern Brazil, recognized for excellence, sustainability, and positive impact on local communities.',
  },
  es: {
    cover_url: '/paisagem.jpeg',
    title: 'Sobre Amazon Wind',
    subtitle: 'Expediciones, Downwinds & Experiencias en la Amazonía Atlántica',
    description: `La Amazonía es nuestro punto de partida. No queremos solo organizar viajes. Queremos revelar un territorio.

Fundada por Pingo, Pablo y Rafael Conceição, Amazon Wind nació de la pasión por el viento, el agua y la cultura de Pará. Ubicada en Salinópolis, en la costa de Pará, somos referencia en clases de kitesurf, downwinds épicos y expediciones que conectan al viajante con la esencia de la Amazonía Atlántica.

Nuestra historia comenzó en las playas de Ajuruteua y Algodoal, donde los vientos constantes y las aguas cristalinas crean el escenario perfecto para el kitesurf. A lo largo de los años, expandimos nuestras operaciones para incluir experiencias culturales en la Isla de Marajó, senderos por la restinga y buceo en aguas transparentes.

Creemos en el turismo de impacto positivo. Cada experiencia que creamos respeta el medio ambiente, valoriza las comunidades locales y preserva la cultura amazónica. Nuestro equipo de instructores certificados garantiza seguridad y diversión para todos los niveles.`,
    video_url: '',
    gallery_urls: portraitImages.slice(0, 20).map((m) => m.src),
    mission: 'Proporcionar experiencias deportivas y culturales en la Amazonía Atlántica con excelencia operativa, seguridad, autenticidad y respeto al territorio y a las comunidades locales.',
    vision: 'Ser la principal referencia en kitesurf y turismo de aventura en el Norte de Brasil, reconocida por la excelencia, sostenibilidad y el impacto positivo en las comunidades locales.',
  },
}
