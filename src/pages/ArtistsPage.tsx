import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Users } from 'lucide-react'
import { useProfile, type ProfileWithStats } from '@/hooks/useProfile'

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="min-h-screen bg-background dark:bg-neutral-950 transition-colors pt-20">
      <div className="container mx-auto max-w-7xl px-4 py-12">
        {/* Page Header */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-neutral-900 dark:text-neutral-100 mb-4">
            Nos Artistes
          </h1>
          <p className="text-lg text-neutral-600 dark:text-neutral-400">
            Découvrez les créateurs talentueux de notre communauté
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-32">
            <div className="w-12 h-12 border-4 border-neutral-300 dark:border-neutral-700 border-t-neutral-700 dark:border-t-neutral-300 rounded-full animate-spin" />
          </div>
        ) : artists.length === 0 ? (
          <div className="text-center py-32">
            <Users className="w-16 h-16 text-neutral-400 dark:text-neutral-600 mx-auto mb-4" />
            <p className="text-neutral-600 dark:text-neutral-400 text-lg">
              Aucun artiste pour le moment
            </p>
          </div>
        ) : (
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {artists.map((artist) => (
              <motion.div
                key={artist.id}
                variants={item}
                onClick={() => navigate(`/artists/${artist.username}`)}
                className="group cursor-pointer"
              >
                <div className="bg-white dark:bg-neutral-900 rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300">
                  {/* Artist Info Header */}
                  <div className="p-6 pb-4">
                    <h3 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-1">
                      {artist.username || 'Artiste'}
                    </h3>
                    
                    {artist.specialty && (
                      <p className="text-sm font-medium text-purple-600 dark:text-purple-400 mb-2">
                        {artist.specialty}
                      </p>
                    )}
                    
                    {artist.bio && (
                      <p className="text-sm text-neutral-600 dark:text-neutral-400 line-clamp-2 mb-3">
                        {artist.bio}
                      </p>
                    )}
                    
                    <div className="flex items-center gap-2 text-sm text-neutral-500 dark:text-neutral-500">
                      <span className="font-semibold text-neutral-900 dark:text-neutral-100">{artist.artwork_count}</span>
                      <span>œuvre{artist.artwork_count > 1 ? 's' : ''}</span>
                    </div>
                  </div>

                  {/* Recent Artworks Preview Grid */}
                  <div className="relative aspect-[4/3] bg-gradient-to-br from-neutral-100 to-neutral-200 dark:from-neutral-800 dark:to-neutral-900 overflow-hidden">
                    {artist.recent_artworks && artist.recent_artworks.length > 0 ? (
                      <div className="grid grid-cols-3 gap-0.5 h-full">
                        {artist.recent_artworks.slice(0, 3).map((artwork) => (
                          <div
                            key={artwork.id}
                            className="relative overflow-hidden bg-neutral-200 dark:bg-neutral-800"
                          >
                            {artwork.image_url.match(/\.(mp3|wav|ogg|m4a|aac)$/i) ? (
                              // Audio: show cover or gradient
                              artwork.cover_image_url ? (
                                <img
                                  src={artwork.cover_image_url}
                                  alt="Audio cover"
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                                  <span className="text-3xl">🎵</span>
                                </div>
                              )
                            ) : (
                              // Image or video
                              <img
                                src={artwork.image_url}
                                alt=""
                                className="w-full h-full object-cover"
                              />
                            )}
                          </div>
                        ))}
                        {/* Fill remaining slots if less than 3 artworks */}
                        {[...Array(Math.max(0, 3 - (artist.recent_artworks?.length || 0)))].map((_, idx) => (
                          <div
                            key={`empty-${idx}`}
                            className="bg-neutral-300 dark:bg-neutral-700"
                          />
                        ))}
                      </div>
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <Users className="w-20 h-20 text-neutral-400 dark:text-neutral-600" />
                      </div>
                    )}
                    
                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-6">
                      <span className="text-white font-semibold text-lg">
                        Voir la galerie →
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  )
}
