import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useProfile, type ProfileWithStats } from '@/hooks/useProfile'
import { ScrollToTop } from '@/components/ui/ScrollToTop'

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

export const ArtistsPage = () => {
  const navigate = useNavigate()
  const { fetchAllArtists } = useProfile()
  const [artists, setArtists] = useState<ProfileWithStats[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadArtists = async () => {
      setLoading(true)
      const artistsData = await fetchAllArtists()
      setArtists(artistsData)
      setLoading(false)
    }
    loadArtists()
  }, [])

  return (
    <div className="min-h-screen bg-background dark:bg-neutral-950 transition-colors pt-32 pb-20 selection:bg-purple-500/30">
      <div className="container mx-auto max-w-7xl px-6">
        {/* Page Header */}
        <div className="mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-[10px] uppercase tracking-[0.5em] text-neutral-600 dark:text-neutral-500 font-medium mb-4 block">
              Communauté
            </span>
            <h1 className="text-5xl md:text-7xl font-display font-medium text-neutral-900 dark:text-neutral-50 tracking-tight mb-6">
              Les Artistes
            </h1>
            <div className="w-12 h-[1px] bg-purple-600/30 mb-8" />
            <p className="text-neutral-500 dark:text-neutral-400 font-light text-xl max-w-2xl leading-relaxed">
              Découvrez les créateurs et leurs œuvres.
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
        ) : artists.length === 0 ? (
          <div className="text-center py-48">
            <p className="text-neutral-400 dark:text-neutral-500 text-xs font-light uppercase tracking-[0.5em]">
              Aucun artiste répertorié
            </p>
          </div>
        ) : (
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12"
          >
            {artists.map((artist) => (
              <motion.div
                key={artist.id}
                variants={item}
                onClick={() => navigate(`/artists/${artist.username}`)}
                className="group cursor-crosshair border-[0.5px] border-neutral-200 dark:border-neutral-800 bg-white/50 dark:bg-neutral-950/50 backdrop-blur-sm p-8 transition-all duration-700 hover:bg-neutral-50 dark:hover:bg-neutral-900/50 relative overflow-hidden"
              >
                {/* Internal "Canvas" Border */}
                <div className="absolute inset-2 border-[0.5px] border-neutral-100 dark:border-neutral-900 group-hover:border-purple-500/10 transition-colors duration-700 pointer-events-none" />

                <div className="relative z-10 flex flex-col h-full">
                  <div className="flex-1 mb-12">
                     <div className="flex items-center justify-between mb-6">
                      <span className="text-[8px] uppercase tracking-[0.4em] text-neutral-400 dark:text-neutral-500 font-medium">
                        Profil_Artiste
                      </span>
                      <div className="w-8 h-px bg-neutral-100 dark:bg-neutral-900" />
                    </div>

                    <h3 className="text-3xl font-display font-medium text-neutral-900 dark:text-neutral-100 tracking-tight mb-4 group-hover:text-purple-600 transition-colors duration-500">
                      {artist.username || 'Anonyme'}
                    </h3>
                    
                    {artist.specialty && (
                      <p className="text-[10px] uppercase tracking-[0.2em] font-medium text-purple-600/60 dark:text-purple-400/60 mb-4">
                        {artist.specialty}
                      </p>
                    )}
                    
                    {artist.bio && (
                      <p className="text-sm text-neutral-500 dark:text-neutral-400 font-light leading-relaxed line-clamp-2 mb-6">
                        {artist.bio}
                      </p>
                    )}
                  </div>

                  {/* Artwork Preview Strip */}
                  <div className="relative h-24 mb-8 bg-neutral-50 dark:bg-neutral-900/50 border-[0.5px] border-neutral-100 dark:border-neutral-800 p-2">
                    {artist.recent_artworks && artist.recent_artworks.length > 0 ? (
                      <div className="grid grid-cols-3 gap-2 h-full">
                        {artist.recent_artworks.slice(0, 3).map((artwork) => (
                          <div key={artwork.id} className="relative overflow-hidden grayscale hover:grayscale-0 transition-all duration-700">
                             <img
                                src={artwork.image_url.match(/\.(mp3|wav|ogg|m4a|aac)$/i) ? (artwork.cover_image_url || '') : artwork.image_url}
                                alt=""
                                className="w-full h-full object-cover opacity-50 group-hover:opacity-100 transition-opacity"
                              />
                              {!artwork.image_url.match(/\.(mp3|wav|ogg|m4a|aac)$/i) === false && !artwork.cover_image_url && (
                                <div className="absolute inset-0 flex items-center justify-center bg-neutral-100 dark:bg-neutral-800">
                                  <span className="text-xs">🎵</span>
                                </div>
                              )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="h-full flex items-center justify-center opacity-10">
                        <span className="text-[10px] uppercase tracking-widest font-light">Aucun contenu</span>
                      </div>
                    )}
                  </div>

                  {/* Museum Stats Label */}
                  <div className="flex items-center justify-between border-t border-neutral-100 dark:border-neutral-900 pt-6">
                    <div className="space-y-1">
                      <p className="text-[7px] uppercase tracking-[0.3em] text-neutral-400">Statut_Inventaire</p>
                      <p className="text-[10px] uppercase tracking-[0.1em] font-medium text-neutral-600 dark:text-neutral-400">
                        Taille de la collection: {artist.artwork_count.toString().padStart(2, '0')}
                      </p>
                    </div>
                    <div className="opacity-0 group-hover:opacity-100 transition-all duration-700 translate-x-4 group-hover:translate-x-0">
                      <span className="text-[9px] uppercase tracking-[0.3em] text-purple-600 font-medium">Entrer →</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
      <ScrollToTop />
    </div>
  )
}
