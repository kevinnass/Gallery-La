import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { SocialAuthButton } from '@/components/ui/SocialAuthButton'
import { useAuth } from '@/hooks/useAuth'
import { useEffect } from 'react'

export const AuthPage = () => {
  const navigate = useNavigate()
  const { loginWithGoogle, loginWithGithub, loginWithDiscord, loading, error, isAuthenticated, clearAuthError } = useAuth()

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/')
    }
  }, [isAuthenticated, navigate])

  return (
    <div className="min-h-screen bg-background dark:bg-neutral-950 flex flex-col items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-md space-y-8"
      >
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50">
            Bienvenue
          </h1>
          <p className="text-neutral-500 text- w-full dark:text-neutral-400">
            Connectez-vous pour accéder à votre galerie personnelle
          </p>
        </div>

        <div className="space-y-4">
          <SocialAuthButton
          className='justify-center' 
            provider="google" 
            onClick={() => {
              clearAuthError()
              loginWithGoogle()
            }}
            isLoading={loading}
          />
          {/* <SocialAuthButton 
            provider="github" 
            onClick={() => {
              clearAuthError()
              loginWithGithub()
            }}
            isLoading={loading}
          />
          <SocialAuthButton 
            provider="discord" 
            onClick={() => {
              clearAuthError()
              loginWithDiscord()
            }}
            isLoading={loading}
          /> */}
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="text-red-500 text-sm text-center font-medium"
          >
            {error}
          </motion.div>
        )}

        <div className="text-center text-xs text-neutral-400 dark:text-neutral-600 mt-8">
          Aucune donnée personnelle n'est collectée.
        </div>
      </motion.div>
    </div>
  )
}
