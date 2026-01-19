import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

export const ScrollToTopOnNavigation = () => {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'auto' // Instant jump for better UX on navigation
    })
  }, [pathname])

  return null
}
