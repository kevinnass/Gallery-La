import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface ArtworkCardProps {
  id: string
  title: string
  creator: string
  imageUrl?: string
  date?: string
  category?: string
  type?: 'image' | 'audio' | 'icon'
  emoji?: string
  className?: string
}

export const ArtworkCard = ({
  title,
  creator,
  imageUrl,
  date,
  category,
  type = 'image',
  emoji,
  className,
}: ArtworkCardProps) => {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className={cn(
        'group relative overflow-hidden rounded-2xl bg-card dark:bg-neutral-900 shadow-sm hover:shadow-md transition-all',
        className
      )}
    >
      {/* Content Container */}
      <div className="relative aspect-square overflow-hidden bg-neutral-100 dark:bg-neutral-800">
        {imageUrl && type === 'image' ? (
          <img
            src={imageUrl}
            alt={title}
            className="h-full w-full object-cover"
          />
        ) : type === 'audio' ? (
          <div className="flex h-full w-full items-center justify-center bg-white dark:bg-neutral-800 p-8">
            {/* Simple audio waveform representation */}
            <div className="flex items-center gap-1 h-24">
              {[...Array(40)].map((_, i) => (
                <div
                  key={i}
                  className="w-1 bg-black dark:bg-white rounded-full"
                  style={{
                    height: `${Math.random() * 100}%`,
                  }}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-white dark:bg-neutral-800">
            <div className="text-6xl">{emoji || '🎨'}</div>
          </div>
        )}
        
        {/* Metadata Overlay */}
        {(date || category) && (
          <div className="absolute inset-0 p-4">
            <div className="flex items-start justify-between">
              {date && (
                <span className="text-xs font-mono text-white bg-black/50 dark:bg-white/20 px-2 py-1 rounded">
                  {date}
                </span>
              )}
              {category && (
                <span className="text-xs font-mono text-white bg-black/50 dark:bg-white/20 px-2 py-1 rounded">
                  {category}
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Bottom metadata */}
      {creator && (
        <div className="p-3">
          <p className="text-xs text-muted dark:text-neutral-400 font-mono">{creator}</p>
        </div>
      )}
    </motion.div>
  )
}
