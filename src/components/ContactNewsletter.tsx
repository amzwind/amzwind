import { useState } from 'react'
import { supabase } from '../services/supabase'
import { useLanguage } from '../contexts/LanguageContext'

export default function ContactNewsletter() {
  const { t } = useLanguage()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [nlEmail, setNlEmail] = useState('')
  const [contactSent, setContactSent] = useState(false)
  const [nlSent, setNlSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [contactError, setContactError] = useState('')
  const [nlError, setNlError] = useState('')

  async function handleContact(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setContactError('')
    const { error } = await supabase.from('bookings').insert({
      user_id: '00000000-0000-0000-0000-000000000000',
      item_type: 'experience',
      item_id: '00000000-0000-0000-0000-000000000000',
      status: 'pending',
      notes: `[CONTATO] ${name} | ${email} | ${message}`,
    })
    setLoading(false)
    if (error) {
      setContactError(t.contactSuccess)
      return
    }
    setContactSent(true)
    setName(''); setEmail(''); setMessage('')
  }

  async function handleNewsletter(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setNlError('')
    const { error } = await supabase.from('bookings').insert({
      user_id: '00000000-0000-0000-0000-000000000000',
      item_type: 'product',
      item_id: '00000000-0000-0000-0000-000000000000',
      status: 'confirmed',
      notes: `[NEWSLETTER] ${nlEmail}`,
    })
    setLoading(false)
    if (error) {
      setNlError(error.message)
      return
    }
    setNlSent(true)
    setNlEmail('')
  }

  return (
    <section id="contato" className="py-16 md:py-24 px-4 bg-amz-areia dark:bg-amz-terra-dark transition-colors duration-500">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="fade-up">
            <p className="section-subtitle mb-2">{t.contactTitle}</p>
            <h2 className="section-title dark:text-amz-areia mb-6">{t.contactSubtitle}</h2>

            {contactSent ? (
              <div className="bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 rounded-2xl p-8 text-center">
                <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-500/20 flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                </div>
                <p className="font-semibold text-emerald-700 dark:text-emerald-400">{t.contactSuccess}</p>
                <button onClick={() => setContactSent(false)} className="mt-4 text-sm text-emerald-600 dark:text-emerald-400 underline">Enviar outra mensagem</button>
              </div>
            ) : (
              <form onSubmit={handleContact} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-amz-terra dark:text-amz-areia/60 mb-1.5">{t.contactName}</label>
                  <input required value={name} onChange={(e) => setName(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-amz-areia-dark/30 dark:border-white/10 bg-white dark:bg-white/5 text-amz-terra dark:text-white placeholder-gray-400 dark:placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-amz-oceano/50 text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-amz-terra dark:text-amz-areia/60 mb-1.5">{t.contactEmail}</label>
                  <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-amz-areia-dark/30 dark:border-white/10 bg-white dark:bg-white/5 text-amz-terra dark:text-white placeholder-gray-400 dark:placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-amz-oceano/50 text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-amz-terra dark:text-amz-areia/60 mb-1.5">{t.contactMessage}</label>
                  <textarea required rows={4} value={message} onChange={(e) => setMessage(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-amz-areia-dark/30 dark:border-white/10 bg-white dark:bg-white/5 text-amz-terra dark:text-white placeholder-gray-400 dark:placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-amz-oceano/50 text-sm resize-none" />
                </div>
                <button type="submit" disabled={loading} className="btn-primary w-full !py-3.5 disabled:opacity-50">
                  {loading ? '...' : t.contactSend}
                </button>
                {contactError && <p className="text-sm text-red-500 dark:text-red-400 mt-2">{contactError}</p>}
              </form>
            )}
          </div>

          {/* Newsletter */}
          <div className="fade-up">
            <div className="bg-amz-terra-dark dark:bg-white/5 rounded-3xl p-8 md:p-10 text-white">
              <div className="w-14 h-14 rounded-2xl bg-amz-dourado/20 flex items-center justify-center mb-6">
                <svg className="w-7 h-7 text-amz-dourado" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
              </div>
              <h3 className="text-2xl font-maybug mb-3">{t.newsletterTitle}</h3>
              <p className="text-white/60 text-sm mb-8 leading-relaxed">{t.newsletterSubtitle}</p>

              {nlSent ? (
                <div className="bg-white/10 rounded-xl p-4 text-center">
                  <p className="font-semibold">{t.newsletterSuccess}</p>
                </div>
              ) : (
                <>
                  <form onSubmit={handleNewsletter} className="flex gap-2">
                    <input type="email" required value={nlEmail} onChange={(e) => setNlEmail(e.target.value)} placeholder={t.newsletterPlaceholder} className="flex-1 px-4 py-3 rounded-xl bg-white/10 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-amz-dourado/50 text-sm" />
                    <button type="submit" disabled={loading} className="btn-primary !px-6 disabled:opacity-50">
                      {loading ? '...' : t.newsletterButton}
                    </button>
                  </form>
                  {nlError && <p className="text-sm text-red-300 mt-2">{nlError}</p>}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
