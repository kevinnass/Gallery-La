import { motion } from 'framer-motion'
import { GalleryArtworkCard } from '../GalleryArtworkCard'
import type { Artwork } from '@/hooks/useArtworks'

interface EditorialLayoutProps {
  artworks: Artwork[]
  onArtworkClick: (artwork: Artwork) => void
  isOwner?: boolean
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
}

const item = {
  hidden: { opacity: 0, y: 40 },
  show: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 1.2,
      ease: [0.23, 1, 0.32, 1] as any
    }
  },
}

export const EditorialLayout = ({ artworks, onArtworkClick, isOwner }: EditorialLayoutProps) => {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="max-w-6xl mx-auto space-y-64 py-24"
    >
      {artworks.map((artwork, index) => (
        <motion.div
          key={artwork.id}
          variants={item}
          className={`relative flex flex-col ${index % 2 === 0 ? 'items-start pl-4 md:pl-12' : 'items-end pr-4 md:pr-12'}`}
        >
          {/* Background Index Number */}
          <span className="absolute -top-12 left-1/2 -translate-x-1/2 text-[120px] font-display font-bold text-neutral-100 dark:text-neutral-900 pointer-events-none select-none z-0">
            {String(index + 1).padStart(2, '0')}
          </span>

          <div className="w-full md:w-[75%] relative z-10">
            <GalleryArtworkCard
              artwork={artwork}
              onClick={() => onArtworkClick(artwork)}
              isOwner={isOwner}
              variant="editorial"
            />
          </div>
        </motion.div>
      ))}
      
    </motion.div>
  )
}
