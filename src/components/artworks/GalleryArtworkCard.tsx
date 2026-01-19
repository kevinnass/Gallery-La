import { motion } from 'framer-motion'
import { Camera, Music, Play } from 'lucide-react'
import type { Artwork } from '@/hooks/useArtworks'

interface GalleryArtworkCardProps {
  artwork: Artwork
  onClick: () => void
  isOwner?: boolean
  artistName?: string
  onArtistClick?: (username: string) => void
  variant?: 'boxed' | 'fluid' | 'editorial'
}

export const GalleryArtworkCard = ({ 
  artwork, 
  onClick, 
  isOwner = false, 
  artistName,
  variant = 'boxed'
}: GalleryArtworkCardProps) => {
  const isVideo = artwork.image_url.match(/\.(mp4|webm|ogg|mov)$/i)
  const isAudio = artwork.image_url.match(/\.(mp3|wav|ogg|m4a|aac)$/i)

  if (variant === 'editorial') {
    return (
      <motion.div
        onClick={onClick}
        className="group relative w-full space-y-8 cursor-crosshair pb-12 border-b border-neutral-100 dark:border-neutral-900"
      >
        <div className="relative overflow-hidden bg-neutral-50 dark:bg-neutral-900/30">
          {isVideo ? (
            <video
              src={artwork.image_url}
              className="w-full h-auto max-h-[70vh] object-contain mx-auto shadow-2xl transition-transform duration-1000 group-hover:scale-[1.02]"
              muted
              loop
              onContextMenu={(e) => e.preventDefault()}
              onMouseOver={(e) => e.currentTarget.play()}
              onMouseOut={(e) => e.currentTarget.pause()}
            />
          ) : isAudio ? (
            <div className="aspect-video flex items-center justify-center">
              {artwork.cover_image_url ? (
                <img
                  src={artwork.cover_image_url}
                  className="w-full h-full object-cover opacity-80"
                  alt=""
                />
              ) : (
                <span className="text-8xl opacity-10">🎵</span>
              )}
            </div>
          ) : (
            <img
              src={artwork.image_url}
              alt={artwork.title || ''}
              className="w-full h-auto max-h-[80vh] object-contain mx-auto shadow-2xl transition-transform duration-1000 group-hover:scale-[1.02]"
            />
          )}
        </div>

        <div className="space-y-4 max-w-2xl">
          <h3 className="text-4xl md:text-5xl font-display font-medium text-neutral-900 dark:text-neutral-50 tracking-tight">
            {artwork.title || 'Sans titre'}
          </h3>
          
          {artwork.description && (
            <p className="text-lg text-neutral-500 dark:text-neutral-400 font-light leading-relaxed line-clamp-3">
              {artwork.description}
            </p>
          )}

          <div className="pt-4 flex items-center justify-between">
          
            <button className="text-[10px] uppercase tracking-[0.3em] text-neutral-400 hover:text-purple-600 transition-colors flex items-center gap-2 group/btn">
              Explorer l'œuvre
              <div className="w-4 h-px bg-neutral-200 group-hover/btn:w-8 transition-all" />
            </button>
          </div>
        </div>
      </motion.div>
    )
  }

  const isFluid = variant === 'fluid'

  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
      onClick={onClick}
      className={`group relative bg-white/50 dark:bg-neutral-950/50 border-[0.5px] border-neutral-200 dark:border-neutral-800 flex flex-col items-center overflow-hidden cursor-crosshair transition-all duration-700 hover:bg-neutral-50 dark:hover:bg-neutral-900/50 backdrop-blur-sm ${
        isFluid ? 'p-2 pt-4 pb-16' : 'p-6 md:p-8 aspect-[4/5]'
      }`}
    >
      {/* Media Type Indicator */}
      <div className={`absolute top-6 left-6 z-20 opacity-20 group-hover:opacity-40 transition-opacity duration-700 pointer-events-none ${isFluid ? 'top-4 left-4 scale-75' : ''}`}>
        {isVideo ? (
          <Play size={20} className="text-black dark:text-neutral-300" />
        ) : isAudio ? (
          <Music size={20} className="text-black dark:text-neutral-300" />
        ) : (
          <Camera size={20} className="text-black dark:text-neutral-300" />
        )}
      </div>

      {!isFluid && (
        <div className="absolute inset-4 border-[0.5px] border-neutral-100 dark:border-neutral-901 group-hover:border-purple-500/20 transition-colors duration-700 pointer-events-none" />
      )}

      {/* Media Content */}
      <div className={`relative z-10 w-full flex items-center justify-center transition-transform duration-700 group-hover:scale-[1.02] ${
        isFluid ? 'h-auto mb-4' : 'h-3/4 mt-2'
      }`}>
        {isVideo ? (
          <video
            src={artwork.image_url}
            className={`max-w-full object-contain ${isFluid ? 'rounded-sm shadow-lg' : 'max-h-full shadow-2xl'}`}
            muted
            loop
            onContextMenu={(e) => e.preventDefault()}
            onMouseOver={(e) => e.currentTarget.play()}
            onMouseOut={(e) => e.currentTarget.pause()}
          />
        ) : isAudio ? (
          <div className="relative w-full h-full flex flex-col items-center justify-center py-8">
            {artwork.cover_image_url ? (
              <img
                src={artwork.cover_image_url}
                alt={artwork.title}
                className={`max-w-full object-contain ${isFluid ? 'rounded-sm shadow-lg' : 'max-h-full shadow-2xl'}`}
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
            className={`max-w-full object-contain ${isFluid ? 'rounded-sm shadow-lg' : 'max-h-full shadow-2xl'}`}
            loading="lazy"
          />
        )}
      </div>

      {/* Info Labels */}
      <div className={`absolute bottom-6 left-6 right-6 text-left space-y-1 ${isFluid ? 'bottom-4 left-4 right-4' : ''}`}>
        <div className="flex items-center gap-2 mb-0.5">
          {isOwner && (
            <span className="text-[10px] opacity-40">
              {artwork.is_public ? '🌐' : '🔒'}
            </span>
          )}
        </div>
        <h3 className={`text-xs font-display font-medium text-neutral-900 dark:text-neutral-100 tracking-tight line-clamp-1 ${isFluid ? 'text-[10px]' : 'md:text-sm'}`}>
          {artwork.title || 'Untitled'}
        </h3>
        {artistName && !isFluid && (
          <p className="text-[8px] md:text-[9px] uppercase tracking-[0.1em] text-neutral-500 dark:text-neutral-400 font-light italic">
            by @{artistName}
          </p>
        )}
      </div>

      {/* Hover Info Indicator */}
      {!isFluid && (
        <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <div className="flex items-center gap-2">
             <span className="text-[7px] uppercase tracking-[0.4em] text-neutral-400">View</span>
             <div className="w-3 h-px bg-purple-600" />
          </div>
        </div>
      )}
    </motion.div>
  )
}
