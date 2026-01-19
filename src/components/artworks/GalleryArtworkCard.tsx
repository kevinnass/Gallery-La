import { motion } from 'framer-motion'
import { Camera, Music, Play } from 'lucide-react'
import type { Artwork } from '@/hooks/useArtworks'

interface GalleryArtworkCardProps {
  artwork: Artwork
  onClick: () => void
  isOwner?: boolean
  artistName?: string
  onArtistClick?: (username: string) => void
}

export const GalleryArtworkCard = ({ artwork, onClick, isOwner = false, artistName, onArtistClick }: GalleryArtworkCardProps) => {
  const isVideo = artwork.image_url.match(/\.(mp4|webm|ogg|mov)$/i)
  const isAudio = artwork.image_url.match(/\.(mp3|wav|ogg|m4a|aac)$/i)

  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
      onClick={onClick}
      className="group relative bg-white/50 dark:bg-neutral-950/50 border-[0.5px] border-neutral-200 dark:border-neutral-800 p-6 md:p-8 flex flex-col items-center aspect-[4/5] overflow-hidden cursor-crosshair transition-all duration-700 hover:bg-neutral-50 dark:hover:bg-neutral-900/50 backdrop-blur-sm"
    >
      {/* Media Type Indicator */}
      <div className="absolute top-6 left-6 z-20 opacity-20 group-hover:opacity-40 transition-opacity duration-700 pointer-events-none">
        {isVideo ? (
          <Play size={20} className="text-black dark:text-neutral-300" />
        ) : isAudio ? (
          <Music size={20} className="text-black dark:text-neutral-300" />
        ) : (
          <Camera size={20} className="text-black dark:text-neutral-300" />
        )}
      </div>

      {/* Internal "Canvas" Border */}
      <div className="absolute inset-4 border-[0.5px] border-neutral-100 dark:border-neutral-901 group-hover:border-purple-500/20 transition-colors duration-700 pointer-events-none" />

      {/* Media Content - restricted height to prevent overlap */}
      <div className="relative z-10 w-full h-3/4 flex items-center justify-center transition-transform duration-700 group-hover:scale-[1.02] mt-2">
        {isVideo ? (
          <video
            src={artwork.image_url}
            className="max-w-full max-h-full object-contain shadow-2xl"
            muted
            loop
            onMouseOver={(e) => e.currentTarget.play()}
            onMouseOut={(e) => e.currentTarget.pause()}
          />
        ) : isAudio ? (
          <div className="relative w-full h-full flex flex-col items-center justify-center">
            {artwork.cover_image_url ? (
              <img
                src={artwork.cover_image_url}
                alt={artwork.title}
                className="max-w-full max-h-full object-contain shadow-2xl"
              />
            ) : (
              <div className="w-24 h-24 bg-gradient-to-br from-neutral-100 to-neutral-200 dark:from-neutral-800 dark:to-neutral-900 flex items-center justify-center shadow-xl rounded-sm">
                <span className="text-4xl opacity-20 group-hover:opacity-40 transition-opacity">🎵</span>
              </div>
            )}
            <div className="absolute bottom-4 bg-purple-600 w-1 h-1 rounded-full animate-pulse" />
          </div>
        ) : (
          <img
            src={artwork.image_url}
            alt={artwork.title || 'Artwork'}
            className="max-w-full max-h-full object-contain shadow-2xl"
            loading="lazy"
          />
        )}
      </div>

      {/* Museum Style Labels */}
      <div className="absolute bottom-6 left-6 right-6 text-left space-y-1">
        <div className="flex items-center gap-2 mb-0.5">
          {isOwner && (
            <span className="text-[10px] opacity-40">
              {artwork.is_public ? '🌐' : '🔒'}
            </span>
          )}
          <p className="text-[7px] md:text-[8px] uppercase tracking-[0.4em] font-medium text-neutral-400 dark:text-neutral-500">
            Object_{artwork.id.slice(0, 8).toUpperCase()}
          </p>
        </div>
        <h3 className="text-xs md:text-sm font-display font-medium text-neutral-900 dark:text-neutral-100 tracking-tight line-clamp-1">
          {artwork.title || 'Untitled'}
        </h3>
        {artistName && (
          <p className="text-[8px] md:text-[9px] uppercase tracking-[0.1em] text-neutral-500 dark:text-neutral-400 font-light italic">
            by @{artistName}
          </p>
        )}
      </div>

      {/* Hover Info Indicator */}
      <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <div className="flex items-center gap-2">
           <span className="text-[7px] uppercase tracking-[0.4em] text-neutral-400">View</span>
           <div className="w-3 h-px bg-purple-600" />
        </div>
      </div>
    </motion.div>
  )
}
