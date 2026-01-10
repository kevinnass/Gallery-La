import { Moon, Sun } from 'lucide-react'
import { motion } from 'framer-motion'
import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { toggleTheme } from '@/features/theme/themeSlice'

export const Header = () => {
  const dispatch = useAppDispatch()
  const theme = useAppSelector((state) => state.theme.mode)

  const navLinks = [
    { name: 'accueil', href: '#' },
    { name: 'artistes', href: '#projects' },
    { name: 'galerie', href: '#gallery' },
  ]

  const handleThemeToggle = () => {
    dispatch(toggleTheme())
  }

  return (
    <header className="w-full border-b border-neutral-200 bg-background dark:bg-neutral-950 py-6 transition-colors">
      <nav className="container mx-auto flex items-center justify-between px-8 max-w-7xl">
        {/* Logo */}
        <div className="text-lg font-medium text-foreground dark:text-white cursor-pointer flex">
          {"Gallery-La".split("").map((letter, index) => (
            <motion.span
              key={index}
              whileHover={{
                y: -5,
                transition: {
                  type: "spring",
                  stiffness: 300,
                  damping: 10
                }
              }}
              className="inline-block"
            >
              {letter === "-" ? "-" : letter}
            </motion.span>
          ))}
        </div>
        
        {/* Navigation and Dark Mode Toggle - Right Side */}
        <div className="flex  items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="relative text-sm font-medium text-foreground dark:text-white tracking-wide transition-opacity hover:opacity-80 group"
            >
              {link.name}
              {/* Animated underline */}
              <span className="absolute bottom-0 left-0 h-0.5 w-0 bg-foreground dark:bg-white transition-all duration-300 group-hover:w-full" />
            </a>
          ))}
          
          {/* Login Button */}
          <button 
            className="px-4 py-2 text-sm font-medium text-white bg-foreground dark:bg-white dark:text-foreground rounded-lg transition-opacity hover:opacity-80"
          >
            Connexion
          </button>
          
          {/* Dark Mode Toggle */}
          <motion.button 
            onClick={handleThemeToggle}
            whileTap={{ scale: 0.9, rotate: 180 }}
            transition={{ duration: 0.3 }}
            className="text-foreground dark:text-white transition-opacity hover:opacity-60"
            aria-label="Basculer le mode sombre"
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </motion.button>
        </div>
      </nav>
    </header>
  )
}