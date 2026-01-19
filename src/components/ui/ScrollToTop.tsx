import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowUp } from 'lucide-react'

export const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false)

  // Show button when page is scrolled down
  const toggleVisibility = () => {
    if (window.pageYOffset > 500) {
      setIsVisible(true)
    } else {
      setIsVisible(false)
    }
  }

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  useEffect(() => {
    window.addEventListener('scroll', toggleVisibility)
    return () => window.removeEventListener('scroll', toggleVisibility)
  }, [])

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          onClick={scrollToTop}
          className="fixed bottom-12 right-12 z-50 p-4 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md border-[0.5px] border-black dark:border-white text-neutral-400 hover:text-purple-600 hover:border-purple-600/30 transition-all duration-500 group"
          aria-label="Retour en haut"
        >
          <div className="relative overflow-hidden">
            <ArrowUp className="w-5 h-5 transition-transform text-black dark:text-white duration-500 group-hover:-translate-y-1" />
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-[1px] bg-purple-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
          </div>
        </motion.button>
      )}
    </AnimatePresence>
  )
}
