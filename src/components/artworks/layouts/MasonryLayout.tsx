import { motion } from 'framer-motion'
import { GalleryArtworkCard } from '../GalleryArtworkCard'
import type { Artwork } from '@/hooks/useArtworks'

interface MasonryLayoutProps {
  artworks: Artwork[]
  onArtworkClick: (artwork: Artwork) => void
  isOwner?: boolean
}

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
  hidden: { opacity: 0, scale: 0.95, y: 20 },
  show: { 
    opacity: 1, 
    scale: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.23, 1, 0.32, 1] as any
    }
  },
}

export const MasonryLayout = ({ artworks, onArtworkClick, isOwner }: MasonryLayoutProps) => {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="columns-1 md:columns-2 lg:columns-4 gap-4 space-y-4"
    >
      {artworks.map((artwork, index) => (
        <motion.div
          key={artwork.id}
          variants={item}
          className="break-inside-avoid"
        >
          <GalleryArtworkCard
            artwork={artwork}
            onClick={() => onArtworkClick(artwork)}
            isOwner={isOwner}
            variant={index % 3 === 0 ? 'boxed' : 'fluid'}
          />
        </motion.div>
      ))}
    </motion.div>
  )
}
