import { Home, Image as ImageIcon, Users, User as UserIcon, LogIn } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { useProfile } from '@/hooks/useProfile'

export const MobileBottomNav = () => {
  const location = useLocation()
  const { isAuthenticated } = useAuth()
  const { profile } = useProfile()

  const navItems = [
    { name: 'Accueil', href: '/', icon: Home },
    { name: 'Galerie', href: '/gallery', icon: ImageIcon },
    { name: 'Artistes', href: '/artists', icon: Users },
  ]

  const authItem = isAuthenticated
    ? { name: 'Ma Galerie', href: '/my-gallery', icon: UserIcon }
    : { name: 'Connexion', href: '/auth', icon: LogIn }

  const allItems = [...navItems, authItem]

  const isActive = (path: string) => {
    const currentPath = location.pathname
    
    // Homepage - exact match only
    if (path === '/') {
      return currentPath === '/'
    }
    
    // Ma Galerie - active if on user's own artist page
    if (path === '/my-gallery') {
      if (currentPath === '/my-gallery') return true
      
      // Check if we're on /artists/:username where username is the current user
      if (currentPath.startsWith('/artists/') && profile?.username) {
        // Extract username from URL: /artists/username -> username
        const urlUsername = currentPath.split('/artists/')[1]?.split('/')[0]
        return urlUsername === profile.username
      }
      return false
    }
    
    // Artistes - active on /artists list page OR on another artist's page (not the user's own)
    if (path === '/artists') {
      // Active on the artists list page
      if (currentPath === '/artists') return true
      
      // Active on individual artist pages, but NOT if it's the user's own page
      if (currentPath.startsWith('/artists/') && profile?.username) {
        const urlUsername = currentPath.split('/artists/')[1]?.split('/')[0]
        return urlUsername !== profile.username
      }
      
      // If not authenticated, any artist page is active
      if (currentPath.startsWith('/artists/')) return true
      return false
    }
    
    // Other paths - simple startsWith check
    return currentPath.startsWith(path)
  }

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-neutral-900 border-t border-neutral-200 dark:border-neutral-800 safe-area-bottom">
      <div className="flex items-center justify-around px-2 py-2">
        {allItems.map((item) => {
          const Icon = item.icon
          const active = isActive(item.href)
          
          return (
            <Link
              key={item.name}
              to={item.href}
              className={`flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-lg transition-all ${
                active
                  ? 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/30'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100'
              }`}
            >
              <Icon className={`w-5 h-5 ${active ? 'scale-110' : ''}`} />
              <span className="text-xs font-medium">{item.name}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
