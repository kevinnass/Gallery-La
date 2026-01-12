import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, ArrowLeft } from 'lucide-react'
import { useArtworks, type Artwork } from '@/hooks/useArtworks'
import { useProfile } from '@/hooks/useProfile'
import { useAuth } from '@/hooks/useAuth'
import { ArtworkUploadModal } from '@/components/artworks/ArtworkUploadModal'
import { ArtworkCard } from '@/components/artworks/ArtworkCard'
import { ArtworkLightbox } from '@/components/artworks/ArtworkLightbox'
import { AudioModal } from '@/components/artworks/AudioModal'

export const GalleryPage = () => {
  const { username } = useParams<{ username: string }>()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { getProfileByUsername } = useProfile()
  const { artworks, loading, fetchPublicArtworks, fetchArtworksByUserId, updateArtwork, deleteArtwork, refetch } = useArtworks()
  
  const [galleryProfile, setGalleryProfile] = useState<any>(null)
  const [profileLoading, setProfileLoading] = useState(true)
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [selectedArtwork, setSelectedArtwork] = useState<Artwork | null>(null)
  const [showAudioModal, setShowAudioModal] = useState(false)
  const [filter, setFilter] = useState<'all' | 'public' | 'private'>('all')

  const isOwner = user?.id === galleryProfile?.id

  // Load profile and artworks
  useEffect(() => {
    const loadGallery = async () => {
      if (!username) {
        navigate('/404')
        return
      }

      setProfileLoading(true)
      const profile = await getProfileByUsername(username)
      
      if (!profile) {
        navigate('/404')
        return
      }

      setGalleryProfile(profile)
      
      // Load artworks based on ownership
      if (user?.id === profile.id) {
        await fetchArtworksByUserId(profile.id)
      } else {
        await fetchPublicArtworks(profile.id)
      }
      
      setProfileLoading(false)
    }

    loadGallery()
  }, [username, user, getProfileByUsername, fetchPublicArtworks, fetchArtworksByUserId, navigate])

  const handleUploadSuccess = () => {
    refetch()
    setShowUploadModal(false)
  }

  // Filter artworks
  const filteredArtworks = artworks.filter(artwork => {
    if (filter === 'all') return true
    if (filter === 'public') return artwork.is_public
    if (filter === 'private') return !artwork.is_public
    return true
  })

  if (profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-neutral-950">
        <div className="w-12 h-12 border-4 border-neutral-300 dark:border-neutral-700 border-t-neutral-700 dark:border-t-neutral-300 rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950 pt-32 pb-20">
      <div className="container mx-auto px-6 max-w-7xl">
        {/* Header */}
        <div className="mb-12">
          {!isOwner && (
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 text-neutral-600 hover:text-neutral-900 transition-colors mb-6 text-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              Retour
            </button>
          )}
          
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-5xl md:text-6xl font-bold text-neutral-900 dark:text-neutral-50 mb-3 tracking-tight">
                {isOwner ? 'Ma Galerie' : `Galerie de ${galleryProfile?.username}`}
              </h1>
              <p className="text-neutral-600 dark:text-neutral-400 font-extrabold text-lg">
                {isOwner ? 'Ma Collection d\'œuvres' : galleryProfile?.bio || 'Collection d\'œuvres de ' + galleryProfile?.username}
              </p>
            </div>
            
            {isOwner && (
              <button
                onClick={() => setShowUploadModal(true)}
                className="px-6 py-3 bg-black hover:bg-[#a89668] dark:bg-white dark:text-black text-white rounded transition-colors duration-300 flex items-center gap-2 shadow-md"
              >
                <Plus className="w-5 h-5" />
                <span className="hidden md:inline">NOUVELLE ŒUVRE</span>
              </button>
            )}
          </div>
        </div>

        {/* Filters */}
        {isOwner && artworks.length > 0 && (
          <div className="flex gap-3 mb-12">
            <button
              onClick={() => setFilter('all')}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                filter === 'all'
                  ? 'bg-neutral-800 text-white shadow-md'
                  : 'bg-neutral-200 text-neutral-700 hover:bg-neutral-300'
              }`}
            >
              Tous ({artworks.length})
            </button>
            <button
              onClick={() => setFilter('public')}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                filter === 'public'
                  ? 'bg-neutral-800 text-white shadow-md'
                  : 'bg-neutral-200 text-neutral-700 hover:bg-neutral-300'
              }`}
            >
              Publiques ({artworks.filter(a => a.is_public).length})
            </button>
            <button
              onClick={() => setFilter('private')}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                filter === 'private'
                  ? 'bg-neutral-800 text-white shadow-md'
                  : 'bg-neutral-200 text-neutral-700 hover:bg-neutral-300'
              }`}
            >
              Privées ({artworks.filter(a => !a.is_public).length})
            </button>
          </div>
        )}

        {/* Gallery Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-32">
            <div className="w-12 h-12 border-4 border-neutral-300 border-t-neutral-700 rounded-full animate-spin" />
          </div>
        ) : filteredArtworks.length === 0 ? (
          <div className="text-center py-32">
            <div className="w-32 h-32 bg-neutral-300 dark:bg-neutral-700 rounded-full flex items-center justify-center mx-auto mb-8">
              <Plus className="w-16 h-16 text-neutral-500 dark:text-neutral-400" />
            </div>
            <h3 className="text-3xl font-light text-neutral-900 dark:text-neutral-50 mb-3">
              {isOwner ? 'Votre galerie est vide' : 'Aucune œuvre publique'}
            </h3>
            <p className="text-neutral-600 dark:text-neutral-400 mb-8 text-lg">
              {isOwner ? 'Commencez votre collection en ajoutant votre première œuvre' : 'Cet artiste n\'a pas encore partagé d\'œuvres'}
            </p>
            {isOwner && (
              <button
                onClick={() => setShowUploadModal(true)}
                className="px-8 py-4 bg-[#b8a67d] hover:bg-[#a89668] text-white rounded transition-colors duration-300 inline-flex items-center gap-2 shadow-lg"
              >
                <Plus className="w-5 h-5" />
                Ajouter ma première œuvre
              </button>
            )}
          </div>
        ) : (
          <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
            <AnimatePresence mode="popLayout">
              {filteredArtworks.map((artwork, index) => (
                <motion.div
                  key={artwork.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ 
                    delay: index * 0.05,
                    duration: 0.4
                  }}
                  className="break-inside-avoid mb-6"
                >
                  <ArtworkCard
                    artwork={artwork}
                    onClick={() => {
                      setSelectedArtwork(artwork)
                      if (artwork.image_url.match(/\.(mp3|wav|ogg|m4a|aac)$/i)) {
                        setShowAudioModal(true)
                      }
                    }}
                    isOwner={isOwner}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Upload Modal (Owner only) */}
      {isOwner && (
        <ArtworkUploadModal
          isOpen={showUploadModal}
          onClose={() => setShowUploadModal(false)}
          onSuccess={handleUploadSuccess}
        />
      )}

      {/* Audio Modal */}
      <AudioModal
        artwork={selectedArtwork!}
        isOpen={!!selectedArtwork && !!selectedArtwork.image_url.match(/\.(mp3|wav|ogg|m4a|aac)$/i)}
        onClose={() => {
          setShowAudioModal(false)
          setSelectedArtwork(null)
        }}
        onDelete={isOwner && selectedArtwork ? async () => {
          await deleteArtwork(selectedArtwork.id)
          setShowAudioModal(false)
          setSelectedArtwork(null)
        } : undefined}
        onTogglePublic={isOwner && selectedArtwork ? async () => {
          await updateArtwork(selectedArtwork.id, { is_public: !selectedArtwork.is_public })
        } : undefined}
        isOwner={isOwner}
      />

      {/* Lightbox for images and videos */}
      <ArtworkLightbox
        artwork={selectedArtwork}
        isOpen={!!selectedArtwork && !selectedArtwork.image_url.match(/\.(mp3|wav|ogg|m4a|aac)$/i)}
        onClose={() => setSelectedArtwork(null)}
        onUpdate={isOwner ? updateArtwork : async () => {}}
        onDelete={isOwner ? deleteArtwork : async () => {}}
        isOwner={isOwner}
      />
    </div>
  )
}
