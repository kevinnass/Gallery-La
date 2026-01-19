import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useArtworks, type ArtworkWithProfile } from '@/hooks/useArtworks'
import { GalleryArtworkCard } from '@/components/artworks/GalleryArtworkCard'
import { ArtworkLightbox } from '@/components/artworks/ArtworkLightbox'
import { AudioModal } from '@/components/artworks/AudioModal'

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const item = {
  hidden: { opacity: 0, y: 30 },
  show: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.23, 1, 0.32, 1]
    }
  },
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
    <div className="relative min-h-screen bg-background dark:bg-neutral-950 transition-colors pt-32 pb-20 selection:bg-purple-500/30">
      <div className="container mx-auto max-w-7xl px-4 relative z-10">
        {/* Page Header */}
       <div className="mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-[10px] uppercase tracking-[0.5em] text-neutral-400 dark:text-neutral-500 font-medium mb-4 block">
              Exposition
            </span>
            <h1 className="text-5xl md:text-7xl font-display font-medium text-neutral-900 dark:text-neutral-50 tracking-tight mb-6">
              La Galerie
            </h1>
            <div className="w-12 h-[1px] bg-purple-600/30 mb-8" />
            <p className="text-neutral-500 dark:text-neutral-400 font-light text-xl max-w-2xl leading-relaxed">
              Découvrez les œuvres des artistes.
            </p>
          </motion.div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-48">
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              className="w-10 h-10 border-[0.5px] border-neutral-200 dark:border-neutral-800 border-t-purple-600 rounded-full" 
            />
          </div>
        ) : publicArtworks.length === 0 ? (
          <div className="text-center py-48">
            <p className="text-neutral-400 dark:text-neutral-500 text-xs font-light uppercase tracking-[0.5em]">
              Séléction vide
            </p>
          </div>
        ) : (
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12"
          >
            <AnimatePresence mode="popLayout">
              {publicArtworks.map((artwork) => (
                <motion.div
                  key={artwork.id}
                  variants={item}
                  className="w-full"
                >
                  <GalleryArtworkCard
                    artwork={artwork}
                    onClick={() => setSelectedArtwork(artwork)}
                    artistName={artwork.profile?.username}
                    onArtistClick={handleArtistClick}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>

      {/* Modals remain the same */}
      {selectedArtwork && selectedArtwork.image_url.match(/\.(mp3|wav|ogg|m4a|aac)$/i) ? (
        <AudioModal
          artwork={selectedArtwork}
          isOpen={true}
          onClose={() => setSelectedArtwork(null)}
          isOwner={false}
          artistName={selectedArtwork.profile?.username}
          onArtistClick={handleArtistClick}
        />
      ) : (
        <ArtworkLightbox
          artwork={selectedArtwork}
          isOpen={!!selectedArtwork}
          onClose={() => setSelectedArtwork(null)}
          onUpdate={async () => {}}
          onDelete={async () => {}}
          isOwner={false}
          artistName={selectedArtwork?.profile?.username}
          onArtistClick={handleArtistClick}
        />
      )}
    </div>
  )
}
