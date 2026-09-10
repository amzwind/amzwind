import { useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../services/supabase'
import { useLanguage } from '../contexts/LanguageContext'

const PLACEHOLDER_ID = '00000000-0000-0000-0000-000000000000'

type ServiceKey = 'transfer' | 'hospedagem' | 'camisas' | 'bones'

interface ServiceItem {
  key: ServiceKey
  titleKey: 'svc3Title' | 'svc4Title' | 'svc1Title' | 'svc2Title'
  descKey: 'svc3Desc' | 'svc4Desc' | 'svc1Desc' | 'svc2Desc'
  priceKey: 'svc3Price' | 'svc4Price' | 'svc1Price' | 'svc2Price'
  icon: JSX.Element
  color: string
  bookable: boolean
  linkTo?: string
}

export default function Servicos() {
  const { t } = useLanguage()
  const [modalOpen, setModalOpen] = useState(false)
  const [activeService, setActiveService] = useState<ServiceKey | null>(null)
  const [sending, setSending] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const [formName, setFormName] = useState('')
  const [formEmail, setFormEmail] = useState('')
  const [formPhone, setFormPhone] = useState('')
  const [formDate, setFormDate] = useState('')
  const [formMsg, setFormMsg] = useState('')

  const services: ServiceItem[] = [
    {
      key: 'camisas',
      titleKey: 'svc1Title',
      descKey: 'svc1Desc',
      priceKey: 'svc1Price',
      icon: (
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
        </svg>
      ),
      color: 'from-amz-oceano to-amz-oceano-dark',
      bookable: false,
      linkTo: '/produtos',
    },
    {
      key: 'bones',
      titleKey: 'svc2Title',
      descKey: 'svc2Desc',
      priceKey: 'svc2Price',
      icon: (
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
        </svg>
      ),
      color: 'from-amz-dourado to-amber-700',
      bookable: false,
      linkTo: '/produtos',
    },
    {
      key: 'transfer',
      titleKey: 'svc3Title',
      descKey: 'svc3Desc',
      priceKey: 'svc3Price',
      icon: (
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
        </svg>
      ),
      color: 'from-amz-bio to-amz-bio-dark',
      bookable: true,
    },
    {
      key: 'hospedagem',
      titleKey: 'svc4Title',
      descKey: 'svc4Desc',
      priceKey: 'svc4Price',
      icon: (
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
      color: 'from-amz-terra to-amz-terra-dark',
      bookable: true,
    },
  ]

  function openBook(svcKey: ServiceKey) {
    setActiveService(svcKey)
    setSuccess(false)
    setError('')
    setFormName('')
    setFormEmail('')
    setFormPhone('')
    setFormDate('')
    setFormMsg('')
    setModalOpen(true)
  }

  function closeModal() {
    setModalOpen(false)
    setActiveService(null)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!formName.trim() || !formEmail.trim()) {
      setError(t.svcRequired)
      return
    }

    setSending(true)
    setError('')

    const serviceTitle =
      activeService === 'transfer' ? t.svc3Title :
      activeService === 'hospedagem' ? t.svc4Title : ''

    const notes = JSON.stringify({
      service: serviceTitle,
      service_key: activeService,
      contact_name: formName.trim(),
      contact_email: formEmail.trim(),
      contact_phone: formPhone.trim(),
      preferred_date: formDate,
      message: formMsg.trim(),
    })

    const { error: insertError } = await supabase.from('bookings').insert({
      user_id: PLACEHOLDER_ID,
      item_type: 'experience',
      item_id: PLACEHOLDER_ID,
      status: 'pending',
      booking_date: formDate || new Date().toISOString().slice(0, 10),
      notes,
    })

    setSending(false)

    if (insertError) {
      setError(insertError.message)
      return
    }

    setSuccess(true)
    setTimeout(closeModal, 2500)
  }

  return (
    <section id="servicos" className="py-16 md:py-24 px-4 bg-amz-areia dark:bg-amz-terra-dark transition-colors duration-500">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12 fade-up">
          <p className="section-subtitle mb-2 dark:text-amz-areia/50">{t.svcLabel}</p>
          <h2 className="section-title dark:text-amz-areia">{t.svcTitle}</h2>
          <p className="text-amz-terra-light dark:text-amz-areia/60 mt-3 max-w-md mx-auto">
            {t.svcSubtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {services.map((svc) => {
            const card = (
              <div
                key={svc.key}
                className="group bg-white dark:bg-white/5 rounded-3xl p-6 shadow-md hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 fade-up backdrop-blur-sm border border-amz-areia-dark/20 dark:border-white/5 relative overflow-hidden h-full"
              >
                <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${svc.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

                <div className="w-14 h-14 rounded-2xl bg-amz-terra/5 dark:bg-white/5 text-amz-terra dark:text-amz-dourado flex items-center justify-center mb-5 group-hover:bg-amz-terra dark:group-hover:bg-amz-dourado group-hover:text-white dark:group-hover:text-amz-terra-dark transition-all duration-500 group-hover:scale-110 group-hover:shadow-lg">
                  {svc.icon}
                </div>

                <h3 className="text-lg font-maybug text-amz-terra dark:text-amz-areia mb-2 group-hover:text-amz-oceano dark:group-hover:text-amz-dourado transition-colors">
                  {t[svc.titleKey]}
                </h3>

                <p className="text-sm text-amz-terra-light dark:text-amz-areia/50 leading-relaxed mb-4">
                  {t[svc.descKey]}
                </p>

                <p className="text-sm font-semibold text-amz-oceano dark:text-amz-dourado mb-4">
                  {t[svc.priceKey]}
                </p>

                {svc.bookable ? (
                  <button
                    onClick={() => openBook(svc.key)}
                    className="w-full py-2.5 rounded-xl text-sm font-semibold bg-amz-dourado text-white hover:bg-amber-700 transition-colors"
                  >
                    {t.svcBook}
                  </button>
                ) : svc.linkTo ? (
                  <Link
                    to={svc.linkTo}
                    className="block w-full text-center py-2.5 rounded-xl text-sm font-semibold border border-amz-areia-dark/20 dark:border-white/10 text-amz-terra dark:text-amz-areia hover:bg-amz-areia dark:hover:bg-white/5 transition-colors"
                  >
                    {t.prodCategoryTitle}
                  </Link>
                ) : null}
              </div>
            )

            return card
          })}
        </div>
      </div>

      {/* Booking Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={closeModal} />

          <div className="relative bg-white dark:bg-amz-terra-dark rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto border border-amz-areia-dark/20 dark:border-white/10">
            {/* Header */}
            <div className="sticky top-0 bg-white dark:bg-amz-terra-dark rounded-t-3xl border-b border-amz-areia-dark/10 dark:border-white/5 px-6 py-4 flex items-center justify-between z-10">
              <h3 className="font-maybug text-lg text-amz-terra dark:text-amz-areia">
                {t.svcBookTitle}
              </h3>
              <button
                onClick={closeModal}
                className="w-8 h-8 rounded-full hover:bg-amz-areia dark:hover:bg-white/5 flex items-center justify-center text-amz-terra-light dark:text-amz-areia/40 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Body */}
            <div className="px-6 py-5">
              {success ? (
                <div className="text-center py-10">
                  <div className="w-16 h-16 rounded-full bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="text-lg font-semibold text-amz-terra dark:text-amz-areia">{t.svcBookSuccess}</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Service label */}
                  <div className="bg-amz-areia/50 dark:bg-white/5 rounded-xl px-4 py-3">
                    <p className="text-xs text-amz-terra-light dark:text-amz-areia/40 mb-1">{t.svcServiceLabel}</p>
                    <p className="text-sm font-semibold text-amz-terra dark:text-amz-areia">
                      {activeService === 'transfer' ? t.svc3Title : t.svc4Title}
                    </p>
                  </div>

                  {/* Name */}
                  <div>
                    <label className="block text-sm font-medium text-amz-terra dark:text-amz-areia mb-1.5">
                      {t.contactName} <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-amz-areia-dark/20 dark:border-white/10 bg-white dark:bg-white/5 text-amz-terra dark:text-amz-areia text-sm focus:outline-none focus:ring-2 focus:ring-amz-dourado/50 focus:border-amz-dourado transition-colors"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-amz-terra dark:text-amz-areia mb-1.5">
                      {t.contactEmail} <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={formEmail}
                      onChange={(e) => setFormEmail(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-amz-areia-dark/20 dark:border-white/10 bg-white dark:bg-white/5 text-amz-terra dark:text-amz-areia text-sm focus:outline-none focus:ring-2 focus:ring-amz-dourado/50 focus:border-amz-dourado transition-colors"
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-sm font-medium text-amz-terra dark:text-amz-areia mb-1.5">
                      {t.contactPhone}
                    </label>
                    <input
                      type="tel"
                      value={formPhone}
                      onChange={(e) => setFormPhone(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-amz-areia-dark/20 dark:border-white/10 bg-white dark:bg-white/5 text-amz-terra dark:text-amz-areia text-sm focus:outline-none focus:ring-2 focus:ring-amz-dourado/50 focus:border-amz-dourado transition-colors"
                    />
                  </div>

                  {/* Date */}
                  <div>
                    <label className="block text-sm font-medium text-amz-terra dark:text-amz-areia mb-1.5">
                      {t.svcDateLabel}
                    </label>
                    <input
                      type="date"
                      value={formDate}
                      onChange={(e) => setFormDate(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-amz-areia-dark/20 dark:border-white/10 bg-white dark:bg-white/5 text-amz-terra dark:text-amz-areia text-sm focus:outline-none focus:ring-2 focus:ring-amz-dourado/50 focus:border-amz-dourado transition-colors"
                    />
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-sm font-medium text-amz-terra dark:text-amz-areia mb-1.5">
                      {t.contactMessage}
                    </label>
                    <textarea
                      rows={3}
                      value={formMsg}
                      onChange={(e) => setFormMsg(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-amz-areia-dark/20 dark:border-white/10 bg-white dark:bg-white/5 text-amz-terra dark:text-amz-areia text-sm focus:outline-none focus:ring-2 focus:ring-amz-dourado/50 focus:border-amz-dourado transition-colors resize-none"
                    />
                  </div>

                  {/* Error */}
                  {error && (
                    <div className="bg-red-50 dark:bg-red-500/10 rounded-xl px-4 py-3 text-sm text-red-600 dark:text-red-400">
                      {error}
                    </div>
                  )}

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={sending}
                    className="w-full py-3 rounded-xl text-sm font-semibold bg-amz-dourado text-white hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {sending ? (
                      <span className="flex items-center justify-center gap-2">
                        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ...
                      </span>
                    ) : (
                      t.svcSchedule
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
