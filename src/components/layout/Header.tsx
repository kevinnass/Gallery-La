import { Moon, Sun } from 'lucide-react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { toggleTheme } from '@/features/theme/themeSlice'
import { useAuth } from '@/hooks/useAuth'
import { UserMenu } from './UserMenu'

export const Header = () => {
  const dispatch = useAppDispatch()
  const theme = useAppSelector((state) => state.theme.mode)
  const { isAuthenticated } = useAuth()

  const navLinks = [
    { name: 'accueil', href: '/' },
    { name: 'galerie', href: '/gallery' },
    { name: 'artistes', href: '/artists' },
  ]

  const authenticatedLinks = [
    { name: 'ma galerie', href: '/my-gallery' },
  ]

  const links = isAuthenticated 
    ? [...navLinks, ...authenticatedLinks] 
    : navLinks

  const handleThemeToggle = () => {
    dispatch(toggleTheme())
  }

  return (
    <header className="w-full bg-background dark:bg-neutral-950 py-6 transition-colors">
      <nav className="container mx-auto flex items-center justify-between px-8 max-w-7xl">
        {/* Logo */}
        <Link to="/" className="text-lg font-medium text-foreground dark:text-gray-300 cursor-pointer flex">
          {"gallery-la".split("").map((letter, index) => (
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
        </Link>
        
        {/* Navigation and Dark Mode Toggle - Right Side */}
        <div className="flex  items-center gap-8">
          {links.map((link) => (
            link.href === '/my-gallery' ? (
              // Special styling for "ma galerie" - purple underline
              <Link
                key={link.name}
                to={link.href}
                className="text-sm relative text-foreground dark:text-gray-300 tracking-wide transition-colors hover:text-neutral-900 dark:hover:text-white group"
              >
                {link.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-600 to-pink-600 transition-all duration-300 group-hover:w-full" />
              </Link>
            ) : link.href.startsWith('#') ? (
              <a
                key={link.name}
                href={link.href}
                className="text-sm relative text-foreground dark:text-gray-300 tracking-wide transition-colors hover:text-neutral-900 dark:hover:text-white group"
              >
                {link.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-neutral-900 dark:bg-white transition-all duration-300 group-hover:w-full" />
              </a>
            ) : (
              <Link
                key={link.name}
                to={link.href}
                className="text-sm relative text-foreground dark:text-gray-300 tracking-wide transition-colors hover:text-neutral-900 dark:hover:text-white group"
              >
                {link.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-neutral-900 dark:bg-white transition-all duration-300 group-hover:w-full" />
              </Link>
            )
          ))}
          
          {/* Auth State */}
          {isAuthenticated ? (
            <UserMenu />
          ) : (
            <Link 
              to="/auth"
              className="px-4 py-2 text-sm font-medium text-white bg-foreground dark:bg-white dark:text-foreground rounded-lg transition-opacity hover:opacity-80"
            >
              connexion
            </Link>
          )}
          
          {/* Dark Mode Toggle */}
          <motion.button 
            onClick={handleThemeToggle}
            whileTap={{ scale: 0.9, rotate: 180 }}
            transition={{ duration: 0.3 }}
            className="text-foreground dark:text-gray-300 transition-opacity hover:opacity-60"
            aria-label="Basculer le mode sombre"
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </motion.button>
        </div>
      </nav>
    </header>
  )
}