import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { LogOut, User, Settings } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'

export const UserMenu = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  if (!user) return null

  const displayName = user.user_metadata?.full_name || user.email?.split('@')[0] || 'User'
  const avatarUrl = user.user_metadata?.avatar_url

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  return (
    <div 
      ref={menuRef}
      className="relative flex z-50"
    >
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 py-2 px-2 sm:px-3 hover:bg-neutral-50 dark:hover:bg-neutral-900/50 transition-colors"
      >
        <div className="w-8 h-8 sm:w-9 sm:h-9 overflow-hidden bg-neutral-100 dark:bg-neutral-900 flex items-center justify-center border-[0.5px] border-neutral-200 dark:border-neutral-800">
          {avatarUrl ? (
            <img src={avatarUrl} alt={displayName} className="w-full h-full object-cover p-[2px]" />
          ) : (
            <User className="w-4 h-4 sm:w-5 sm:h-5 text-neutral-400" />
          )}
        </div>
        <span className="text-[10px] uppercase tracking-[0.2em] font-medium text-neutral-600 dark:text-neutral-400 hidden md:block">
          {displayName}
        </span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            className="absolute right-0 top-full mt-2 w-56 sm:w-64 bg-white dark:bg-neutral-900 shadow-[0_0_50px_rgba(0,0,0,0.1)] border-[0.5px] border-neutral-200 dark:border-neutral-800 overflow-hidden"
          >
            {/* User info - always visible on mobile */}
            <div className="px-5 py-5 border-b-[0.5px] border-neutral-100 dark:border-neutral-800 mb-1">
              <p className="text-[10px] uppercase tracking-[0.3em] font-medium text-neutral-900 dark:text-neutral-100 truncate mb-1">
                {displayName}
              </p>
              <p className="text-[9px] uppercase tracking-widest text-neutral-400 truncate">{user.email}</p>
            </div>
            
            <button
              onClick={() => {
                navigate('/settings')
                setIsOpen(false)
              }}
              className="w-full flex items-center gap-4 px-5 py-4 text-[10px] uppercase tracking-widest text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-950 transition-colors"
            >
              <Settings className="w-3 h-3" />
              Paramètres
            </button>
            
            <button
              onClick={() => {
                logout()
                setIsOpen(false)
              }}
              className="w-full flex items-center gap-4 px-5 py-4 text-[10px] uppercase tracking-widest text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors"
            >
              <LogOut className="w-3 h-3" />
              Déconnexion
            </button>
            
            <div className="px-5 py-2 border-t-[0.5px] border-neutral-100 dark:border-neutral-800 text-[7px] uppercase tracking-[0.4em] text-neutral-300">
              Gallery-La / User_Session
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
