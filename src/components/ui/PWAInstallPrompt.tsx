import { useState, useEffect } from 'react'
import { Download, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

export const PWAInstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [showPrompt, setShowPrompt] = useState(false)

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault()
      
      // Check if user dismissed recently (30 days) or already installed
      const dismissed = localStorage.getItem('pwa-install-dismissed')
      const installed = localStorage.getItem('pwa-installed')
      
      if (installed === 'true') return

      if (dismissed) {
        const dismissedTime = parseInt(dismissed)
        const thirtyDays = 30 * 24 * 60 * 60 * 1000
        if (Date.now() - dismissedTime < thirtyDays) {
          return
        }
      }

      setDeferredPrompt(e as BeforeInstallPromptEvent)
      setShowPrompt(true)
    }

    window.addEventListener('beforeinstallprompt', handler)

    return () => {
      window.removeEventListener('beforeinstallprompt', handler)
    }
  }, [])

  const handleInstall = async () => {
    if (!deferredPrompt) return

    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    
    if (outcome === 'accepted') {
      setDeferredPrompt(null)
      setShowPrompt(false)
      // Also remember acceptance to not show again
      localStorage.setItem('pwa-installed', 'true')
    }
  }

  const handleDismiss = () => {
    setShowPrompt(false)
    // Remember dismissal for 30 days
    localStorage.setItem('pwa-install-dismissed', Date.now().toString())
  }

  if (!showPrompt || !deferredPrompt) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        className="fixed bottom-20 md:bottom-6 left-4 right-4 md:left-auto md:right-6 z-50 max-w-sm md:max-w-md"
      >
        <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl border border-neutral-200 dark:border-neutral-800 p-4 md:p-6">
          <button
            onClick={handleDismiss}
            className="absolute top-3 right-3 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 transition-colors"
            aria-label="Fermer"
          >
            <X size={18} />
          </button>

          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center">
              <Download className="w-6 h-6 text-white" />
            </div>
            
            <div className="flex-1">
              <h3 className="text-base font-semibold text-foreground dark:text-white mb-1">
                Installer Gallery-La
              </h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
                Accédez rapidement à vos galeries depuis votre écran d'accueil
              </p>
              
              <div className="flex gap-2">
                <button
                  onClick={handleInstall}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-medium hover:opacity-90 transition-opacity"
                >
                  Installer
                </button>
                <button
                  onClick={handleDismiss}
                  className="px-4 py-2 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors"
                >
                  Plus tard
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
