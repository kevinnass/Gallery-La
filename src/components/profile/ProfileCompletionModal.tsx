import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Check, AlertCircle, Loader2 } from 'lucide-react'
import { useProfile } from '@/hooks/useProfile'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

interface ProfileCompletionModalProps {
  isOpen: boolean
  onClose?: () => void
}

const SPECIALITIES = [
  { value: 'photographer', label: 'Photographe' },
  { value: 'animator', label: 'Animateur/Dessinateur' },
  { value: 'painter', label: 'Peintre' },
  { value: 'sculptor', label: 'Sculpteur' },
  { value: 'digital_artist', label: 'Artiste Digital' },
  { value: 'illustrator', label: 'Illustrateur' },
  { value: 'other', label: 'Autre' },
]

export const ProfileCompletionModal = ({ isOpen, onClose }: ProfileCompletionModalProps) => {
  const { createOrUpdateProfile, checkUsernameAvailable } = useProfile()
  
  const [username, setUsername] = useState('')
  const [bio, setBio] = useState('')
  const [specialty, setspecialty] = useState('')
  
  const [usernameStatus, setUsernameStatus] = useState<'idle' | 'checking' | 'available' | 'taken'>('idle')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Check username availability with debounce
  useEffect(() => {
    if (username.length < 3) {
      setUsernameStatus('idle')
      return
    }

    setUsernameStatus('checking')
    const timer = setTimeout(async () => {
      const isAvailable = await checkUsernameAvailable(username)
      setUsernameStatus(isAvailable ? 'available' : 'taken')
    }, 500)

    return () => clearTimeout(timer)
  }, [username, checkUsernameAvailable])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!username || username.length < 3) {
      setError('Le nom d\'utilisateur doit contenir au moins 3 caractères')
      return
    }

    if (usernameStatus === 'taken') {
      setError('Ce nom d\'utilisateur est déjà pris')
      return
    }

    if (!specialty) {
      setError('Veuillez sélectionner une spécialité')
      return
    }

    try {
      setIsSubmitting(true)
      setError(null)
      
      await createOrUpdateProfile({
        username,
        bio: bio || undefined,
        specialty,
      })

      // Close modal on success
      onClose?.()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue')
    } finally {
      setIsSubmitting(false)
    }
  }

  const getUsernameIcon = () => {
    switch (usernameStatus) {
      case 'checking':
        return <Loader2 className="w-4 h-4 animate-spin text-neutral-400" />
      case 'available':
        return <Check className="w-4 h-4 text-green-500" />
      case 'taken':
        return <AlertCircle className="w-4 h-4 text-red-500" />
      default:
        return null
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={(e) => e.stopPropagation()}
          />

          {/* Modal */}
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2 }}
              className="bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl max-w-md w-full p-6 border border-neutral-200 dark:border-neutral-800"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-light text-neutral-900 dark:text-neutral-50">
                  Complétez votre profil
                </h2>
              </div>

              <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-6">
                Pour continuer, nous avons besoin de quelques informations sur vous.
              </p>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Username */}
                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                    Nom d'utilisateur <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="votre_nom"
                      className="pr-10"
                      required
                      minLength={3}
                      maxLength={30}
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      {getUsernameIcon()}
                    </div>
                  </div>
                  {usernameStatus === 'taken' && (
                    <p className="text-xs text-red-500 mt-1">Ce nom d'utilisateur est déjà pris</p>
                  )}
                  {usernameStatus === 'available' && (
                    <p className="text-xs text-green-500 mt-1">Disponible !</p>
                  )}
                </div>

                {/* specialty */}
                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                    Spécialité <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={specialty}
                    onChange={(e) => setspecialty(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-50 focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-neutral-50"
                    required
                  >
                    <option value="">Sélectionnez une spécialité</option>
                    {SPECIALITIES.map((spec) => (
                      <option key={spec.value} value={spec.value}>
                        {spec.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Bio */}
                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                    Bio <span className="text-neutral-400">(optionnel)</span>
                  </label>
                  <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Parlez-nous de vous..."
                    rows={3}
                    maxLength={500}
                    className="w-full px-4 py-2.5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-50 focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-neutral-50 resize-none"
                  />
                  <p className="text-xs text-neutral-400 mt-1">{bio.length}/500</p>
                </div>

                {/* Error Message */}
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3 rounded-lg bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800"
                  >
                    <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                  </motion.div>
                )}

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isSubmitting || usernameStatus === 'taken' || usernameStatus === 'checking'}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Enregistrement...
                    </>
                  ) : (
                    'Continuer'
                  )}
                </Button>
              </form>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}
