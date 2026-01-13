import { useState } from 'react'
import { Moon, Sun, Menu, X, Settings, LogOut } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { toggleTheme } from '@/features/theme/themeSlice'
import { useAuth } from '@/hooks/useAuth'
import { UserMenu } from './UserMenu'

export const Header = () => {
  const dispatch = useAppDispatch()
  const theme = useAppSelector((state) => state.theme.mode)
  const { isAuthenticated, logout } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

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

  const closeMobileMenu = () => {
    setMobileMenuOpen(false)
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full bg-background/95 dark:bg-neutral-950/95 backdrop-blur-sm border-b border-neutral-200 dark:border-neutral-800 transition-colors">
      <nav className="container mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8 py-4 max-w-7xl">
        {/* Logo */}
        <Link to="/" className="text-lg font-medium text-foreground dark:text-gray-300 cursor-pointer flex z-50">
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
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6 lg:gap-8">
          {links.map((link) => (
            link.href === '/my-gallery' ? (
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

        {/* Mobile Menu Button & Theme Toggle */}
        <div className="flex md:hidden items-center gap-4">
          <motion.button 
            onClick={handleThemeToggle}
            whileTap={{ scale: 0.9, rotate: 180 }}
            transition={{ duration: 0.3 }}
            className="text-foreground dark:text-gray-300 transition-opacity hover:opacity-60"
            aria-label="Basculer le mode sombre"
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </motion.button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-foreground dark:text-gray-300 z-50"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-background dark:bg-neutral-950 border-t border-neutral-200 dark:border-neutral-800"
          >
            <div className="container mx-auto px-4 py-6 space-y-4">
              {links.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  onClick={closeMobileMenu}
                  className="block text-base text-foreground dark:text-gray-300 hover:text-neutral-900 dark:hover:text-white transition-colors py-2"
                >
                  {link.name}
                </Link>
              ))}
              
              {/* Auth State Mobile */}
              {isAuthenticated ? (
                <div className="pt-4 border-t border-neutral-200 dark:border-neutral-800 space-y-2">
                  <Link
                    to="/settings"
                    onClick={closeMobileMenu}
                    className="flex items-center gap-3 px-4 py-3 text-base text-foreground dark:text-gray-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
                  >
                    <Settings className="w-5 h-5" />
                    Paramètres
                  </Link>
                  <button
                    onClick={() => {
                      logout()
                      closeMobileMenu()
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 text-base text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-lg transition-colors"
                  >
                    <LogOut className="w-5 h-5" />
                    Déconnexion
                  </button>
                </div>
              ) : (
                <Link
                  to="/auth"
                  onClick={closeMobileMenu}
                  className="block w-full px-4 py-3 bg-foreground dark:bg-white text-white dark:text-foreground rounded-lg text-center font-medium hover:opacity-80 transition-opacity"
                >
                  connexion
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}