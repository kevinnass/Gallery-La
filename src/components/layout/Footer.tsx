import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Linkedin, Github, Globe } from 'lucide-react'

export const Footer = () => {
  const currentYear = new Date().getFullYear()
  const [showSocials, setShowSocials] = useState(false)

  const socials = [
    { 
      icon: Linkedin, 
      href: 'https://www.linkedin.com/in/kevin-nassara-61b95a208/', 
      label: 'LinkedIn',
      color: 'from-blue-600 to-blue-400'
    },
    { 
      icon: Github, 
      href: 'https://github.com/kevinnass', 
      label: 'GitHub',
      color: 'from-gray-800 to-gray-600 dark:from-gray-200 dark:to-gray-400'
    },
    { 
      icon: Globe, 
      href: 'https://kevin-nassara.surge.sh', 
      label: 'Website',
      color: 'from-purple-600 to-pink-500'
    },
  ]

  return (
    <footer className="w-full bg-background dark:bg-neutral-950 py-8 transition-colors">
      <div className="container flex justify-between mx-auto max-w-7xl px-8">
        <p className="text-center text-sm text-black dark:text-white">
          © {currentYear} - Tous les droits appartiennent aux créateurs
        </p>
        
        <div className="relative">
          <p className="text-center text-sm text-black dark:text-white">
            Développé par{' '}
            <button
              onClick={() => setShowSocials(!showSocials)}
              className="underline hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors font-medium"
            >
              Kevin Nassara
            </button>
          </p>

          {/* Social Bubbles */}
          <AnimatePresence>
            {showSocials && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="absolute bottom-full right-0 mb-2 flex gap-2"
              >
                {socials.map((social, index) => (
                  <motion.a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.1, y: -5 }}
                    whileTap={{ scale: 0.95 }}
                    className={`w-10 h-10 rounded-full bg-gradient-to-br ${social.color} flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow`}
                    title={social.label}
                  >
                    <social.icon className="w-5 h-5 text-white" />
                  </motion.a>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </footer>
  )
}
