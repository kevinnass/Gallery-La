import { Moon, Sun } from 'lucide-react'
import { motion } from 'framer-motion'
import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { toggleTheme } from '@/features/theme/themeSlice'

export const ThemeToggle = () => {
  const dispatch = useAppDispatch()
  const theme = useAppSelector((state) => state.theme.mode)

  return (
    <motion.button 
      onClick={() => dispatch(toggleTheme())}
      whileTap={{ scale: 0.9, rotate: 180 }}
      transition={{ duration: 0.3 }}
      className="text-neutral-900 dark:text-neutral-100 transition-opacity hover:opacity-60"
      aria-label="Toggle theme"
    >
      {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
    </motion.button>
  )
}
