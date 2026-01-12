import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useArtworks, type ArtworkWithProfile } from '@/hooks/useArtworks'
import { ArtworkCard } from '@/components/artworks/ArtworkCard'
import { ArtworkLightbox } from '@/components/artworks/ArtworkLightbox'
import { AudioModal } from '@/components/artworks/AudioModal'

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
}

export const PublicGalleryPage = () => {
  const navigate = useNavigate()
  const { fetchAllPublicArtworks, loading } = useArtworks()
  const [publicArtworks, setPublicArtworks] = useState<ArtworkWithProfile[]>([])
  const [selectedArtwork, setSelectedArtwork] = useState<ArtworkWithProfile | null>(null)

  useEffect(() => {
    const loadPublicArtworks = async () => {
      const artworks = await fetchAllPublicArtworks(50)
      setPublicArtworks(artworks)
    }
    loadPublicArtworks()
  }, [fetchAllPublicArtworks])

  const handleArtistClick = (username: string) => {
    navigate(`/artists/${username}`)
  }

  return (
    <div className="min-h-screen bg-background dark:bg-neutral-950 transition-colors pt-20">
      <div className="container mx-auto max-w-7xl px-4 py-12">
        {/* Page Header */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-neutral-900 dark:text-neutral-100 mb-4">
            Galerie Publique
          </h1>
          <p className="text-lg text-neutral-600 dark:text-neutral-400">
            Découvrez les créations de notre communauté d'artistes
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-32">
            <div className="w-12 h-12 border-4 border-neutral-300 dark:border-neutral-700 border-t-neutral-700 dark:border-t-neutral-300 rounded-full animate-spin" />
          </div>
        ) : publicArtworks.length === 0 ? (
          <div className="text-center py-32">
            <p className="text-neutral-600 dark:text-neutral-400 text-lg">
              Aucune œuvre publique pour le moment
            </p>
          </div>
        ) : (
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6"
          >
            <AnimatePresence mode="popLayout">
              {publicArtworks.map((artwork, index) => (
                <motion.div
                  key={artwork.id}
                  variants={item}
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
                    onClick={() => setSelectedArtwork(artwork)}
                    isOwner={false}
                    artistName={artwork.profile?.username}
                    onArtistClick={handleArtistClick}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>

      {/* Audio Modal */}
      {selectedArtwork && selectedArtwork.image_url.match(/\.(mp3|wav|ogg|m4a|aac)$/i) ? (
        <AudioModal
          artwork={selectedArtwork}
          isOpen={true}
          onClose={() => setSelectedArtwork(null)}
          isOwner={false}
        />
      ) : (
        /* Lightbox for images and videos */
        <ArtworkLightbox
          artwork={selectedArtwork}
          isOpen={!!selectedArtwork}
          onClose={() => setSelectedArtwork(null)}
          onUpdate={async () => {}}
          onDelete={async () => {}}
          isOwner={false}
        />
      )}
    </div>
  )
}
