import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Check, AlertCircle, Loader2, ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useProfile } from '@/hooks/useProfile'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

const SPECIALITIES = [
  { value: 'photographer', label: 'Photographe' },
  { value: 'animator', label: 'Animateur/Dessinateur' },
  { value: 'painter', label: 'Peintre' },
  { value: 'sculptor', label: 'Sculpteur' },
  { value: 'digital_artist', label: 'Artiste Digital' },
  { value: 'illustrator', label: 'Illustrateur' },
  { value: 'other', label: 'Autre' },
]

export const SettingsPage = () => {
  const navigate = useNavigate()
  const { profile, createOrUpdateProfile, checkUsernameAvailable } = useProfile()
  
  const [username, setUsername] = useState('')
  const [bio, setBio] = useState('')
  const [specialty, setSpecialty] = useState('')
  const [instagramHandle, setInstagramHandle] = useState('')
  const [location, setLocation] = useState('')
  
  const [usernameStatus, setUsernameStatus] = useState<'idle' | 'checking' | 'available' | 'taken'>('idle')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  // Load current profile data
  useEffect(() => {
    if (profile) {
      setUsername(profile.username || '')
      setBio(profile.bio || '')
      setSpecialty(profile.specialty || '')
      setInstagramHandle(profile.instagram_handle || '')
      setLocation(profile.location || '')
    }
  }, [profile])

  // Check username availability with debounce
  useEffect(() => {
    // Don't check if username hasn't changed
    if (username === profile?.username) {
      setUsernameStatus('idle')
      return
    }

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
  }, [username, profile?.username, checkUsernameAvailable])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!username || username.length < 3) {
      setError('Le nom d\'utilisateur doit contenir au moins 3 caractères')
      return
    }

    if (username !== profile?.username && usernameStatus === 'taken') {
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
      setSuccess(false)
      
      await createOrUpdateProfile({
        username,
        bio: bio || undefined,
        specialty,
        instagram_handle: instagramHandle || undefined,
        location: location || undefined,
      })

      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue')
    } finally {
      setIsSubmitting(false)
    }
  }

  const getUsernameIcon = () => {
    if (username === profile?.username) return null
    
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
    <div className="min-h-screen bg-background dark:bg-neutral-950 pt-24 pb-20">
      <div className="container mx-auto px-4 max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 mb-4"
            >
              <ArrowLeft className="w-4 h-4" />
              Retour
            </button>
            <h1 className="text-3xl font-light text-neutral-900 dark:text-neutral-50">
              Paramètres du profil
            </h1>
            <p className="text-neutral-500 dark:text-neutral-400 mt-2">
              Gérez vos informations personnelles
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-6 space-y-6">
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
              {username !== profile?.username && usernameStatus === 'taken' && (
                <p className="text-xs text-red-500 mt-1">Ce nom d'utilisateur est déjà pris</p>
              )}
              {username !== profile?.username && usernameStatus === 'available' && (
                <p className="text-xs text-green-500 mt-1">Disponible !</p>
              )}
            </div>

            {/* Specialty */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Spécialité <span className="text-red-500">*</span>
              </label>
              <select
                value={specialty}
                onChange={(e) => setSpecialty(e.target.value)}
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
                Bio
              </label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Parlez-nous de vous..."
                rows={4}
                maxLength={500}
                className="w-full px-4 py-2.5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-50 focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-neutral-50 resize-none"
              />
              <p className="text-xs text-neutral-400 mt-1">{bio.length}/500</p>
            </div>

            {/* Instagram Handle */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Instagram
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400">@</span>
                <Input
                  type="text"
                  value={instagramHandle}
                  onChange={(e) => setInstagramHandle(e.target.value.replace('@', ''))}
                  placeholder="votre_compte"
                  className="pl-8"
                  maxLength={30}
                />
              </div>
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Localisation
              </label>
              <Input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Paris, France"
                maxLength={100}
              />
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

            {/* Success Message */}
            {success && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 rounded-lg bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-800"
              >
                <p className="text-sm text-green-600 dark:text-green-400 flex items-center gap-2">
                  <Check className="w-4 h-4" />
                  Profil mis à jour avec succès !
                </p>
              </motion.div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full"
              disabled={isSubmitting || (username !== profile?.username && usernameStatus === 'taken')}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Enregistrement...
                </>
              ) : (
                'Enregistrer les modifications'
              )}
            </Button>
          </form>
        </motion.div>
      </div>
    </div>
  )
}
