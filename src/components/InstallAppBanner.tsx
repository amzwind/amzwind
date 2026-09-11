import { useState, useEffect, useCallback } from 'react'
import { useLanguage } from '../contexts/LanguageContext'

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

const DISMISS_KEY = 'amzwind-install-banner-dismissed'
const DISMISS_DAYS = 7

function isStandalone(): boolean {
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    (navigator as Navigator & { standalone?: boolean }).standalone === true
  )
}

function isIOS(): boolean {
  return /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
}

function isDismissed(): boolean {
  try {
    const raw = localStorage.getItem(DISMISS_KEY)
    if (!raw) return false
    const dismissedAt = Number(raw)
    const diff = Date.now() - dismissedAt
    return diff < DISMISS_DAYS * 24 * 60 * 60 * 1000
  } catch {
    return false
  }
}

function persistDismiss() {
  try {
    localStorage.setItem(DISMISS_KEY, String(Date.now()))
  } catch {
    // ignore
  }
}

export default function InstallAppBanner() {
  const { t } = useLanguage()
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [visible, setVisible] = useState(false)
  const [showInstructions, setShowInstructions] = useState(false)

  useEffect(() => {
    if (isStandalone() || isDismissed()) return

    const handler = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
      setVisible(true)
    }

    window.addEventListener('beforeinstallprompt', handler)

    // If iOS, show manual instructions instead
    if (isIOS()) {
      setVisible(true)
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handler)
    }
  }, [])

  const handleInstall = useCallback(async () => {
    if (!deferredPrompt) return
    try {
      await deferredPrompt.prompt()
      const { outcome } = await deferredPrompt.userChoice
      if (outcome === 'accepted') {
        setVisible(false)
        persistDismiss()
      }
    } catch {
      // prompt failed, show manual instructions
      setShowInstructions(true)
    }
  }, [deferredPrompt])

  const handleDismiss = useCallback(() => {
    setVisible(false)
    persistDismiss()
  }, [])

  const handleShowInstructions = useCallback(() => {
    setShowInstructions(true)
  }, [])

  if (!visible) return null

  return (
    <div className="fixed bottom-0 inset-x-0 z-[60] p-4 sm:p-6 flex justify-center pointer-events-none">
      <div className="pointer-events-auto w-full max-w-md">
        {/* Glassmorphism card */}
        <div className="relative bg-white/80 dark:bg-amz-terra-dark/80 backdrop-blur-xl border border-amz-areia-dark/50 dark:border-white/10 rounded-2xl shadow-2xl overflow-hidden">
          {/* Gradient accent top */}
          <div className="h-1 w-full bg-gradient-to-r from-amz-oceano via-amz-dourado to-amz-bio" />

          <div className="p-5 sm:p-6">
            {!showInstructions ? (
              <>
                {/* Header */}
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amz-oceano to-amz-dourado flex items-center justify-center shrink-0 overflow-hidden">
                      <img src="/logo/favicon.svg" alt="AW" className="w-7 h-7" />
                    </div>
                    <div>
                      <h3 className="font-maybug text-base sm:text-lg text-amz-terra dark:text-amz-areia leading-tight">
                        {t.installTitle}
                      </h3>
                      <p className="text-xs text-amz-terra-light/70 dark:text-amz-areia/50 mt-0.5">
                        {t.installSubtitle}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleDismiss}
                    className="shrink-0 p-1 rounded-lg text-amz-terra-light/50 dark:text-amz-areia/40 hover:bg-amz-terra/5 dark:hover:bg-white/5 transition-colors"
                    aria-label="Fechar"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* Features */}
                <div className="space-y-2 mb-5">
                  {[
                    t.installFeature1,
                    t.installFeature2,
                    t.installFeature3,
                  ].map((feature, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-amz-terra/80 dark:text-amz-areia/70">
                      <svg className="w-4 h-4 text-amz-bio shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                      {feature}
                    </div>
                  ))}
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  {deferredPrompt ? (
                    <button
                      onClick={handleInstall}
                      className="flex-1 btn-primary py-3 text-sm font-bold rounded-xl"
                    >
                      {t.installButton}
                    </button>
                  ) : (
                    <button
                      onClick={handleShowInstructions}
                      className="flex-1 btn-primary py-3 text-sm font-bold rounded-xl"
                    >
                      {t.installButton}
                    </button>
                  )}
                  <button
                    onClick={handleDismiss}
                    className="px-4 py-3 text-sm font-medium rounded-xl border border-amz-areia-dark dark:border-white/10 text-amz-terra-light/70 dark:text-amz-areia/50 hover:bg-amz-terra/5 dark:hover:bg-white/5 transition-colors"
                  >
                    {t.installNotNow}
                  </button>
                </div>
              </>
            ) : (
              /* Manual Instructions */
              <>
                <div className="flex items-start justify-between gap-3 mb-4">
                  <h3 className="font-maybug text-base sm:text-lg text-amz-terra dark:text-amz-areia">
                    {t.installInstructionsTitle}
                  </h3>
                  <button
                    onClick={handleDismiss}
                    className="shrink-0 p-1 rounded-lg text-amz-terra-light/50 dark:text-amz-areia/40 hover:bg-amz-terra/5 dark:hover:bg-white/5 transition-colors"
                    aria-label="Fechar"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <p className="text-sm text-amz-terra/70 dark:text-amz-areia/60 mb-4">
                  {isIOS() ? t.installIOSSubtitle : t.installChromeSubtitle}
                </p>

                {isIOS() ? (
                  <div className="space-y-3 mb-5">
                    {[
                      { step: '1', icon: (
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                        </svg>
                      ), text: t.installIOSStep1 },
                      { step: '2', icon: (
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m0 0l6.75-6.75M12 19.5l-6.75-6.75" />
                        </svg>
                      ), text: t.installIOSStep2 },
                      { step: '3', icon: (
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      ), text: t.installIOSStep3 },
                    ].map(({ step, icon, text }) => (
                      <div key={step} className="flex items-start gap-3 p-3 rounded-xl bg-amz-terra/5 dark:bg-white/5">
                        <div className="w-7 h-7 rounded-full bg-amz-oceano/10 dark:bg-amz-oceano/20 flex items-center justify-center shrink-0 text-amz-oceano">
                          {icon}
                        </div>
                        <p className="text-sm text-amz-terra/80 dark:text-amz-areia/70 pt-0.5">{text}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-3 mb-5">
                    {[
                      { step: '1', icon: (
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                        </svg>
                      ), text: t.installChromeStep1 },
                      { step: '2', icon: (
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                        </svg>
                      ), text: t.installChromeStep2 },
                    ].map(({ step, icon, text }) => (
                      <div key={step} className="flex items-start gap-3 p-3 rounded-xl bg-amz-terra/5 dark:bg-white/5">
                        <div className="w-7 h-7 rounded-full bg-amz-oceano/10 dark:bg-amz-oceano/20 flex items-center justify-center shrink-0 text-amz-oceano">
                          {icon}
                        </div>
                        <p className="text-sm text-amz-terra/80 dark:text-amz-areia/70 pt-0.5">{text}</p>
                      </div>
                    ))}
                  </div>
                )}

                <button
                  onClick={handleDismiss}
                  className="w-full py-3 text-sm font-medium rounded-xl border border-amz-areia-dark dark:border-white/10 text-amz-terra-light/70 dark:text-amz-areia/50 hover:bg-amz-terra/5 dark:hover:bg-white/5 transition-colors"
                >
                  {t.installGotIt}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
