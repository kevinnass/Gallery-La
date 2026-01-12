import { motion } from 'framer-motion'
import type { Artwork } from '@/hooks/useArtworks'

interface ArtworkCardProps {
  artwork: Artwork
  onClick: () => void
  isOwner?: boolean
}

export const ArtworkCard = ({ artwork, onClick, isOwner = true }: ArtworkCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4 }}
      onClick={onClick}
      className="group relative cursor-pointer"
    >
      {/* Subtle Glow */}
      <div className="absolute -inset-4 bg-gradient-radial from-amber-200/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl" />
      
      {/* Card Container */}
      <div className="relative transform transition-all duration-500 group-hover:scale-[1.02] group-hover:-translate-y-1">
        {/* Media Display */}
        <div className="relative rounded-lg overflow-hidden shadow-lg group-hover:shadow-2xl transition-shadow duration-500">
          {artwork.image_url.match(/\.(mp4|webm|ogg|mov)$/i) ? (
            // Video Player
            <div className="relative bg-neutral-900 aspect-video">
              <video
                src={artwork.image_url}
                className="w-full h-full object-cover"
                controls
                preload="metadata"
              />
              <div className="absolute top-2 left-2 px-3 py-1.5 bg-black/70 backdrop-blur-sm rounded-full text-white text-xs font-medium flex items-center gap-1.5">
                <span className="text-lg">🎬</span>
                Vidéo
              </div>
            </div>
          ) : artwork.image_url.match(/\.(mp3|wav|ogg|m4a|aac)$/i) ? (
            // Audio Player - Modern Design
            <div className="relative overflow-hidden rounded-lg">
              {/* Top Section: Cover or Gradient */}
              <div className="relative aspect-square">
                {artwork.cover_image_url ? (
                  // Show cover image if available
                  <img
                    src={artwork.cover_image_url}
                    alt={artwork.title || 'Audio cover'}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  // Fallback gradient design with music note
                  <div className="relative bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 w-full h-full flex flex-col items-center justify-center">
                    <div className="absolute inset-0 bg-black/10" />
                    <div className="relative z-10 text-center">
                      <div className="text-8xl mb-4">🎵</div>
                      <h3 className="text-white font-bold text-xl line-clamp-2 px-4">
                        {artwork.title || 'Audio'}
                      </h3>
                    </div>
                  </div>
                )}
                
                {/* Audio Badge */}
                <div className="absolute top-3 left-3 px-3 py-1.5 bg-black/70 backdrop-blur-sm rounded-full text-white text-xs font-medium flex items-center gap-1.5">
                  <span className="text-base">🎧</span>
                  Audio
                </div>
              </div>

              {/* Bottom Section: Audio Player */}
              <div className="bg-white dark:bg-neutral-900 p-4">
                <audio
                  src={artwork.image_url}
                  controls
                  controlsList="nodownload"
                  className="w-full"
                  preload="metadata"
                />
              </div>
            </div>
          ) : (
            // Image
            <>
              <img
                src={artwork.image_url}
                alt={artwork.title || 'Sans titre'}
                className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
              />
              {/* Subtle Overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300 pointer-events-none" />
            </>
          )}
        </div>


      </div>

      {/* Info Label */}
      {(artwork.title || artwork.description) && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-4"
        >
          <div className="flex items-center gap-2">
            {isOwner && (
              <span className="text-lg">
                {artwork.is_public ? '🌐' : '🔒'}
              </span>
            )}
            <h3 className="text-base font-medium text-neutral-900 dark:text-neutral-100 line-clamp-1">
              {artwork.title || 'Sans titre'}
            </h3>
          </div>
          {artwork.description && (
            <p className="text-sm text-neutral-500 dark:text-neutral-400 line-clamp-1 mt-1">
              {artwork.description}
            </p>
          )}
        </motion.div>
      )}
    </motion.div>
  )
}
