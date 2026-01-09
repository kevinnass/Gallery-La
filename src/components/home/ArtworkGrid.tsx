import { motion } from 'framer-motion'
import { ArtworkCard } from '@/components/ui/ArtworkCard'

// Mock artwork data
const mockArtworks = [
  {
    id: '1',
    title: 'Couleurs Abstraites',
    creator: 'derupdoop',
    imageUrl: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=400&fit=crop',
    date: '2024-03-17',
    category: 'art',
    type: 'image' as const,
  },
  {
    id: '2',
    title: 'Forme d\'onde',
    creator: '',
    type: 'audio' as const,
    category: 'audio',
  },
  {
    id: '3',
    title: 'Architecture',
    creator: '',
    imageUrl: 'https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=400&h=400&fit=crop',
    category: 'photo',
    type: 'image' as const,
  },
  {
    id: '4',
    title: 'Minimal',
    creator: '',
    emoji: '🎨',
    type: 'icon' as const,
  },
  {
    id: '5',
    title: 'Personnes',
    creator: '',
    imageUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop',
    type: 'image' as const,
  },
  {
    id: '6',
    title: 'Musique',
    creator: '',
    imageUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&h=400&fit=crop',
    category: 'digital',
    type: 'image' as const,
  },
  {
    id: '7',
    title: 'Coucher de soleil',
    creator: '',
    imageUrl: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=400&h=400&fit=crop',
    type: 'image' as const,
  },
  {
    id: '8',
    title: 'Peinture',
    creator: '',
    imageUrl: 'https://images.unsplash.com/photo-1547826039-bfc35e0f1ea8?w=400&h=400&fit=crop',
    category: 'art',
    type: 'image' as const,
  },
  {
    id: '9',
    title: 'Bleu Profond',
    creator: '',
    emoji: '🌊',
    type: 'icon' as const,
  },
]

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
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
}

export const ArtworkGrid = () => {
  return (
    <section className="bg-background dark:bg-neutral-950 px-4 py-12 lg:py-16 transition-colors">
      <div className="container mx-auto max-w-7xl">
        {/* Grid - responsive columns */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        >
          {mockArtworks.map((artwork) => (
            <motion.div key={artwork.id} variants={item}>
              <ArtworkCard {...artwork} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
