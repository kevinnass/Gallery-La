import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Camera, Music, Play, LayoutGrid, SlidersHorizontal, Search } from 'lucide-react'
import { useArtworks, type ArtworkWithProfile } from '@/hooks/useArtworks'
import { GalleryArtworkCard } from '@/components/artworks/GalleryArtworkCard'
import { ArtworkLightbox } from '@/components/artworks/ArtworkLightbox'
import { AudioModal } from '@/components/artworks/AudioModal'
import { ScrollToTop } from '@/components/ui/ScrollToTop'

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
      ease: [0.23, 1, 0.32, 1] as any
    }
  },
}

export const PublicGalleryPage = () => {
  const navigate = useNavigate()
  const { fetchAllPublicArtworks, loading } = useArtworks()
  const [publicArtworks, setPublicArtworks] = useState<ArtworkWithProfile[]>([])
  const [selectedArtwork, setSelectedArtwork] = useState<ArtworkWithProfile | null>(null)
  const [mediaFilter, setMediaFilter] = useState<'all' | 'image' | 'video' | 'audio'>('all')
  const [showFilters, setShowFilters] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

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

  const filteredArtworks = publicArtworks.filter(artwork => {
    let matchesMedia = true;
    const isVideo = artwork.image_url.match(/\.(mp4|webm|ogg|mov)$/i)
    const isAudio = artwork.image_url.match(/\.(mp3|wav|ogg|m4a|aac)$/i)
    
    if (mediaFilter === 'video') matchesMedia = !!isVideo
    if (mediaFilter === 'audio') matchesMedia = !!isAudio
    if (mediaFilter === 'image') matchesMedia = !isVideo && !isAudio

    if (!matchesMedia) return false

    // Search Filter
    const query = searchQuery.toLowerCase()
    return (
      (artwork.title?.toLowerCase().includes(query)) ||
      (artwork.description?.toLowerCase().includes(query)) ||
      (artwork.profile?.username?.toLowerCase().includes(query))
    )
  })

  const counts = {
    all: publicArtworks.length,
    image: publicArtworks.filter(a => !a.image_url.match(/\.(mp4|webm|ogg|mov|mp3|wav|m4a|aac)$/i)).length,
    video: publicArtworks.filter(a => a.image_url.match(/\.(mp4|webm|ogg|mov)$/i)).length,
    audio: publicArtworks.filter(a => a.image_url.match(/\.(mp3|wav|ogg|m4a|aac)$/i)).length
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
            <span className="text-[10px] uppercase tracking-[0.5em] text-neutral-600 dark:text-neutral-500 font-medium mb-4 block">
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

        {/* Search & Filters */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 border-b border-neutral-100 dark:border-neutral-900 pb-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="relative max-w-md w-full"
          >
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input
              type="text"
              placeholder="Rechercher une œuvre, un artiste..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/50 dark:bg-neutral-900/50 border-[0.5px] border-neutral-200 dark:border-neutral-800 rounded-sm py-3 pl-12 pr-4 text-sm font-light focus:outline-none focus:border-purple-600/30 transition-colors placeholder:text-neutral-400"
            />
          </motion.div>

          <motion.button
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-3 px-6 py-3 border-[0.5px] transition-all duration-500 rounded-sm self-start md:self-auto ${
              showFilters || mediaFilter !== 'all'
                ? 'border-purple-600/50 bg-purple-50/50 dark:bg-purple-900/10 text-purple-600'
                : 'border-neutral-200 dark:border-neutral-800 text-neutral-500 hover:border-neutral-400 dark:hover:border-neutral-600'
            }`}
          >
            <SlidersHorizontal size={14} />
            <span className="text-[10px] uppercase tracking-[0.3em] font-medium">
              {mediaFilter === 'all' ? 'Filtrer' : 'Filtré'}
            </span>
          </motion.button>
        </div>

        <div>
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
                className="overflow-hidden"
              >
                <div className="flex flex-wrap gap-8 pt-10 pb-4 border-b border-neutral-100 dark:border-neutral-900">
                  {[
                    { id: 'all', label: 'Tous', icon: LayoutGrid, count: counts.all },
                    { id: 'image', label: 'Photos', icon: Camera, count: counts.image },
                    { id: 'video', label: 'Vidéos', icon: Play, count: counts.video },
                    { id: 'audio', label: 'Audios', icon: Music, count: counts.audio }
                  ].map((f) => (
                    <button
                      key={f.id}
                      onClick={() => {
                        setMediaFilter(f.id as any)
                        // Optionnel: setShowFilters(false) si on veut fermer après selection
                      }}
                      className={`flex items-center gap-3 text-[10px] uppercase tracking-[0.3em] transition-all duration-500 relative pb-4 group ${
                        mediaFilter === f.id
                          ? 'text-purple-600'
                          : 'text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200'
                      }`}
                    >
                      <f.icon className={`w-3 h-3 transition-colors ${mediaFilter === f.id ? 'text-purple-600' : 'text-neutral-400 group-hover:text-neutral-600'}`} />
                      {f.label} ({f.count})
                      {mediaFilter === f.id && (
                        <motion.div 
                          layoutId="activeMediaFilter"
                          className="absolute bottom-[-1px] left-0 right-0 h-px bg-purple-600" 
                        />
                      )}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        {loading ? (
          <div className="flex items-center justify-center py-48">
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              className="w-10 h-10 border-[0.5px] border-neutral-200 dark:border-neutral-800 border-t-purple-600 rounded-full" 
            />
          </div>
        ) : filteredArtworks.length === 0 ? (
          <div className="text-center py-48">
            <p className="text-neutral-400 dark:text-neutral-500 text-xs font-light uppercase tracking-[0.5em]">
              Aucun média correspondant
            </p>
          </div>
        ) : (
          <motion.div
            variants={container}
            key={`grid-${mediaFilter}-${searchQuery}`} // Use key to trigger animation on filter/search change
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12"
          >
            <AnimatePresence mode="popLayout">
              {filteredArtworks.map((artwork) => (
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
      <ScrollToTop />
    </div>
  )
}
