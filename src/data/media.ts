export type MediaOrientation = 'landscape' | 'portrait' | 'square'
export type MediaCategory = 'kite' | 'sunset' | 'sailing' | 'expedition' | 'school' | 'landscape' | 'lifestyle'

export interface MediaAsset {
  src: string
  orientation: MediaOrientation
  category: MediaCategory
  alt: string
}

export const heroVideo = '/video-poetico-por-do-sol.mp4'

export const landscapeImages: MediaAsset[] = [
  { src: '/kite17.jpeg', orientation: 'landscape', category: 'kite', alt: 'Kitesurf em águas amazônicas' },
  { src: '/paisagem.jpeg', orientation: 'landscape', category: 'landscape', alt: 'Paisagem da costa amazônica' },
]

export const allMedia: MediaAsset[] = [
  // ── Landscape (2) ──
  { src: '/kite17.jpeg', orientation: 'landscape', category: 'kite', alt: 'Kitesurf em águas amazônicas' },
  { src: '/paisagem.jpeg', orientation: 'landscape', category: 'landscape', alt: 'Paisagem da costa amazônica' },

  // ── Square (5) ──
  { src: '/amazon-wind.jpeg', orientation: 'square', category: 'lifestyle', alt: 'Amazon Wind branding' },
  { src: '/amazon-wind2.jpeg', orientation: 'square', category: 'lifestyle', alt: 'Amazon Wind expeditions' },
  { src: '/cabana2.jpeg', orientation: 'square', category: 'lifestyle', alt: 'Cabana na praia' },
  { src: '/kite-por-do-sol.jpeg', orientation: 'square', category: 'sunset', alt: 'Kitesurf ao pôr do sol' },
  { src: '/kite-por-do-sol2.jpeg', orientation: 'square', category: 'sunset', alt: 'Kitesurf ao entardecer' },

  // ── Portrait: Kite action (28) ──
  { src: '/kite-surfing.jpeg', orientation: 'portrait', category: 'kite', alt: 'Kitesurf em ação' },
  { src: '/kite-dentro-agua.jpeg', orientation: 'portrait', category: 'kite', alt: 'Kitesurf dentro d\'água' },
  { src: '/kite.jpeg', orientation: 'portrait', category: 'kite', alt: 'Vela de kitesurf' },
  { src: '/kite2.jpeg', orientation: 'portrait', category: 'kite', alt: 'Manobra de kitesurf' },
  { src: '/kite3.jpeg', orientation: 'portrait', category: 'kite', alt: 'Kitesurf na praia' },
  { src: '/kite4.jpeg', orientation: 'portrait', category: 'kite', alt: 'Kitesurf amazônico' },
  { src: '/kite5.jpeg', orientation: 'portrait', category: 'kite', alt: 'Aventura de kitesurf' },
  { src: '/kite6.jpeg', orientation: 'portrait', category: 'kite', alt: 'Kitesurf no mar' },
  { src: '/kite7.jpeg', orientation: 'portrait', category: 'kite', alt: 'Voo de kitesurf' },
  { src: '/kite8.jpeg', orientation: 'portrait', category: 'kite', alt: 'Kitesurf costeiro' },
  { src: '/kite9.jpeg', orientation: 'portrait', category: 'kite', alt: 'Kitesurf ao amanhecer' },
  { src: '/kite10.jpeg', orientation: 'portrait', category: 'kite', alt: 'Session de kitesurf' },
  { src: '/kite11.jpeg', orientation: 'portrait', category: 'kite', alt: 'Kitesurf aerial' },
  { src: '/kite12.jpeg', orientation: 'portrait', category: 'kite', alt: 'Kitesurf paraense' },
  { src: '/kite13.jpeg', orientation: 'portrait', category: 'kite', alt: 'Onda de kitesurf' },
  { src: '/kite14.jpeg', orientation: 'portrait', category: 'kite', alt: 'Kitesurf splash' },
  { src: '/kite15.jpeg', orientation: 'portrait', category: 'kite', alt: 'Kitesurf vento forte' },
  { src: '/kite16.jpeg', orientation: 'portrait', category: 'kite', alt: 'Kitesurf trilha' },
  { src: '/kite18.jpeg', orientation: 'portrait', category: 'kite', alt: 'Kitesurf maré alta' },
  { src: '/kite19.jpeg', orientation: 'portrait', category: 'kite', alt: 'Kitesurf onda grande' },
  { src: '/kite20.jpeg', orientation: 'portrait', category: 'kite', alt: 'Kitesurf praia selvagem' },
  { src: '/kite22.jpeg', orientation: 'portrait', category: 'kite', alt: 'Kitesurf cristalino' },
  { src: '/kite23.jpeg', orientation: 'portrait', category: 'kite', alt: 'Kitesurf azul' },
  { src: '/kite24.jpeg', orientation: 'portrait', category: 'kite', alt: 'Kitesurf técnica' },
  { src: '/kite25.jpeg', orientation: 'portrait', category: 'kite', alt: 'Kitesurf adrenalina' },
  { src: '/kite26.jpeg', orientation: 'portrait', category: 'kite', alt: 'Kitesurf speed' },
  { src: '/kite27.jpeg', orientation: 'portrait', category: 'kite', alt: 'Kitesurf liberdade' },
  { src: '/kite28.jpeg', orientation: 'portrait', category: 'kite', alt: 'Kitesurf amazônia' },
  { src: '/kite33.jpeg', orientation: 'portrait', category: 'kite', alt: 'Kitesurf isolado' },
  { src: '/kite45.jpeg', orientation: 'portrait', category: 'kite', alt: 'Kitesurf wild' },
  { src: '/kite56.jpeg', orientation: 'portrait', category: 'kite', alt: 'Kitesurf extreme' },
  { src: '/kites.jpeg', orientation: 'portrait', category: 'kite', alt: 'Múltiplos kites' },
  { src: '/varioskites.jpeg', orientation: 'portrait', category: 'kite', alt: 'Vários kites no céu' },
  { src: '/kitenoar.jpeg', orientation: 'portrait', category: 'kite', alt: 'Kitesurf noturno' },
  { src: '/foto bonita de kite.jpeg', orientation: 'portrait', category: 'kite', alt: 'Kitesurf paradisíaco' },

  // ── Portrait: Sunset (7) ──
  { src: '/por-do-sol.jpeg', orientation: 'portrait', category: 'sunset', alt: 'Pôr do sol amazônico' },
  { src: '/por-do-sol2.jpeg', orientation: 'portrait', category: 'sunset', alt: 'Entardecer na praia' },
  { src: '/por-do-sol8.jpeg', orientation: 'portrait', category: 'sunset', alt: 'Sol poente' },
  { src: '/por-do-sol89.jpeg', orientation: 'portrait', category: 'sunset', alt: 'Céu colorido' },
  { src: '/pordosolekite.jpeg', orientation: 'portrait', category: 'sunset', alt: 'Kitesurf ao pôr do sol' },
  { src: '/kitepordosol7.jpeg', orientation: 'portrait', category: 'sunset', alt: 'Kite e sol' },
  { src: '/experiencia-por-do-sol.jpeg', orientation: 'portrait', category: 'sunset', alt: 'Experiência ao entardecer' },

  // ── Portrait: Sailing (12) ──
  { src: '/velejando.jpeg', orientation: 'portrait', category: 'sailing', alt: 'Velejando na costa' },
  { src: '/velejando2.jpeg', orientation: 'portrait', category: 'sailing', alt: 'Velejando amazônico' },
  { src: '/velejando3.jpeg', orientation: 'portrait', category: 'sailing', alt: 'Vela ao vento' },
  { src: '/velejando 4.jpeg', orientation: 'portrait', category: 'sailing', alt: 'Velejando alto mar' },
  { src: '/velejando 5.jpeg', orientation: 'portrait', category: 'sailing', alt: 'Velejando tranquilo' },
  { src: '/velaando7.jpeg', orientation: 'portrait', category: 'sailing', alt: 'Vela amazônica' },
  { src: '/velejo.jpeg', orientation: 'portrait', category: 'sailing', alt: 'Velejo no mar' },
  { src: '/velejo6.jpeg', orientation: 'portrait', category: 'sailing', alt: 'Velejo costeiro' },
  { src: '/velejo9.jpeg', orientation: 'portrait', category: 'sailing', alt: 'Velejo à tarde' },
  { src: '/velejos.jpeg', orientation: 'portrait', category: 'sailing', alt: 'Velejando juntos' },

  // ── Portrait: Expedition & Lifestyle (7) ──
  { src: '/bontio.jpeg', orientation: 'portrait', category: 'expedition', alt: 'Bontio amazônico' },
  { src: '/cabana.jpeg', orientation: 'portrait', category: 'lifestyle', alt: 'Cabana na praia' },
  { src: '/peixe-macaxeira-avoado.jpeg', orientation: 'portrait', category: 'expedition', alt: 'Pesca amazônica' },

  // ── Portrait: School (3) ──
  { src: '/aula-kitesurf-kids.jpeg', orientation: 'portrait', category: 'school', alt: 'Aula de kitesurf infantil' },
  { src: '/aula-kitesurf-kids2.jpeg', orientation: 'portrait', category: 'school', alt: 'Aula de kitesurf para kids' },
  { src: '/aula-kitesurf-kids3.jpeg', orientation: 'portrait', category: 'school', alt: 'Escola de kitesurf' },
]

export const mediaByCategory = (cat: MediaCategory): MediaAsset[] =>
  allMedia.filter((m) => m.category === cat)

export const mediaByOrientation = (ori: MediaOrientation): MediaAsset[] =>
  allMedia.filter((m) => m.orientation === ori)

export const portraitImages = mediaByOrientation('portrait')
export const squareImages = mediaByOrientation('square')

// Curated subsets for sections
export const heroDesktopFallback = landscapeImages[0]
export const heroMobileFallback = portraitImages[0]

export const schoolImages = mediaByCategory('school')
export const sunsetImages = mediaByCategory('sunset')
export const sailingImages = mediaByCategory('sailing')
export const kiteImages = mediaByCategory('kite')
export const expeditionImages = mediaByCategory('expedition')
export const lifestyleImages = mediaByCategory('lifestyle')
