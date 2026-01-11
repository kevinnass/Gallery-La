import { motion } from 'framer-motion'
import { X } from 'lucide-react'
import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

import { useAuth } from '@/hooks/useAuth'

export const CTAPopup = () => {
  const [isVisible, setIsVisible] = useState(true)
  const location = useLocation()
  const { isAuthenticated } = useAuth()

  // Don't show on auth page or if authenticated
  if (location.pathname === '/auth' || !isVisible || isAuthenticated) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 1 }}
      className="fixed bottom-6 right-6 z-50 max-w-sm"
    >
      <div className="relative rounded-2xl  bg-white dark:bg-neutral-900 p-6 shadow-2xl border border-neutral-200 dark:border-neutral-800">
        {/* Close button */}
        <button
          onClick={() => setIsVisible(false)}
          className="absolute top-3 right-3 text-muted dark:text-neutral-400 hover:text-foreground dark:hover:text-white transition-colors"
          aria-label="Fermer"
        >
          <X size={18} />
        </button>

        {/* Content */}
        <div className="pr-6">
          <h3 className="text-sm font-semibold text-foreground dark:text-gray-300 mb-2">
            partagez et présentez vos travaux créatifs
          </h3>
          
          {/* CTA Button */}
          <Link 
            to="/auth"
            className="block w-full px-4 py-2.5 text-center text-sm font-medium text-white bg-foreground dark:bg-white dark:text-foreground rounded-lg transition-all hover:opacity-90 hover:scale-105"
          >
            S'inscrire
          </Link>
        </div>
      </div>
    </motion.div>
  )
}