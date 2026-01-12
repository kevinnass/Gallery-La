import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useProfile } from '@/hooks/useProfile'
import { useAuth } from '@/hooks/useAuth'

export const MyGalleryRedirect = () => {
  const { user } = useAuth()
  const { profile, loading } = useProfile()
  const navigate = useNavigate()

  useEffect(() => {
    if (!loading) {
      if (!user) {
        // Not authenticated, redirect to auth page
        navigate('/auth')
      } else if (profile?.username) {
        // Redirect to personal gallery
        navigate(`/artists/${profile.username}`)
      }
    }
  }, [user, profile, loading, navigate])

  // Show loading spinner while redirecting
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-amber-200 dark:border-amber-800 border-t-amber-600 dark:border-t-amber-400 rounded-full animate-spin" />
    </div>
  )
}
