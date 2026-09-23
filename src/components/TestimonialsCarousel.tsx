import { useState, useEffect, useRef } from 'react'

interface Testimonial {
  name: string
  location: string
  text: string
  rating: number
  avatar: string
  courseType: string
}

const testimonials: Testimonial[] = [
  {
    name: 'Lucas Ferreira',
    location: 'Belém, PA',
    text: 'Experiência incrível! Em apenas 3 dias já estava voando minha pipa sozinho. Os instrutores são extremamente pacientes e profissionais. Recomendo para qualquer pessoa que queira aprender kitesurf.',
    rating: 5,
    avatar: 'LF',
    courseType: 'Aula para Iniciante',
  },
  {
    name: 'Mariana Costa',
    location: 'São Paulo, SP',
    text: 'Vim do sul do Brasil especialmente para aprender com a Amazon Wind e não me arrependi nem um segundo. As praias de Salinópolis são paradisíacas e os ventos são perfeitos. O instrutor foi excepcional!',
    rating: 5,
    avatar: 'MC',
    courseType: 'Módulo Completo',
  },
  {
    name: 'Rafael Oliveira',
    location: 'Fortaleza, CE',
    text: 'Já pratiquei kite em vários lugares do Brasil, mas a estrutura e o profissionalismo da Amazon Wind são incomparáveis. Voltarei com certeza para o curso avançado!',
    rating: 5,
    avatar: 'RO',
    courseType: 'Aula Específica',
  },
  {
    name: 'Ana Lima',
    location: 'Manaus, AM',
    text: 'Achei que seria difícil demais para mim, mas os instrutores me deram tanta confiança que em 2 horas já estava entendendo tudo sobre controle de pipa. Melhor decisão de férias que já tomei!',
    rating: 5,
    avatar: 'AL',
    courseType: 'Aula Básica',
  },
  {
    name: 'Pedro Almeida',
    location: 'Recife, PE',
    text: 'Estrutura de primeira linha, equipamentos novos e seguros, e instrutores apaixonados pelo que fazem. A Amazon Wind eleva o nível do kitesurf no Norte do Brasil.',
    rating: 5,
    avatar: 'PA',
    courseType: 'Aula para Iniciante',
  },
]

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          className={`w-4 h-4 ${i < rating ? 'text-amz-dourado' : 'text-amz-terra/20 dark:text-white/20'}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  )
}

export default function TestimonialsCarousel() {
  const [active, setActive] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const goTo = (index: number) => {
    if (isAnimating) return
    setIsAnimating(true)
    setActive(index)
    setTimeout(() => setIsAnimating(false), 400)
  }

  const goNext = () => goTo((active + 1) % testimonials.length)
  const goPrev = () => goTo((active - 1 + testimonials.length) % testimonials.length)

  useEffect(() => {
    intervalRef.current = setInterval(goNext, 5000)
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [active])

  const t = testimonials[active]

  return (
    <div className="mt-16 fade-up">
      {/* Header */}
      <div className="text-center mb-8">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-amz-dourado dark:text-amz-dourado/80 mb-2">
          O que dizem nossos alunos
        </p>
        <h3 className="text-2xl md:text-3xl font-maybug text-amz-terra dark:text-amz-areia">
          Histórias de Transformação
        </h3>
      </div>

      {/* Card principal */}
      <div className="relative max-w-3xl mx-auto">
        {/* Aspas decorativas */}
        <div className="absolute -top-4 -left-2 md:-left-6 text-amz-dourado/20 dark:text-amz-dourado/10 pointer-events-none select-none" style={{ fontSize: '8rem', lineHeight: 1, fontFamily: 'Georgia, serif' }}>&ldquo;</div>

        <div
          className={`relative bg-white dark:bg-white/[0.04] rounded-3xl p-8 md:p-10 shadow-xl border border-amz-areia-dark/20 dark:border-white/5 transition-all duration-400 ${isAnimating ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'}`}
          style={{ transition: 'opacity 0.35s ease, transform 0.35s ease' }}
        >
          {/* Badge do tipo de aula */}
          <span className="inline-block text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-amz-dourado/10 text-amz-dourado mb-4">
            {t.courseType}
          </span>

          {/* Texto */}
          <p className="text-amz-terra dark:text-amz-areia/80 text-base md:text-lg leading-relaxed mb-6 italic">
            &ldquo;{t.text}&rdquo;
          </p>

          {/* Author */}
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              {/* Avatar */}
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amz-terra to-amz-terra-dark flex items-center justify-center text-white font-bold text-sm shadow-md">
                {t.avatar}
              </div>
              <div>
                <p className="font-semibold text-amz-terra dark:text-amz-areia text-sm">{t.name}</p>
                <p className="text-xs text-amz-terra-light dark:text-amz-areia/50">{t.location}</p>
              </div>
            </div>
            <StarRating rating={t.rating} />
          </div>
        </div>

        {/* Botões de navegação */}
        <div className="flex items-center justify-center gap-4 mt-6">
          <button
            onClick={goPrev}
            className="w-10 h-10 rounded-full bg-white dark:bg-white/5 border border-amz-areia-dark/20 dark:border-white/10 flex items-center justify-center text-amz-terra dark:text-amz-areia hover:bg-amz-areia dark:hover:bg-white/10 transition-colors shadow-sm"
            aria-label="Depoimento anterior"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Dots */}
          <div className="flex items-center gap-2">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                className={`transition-all duration-300 rounded-full ${
                  active === i
                    ? 'w-8 h-2.5 bg-amz-terra dark:bg-amz-dourado'
                    : 'w-2.5 h-2.5 bg-amz-terra/20 dark:bg-amz-areia/20 hover:bg-amz-terra/40 dark:hover:bg-amz-areia/40'
                }`}
                aria-label={`Depoimento ${i + 1}`}
              />
            ))}
          </div>

          <button
            onClick={goNext}
            className="w-10 h-10 rounded-full bg-white dark:bg-white/5 border border-amz-areia-dark/20 dark:border-white/10 flex items-center justify-center text-amz-terra dark:text-amz-areia hover:bg-amz-areia dark:hover:bg-white/10 transition-colors shadow-sm"
            aria-label="Próximo depoimento"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}
