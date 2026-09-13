import { Link } from 'react-router-dom'
import { useLanguage } from '../contexts/LanguageContext'

const messages = {
  pt: { title: 'Página não encontrada', back: 'Voltar ao início' },
  en: { title: 'Page not found', back: 'Back to home' },
  es: { title: 'Página no encontrada', back: 'Volver al inicio' },
}

export default function NotFound() {
  const { locale } = useLanguage()
  const msg = messages[locale] || messages.pt

  return (
    <div className="min-h-screen bg-amz-areia dark:bg-amz-terra-dark flex items-center justify-center p-4">
      <div className="text-center">
        <h1 className="font-maybug text-6xl text-amz-terra dark:text-amz-dourado mb-4">404</h1>
        <p className="text-amz-terra-light dark:text-amz-areia/60 mb-8">{msg.title}</p>
        <Link to="/" className="btn-primary inline-block">{msg.back}</Link>
      </div>
    </div>
  )
}
