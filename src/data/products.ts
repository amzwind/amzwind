export interface StaticProduct {
  id: string
  title: string
  description: string
  price: number
  stock: number
  image_url: string | null
  category_id: string
}

export const staticProductCategories = [
  { id: 'prod-cat-equipment', name: 'Equipamentos', slug: 'equipamentos', type: 'product' as const },
  { id: 'prod-cat-safety', name: 'Segurança', slug: 'seguranca', type: 'product' as const },
  { id: 'prod-cat-merch', name: 'Merch', slug: 'merch', type: 'product' as const },
  { id: 'prod-cat-accessories', name: 'Acessórios', slug: 'acessorios', type: 'product' as const },
]

export const staticProducts: StaticProduct[] = [
  {
    id: 'prod-lycra-amz',
    title: 'Lycra Amazon Wind',
    description: 'Lycra premium para mar e vento, com tecnologia leve, secagem rápida e ajuste confortável para longas sessões.',
    price: 199,
    stock: 18,
    image_url: '/lycra.jpg',
    category_id: 'prod-cat-equipment',
  },
  {
    id: 'prod-kit-seguranca',
    title: 'Kit de Segurança',
    description: 'Conjunto com colete, rádio e acessórios essenciais para trajetos com segurança e praticidade.',
    price: 349,
    stock: 12,
    image_url: '/kit-seguranca.jpg',
    category_id: 'prod-cat-safety',
  },
  {
    id: 'prod-prancha-downwind',
    title: 'Prancha Downwind',
    description: 'Prancha leve, estável e ultra responsiva para sessões de downwind e travessias costeiras.',
    price: 890,
    stock: 7,
    image_url: '/prancha-downwind.jpg',
    category_id: 'prod-cat-equipment',
  },
  {
    id: 'prod-camisa-amz',
    title: 'Camiseta Amazon Wind',
    description: 'Peça de merch com algodão premium e visual inspirado na paisagem amazônica e no estilo de vida do vento.',
    price: 119,
    stock: 24,
    image_url: '/camiseta-amz.jpg',
    category_id: 'prod-cat-merch',
  },
  {
    id: 'prod-bolsa-praia',
    title: 'Bolsa de Praia',
    description: 'Bolsa impermeável e prática para levar equipamentos, água, protetor solar e itens pessoais.',
    price: 159,
    stock: 30,
    image_url: '/bolsa-praia.jpg',
    category_id: 'prod-cat-accessories',
  },
  {
    id: 'prod-protetor-solar',
    title: 'Protetor Solar Premium',
    description: 'Fórmula resistente à água para proteção prolongada em dias de vento, sol e mar aberto.',
    price: 89,
    stock: 42,
    image_url: '/protetor-solar.jpg',
    category_id: 'prod-cat-accessories',
  },
]

export function getStaticProduct(id: string) {
  return staticProducts.find((product) => product.id === id)
}
