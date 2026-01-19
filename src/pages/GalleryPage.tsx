import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, ArrowLeft, Grid, Layout, Maximize2, Loader2, Camera, Music, Play, SlidersHorizontal, Search } from 'lucide-react'
import { useArtworks, type Artwork } from '@/hooks/useArtworks'
import { useProfile } from '@/hooks/useProfile'
import { useAuth } from '@/hooks/useAuth'
import { ArtworkUploadModal } from '@/components/artworks/ArtworkUploadModal'
import { GalleryArtworkCard } from '@/components/artworks/GalleryArtworkCard'
import { ArtworkLightbox } from '@/components/artworks/ArtworkLightbox'
import { AudioModal } from '@/components/artworks/AudioModal'
import { MasonryLayout } from '@/components/artworks/layouts/MasonryLayout'
import { EditorialLayout } from '@/components/artworks/layouts/EditorialLayout'
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

export const GalleryPage = () => {
  const { username } = useParams<{ username: string }>()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { getProfileByUsername } = useProfile()
  const { artworks, loading, fetchPublicArtworks, fetchArtworksByUserId, updateArtwork, updateCoverImage, deleteArtwork, refetch } = useArtworks()
  const { createOrUpdateProfile } = useProfile()

  const [galleryProfile, setGalleryProfile] = useState<any>(null)
  const [profileLoading, setProfileLoading] = useState(true)
  const [isUpdatingLayout, setIsUpdatingLayout] = useState(false)
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [selectedArtwork, setSelectedArtwork] = useState<Artwork | null>(null)
  const [filter, setFilter] = useState<'all' | 'public' | 'private'>('all')
  const [mediaFilter, setMediaFilter] = useState<'all' | 'image' | 'video' | 'audio'>('all')
  const [showFilters, setShowFilters] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const isOwner = user?.id === galleryProfile?.id

  // Load profile and artworks
  useEffect(() => {
    const loadGallery = async () => {
      if (!username) {
        navigate('/404')
        return
      }

      setProfileLoading(true)
      const profile = await getProfileByUsername(username)

      if (!profile) {
        navigate('/404')
        return
      }

      setGalleryProfile(profile)

      // Load artworks based on ownership
      if (user?.id === profile.id) {
        await fetchArtworksByUserId(profile.id)
      } else {
        await fetchPublicArtworks(profile.id)
      }

      setProfileLoading(false)
    }

    loadGallery()
  }, [username, user, getProfileByUsername, fetchPublicArtworks, fetchArtworksByUserId, navigate])

  const handleUploadSuccess = () => {
    refetch()
    setShowUploadModal(false)
  }

  // Filter artworks
  const filteredArtworks = artworks.filter(artwork => {
    // Privacy Filter
    let matchesPrivacy = true
    if (filter === 'public') matchesPrivacy = artwork.is_public
    if (filter === 'private') matchesPrivacy = !artwork.is_public

    if (!matchesPrivacy) return false

    // Media Filter
    let matchesMedia = true
    const isVideo = artwork.image_url.match(/\.(mp4|webm|ogg|mov)$/i)
    const isAudio = artwork.image_url.match(/\.(mp3|wav|ogg|m4a|aac)$/i)

    if (mediaFilter === 'video') matchesMedia = !!isVideo
    else if (mediaFilter === 'audio') matchesMedia = !!isAudio
    else if (mediaFilter === 'image') matchesMedia = !isVideo && !isAudio

    if (!matchesMedia) return false

    // Search Filter
    const query = searchQuery.toLowerCase()
    const matchesSearch = (
      (artwork.title?.toLowerCase().includes(query)) ||
      (artwork.description?.toLowerCase().includes(query))
    )
    
    return matchesSearch
  })

  const mediaCounts = {
    all: artworks.length,
    image: artworks.filter(a => !a.image_url.match(/\.(mp4|webm|ogg|mov|mp3|wav|m4a|aac)$/i)).length,
    video: artworks.filter(a => a.image_url.match(/\.(mp4|webm|ogg|mov)$/i)).length,
    audio: artworks.filter(a => a.image_url.match(/\.(mp3|wav|ogg|m4a|aac)$/i)).length
  }

  const handleUpdateLayout = async (layout: 'grid' | 'masonry' | 'editorial') => {
    if (!isOwner || !galleryProfile) return

    try {
      setIsUpdatingLayout(true)
      await createOrUpdateProfile({
        username: galleryProfile.username,
        specialty: galleryProfile.specialty,
        gallery_layout: layout
      })
      setGalleryProfile((prev: any) => ({ ...prev, gallery_layout: layout }))
    } catch (err) {
      console.error('Error updating layout:', err)
    } finally {
      setIsUpdatingLayout(false)
    }
  }

  if (profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background dark:bg-neutral-950">
         <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            className="w-10 h-10 border-[0.5px] border-neutral-200 dark:border-neutral-800 border-t-purple-600 rounded-full"
          />
      </div>
    )
  }

  return (
    <div className="relative min-h-screen bg-background dark:bg-neutral-950 pt-32 pb-20 selection:bg-purple-500/30">
      <div className="container mx-auto px-6 max-w-7xl relative z-10">
        {/* Header */}
        <div className="mb-20">
          {!isOwner && (
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors mb-8 text-[10px] uppercase tracking-[0.3em]"
            >
              <ArrowLeft className="w-3 h-3" />
              Retour
            </button>
          )}

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <span className="text-[10px] uppercase tracking-[0.5em] text-neutral-600 dark:text-neutral-500 font-medium mb-4 block">
                {isOwner ? 'Votre Espace' : 'Exposition Individuelle'}
              </span>
              <h1 className="text-5xl md:text-7xl font-display font-medium text-neutral-900 dark:text-neutral-50 tracking-tight mb-4">
                {isOwner ? 'Ma Galerie' : galleryProfile?.username}
              </h1>
              <div className="w-12 h-[1px] bg-purple-600/30 mb-6" />
              <p className="text-neutral-500 dark:text-neutral-400 font-light text-lg max-w-xl leading-relaxed">
                {isOwner ? 'Collection personnelle d\'œuvres et d\'intentions.' : galleryProfile?.bio || 'Collection d\'œuvres de ' + galleryProfile?.username}
              </p>
            </motion.div>

            {isOwner && (
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onClick={() => setShowUploadModal(true)}
                className="px-8 py-4 border border-black dark:border-white hover:border-purple-600/50 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-all duration-500 flex items-center gap-3 group"
              >
                <Plus className="w-4 h-4 text-neutral-400 group-hover:text-purple-600" />
                <span className="text-xs uppercase tracking-[0.3em] font-medium text-neutral-600 dark:text-neutral-300">Nouvelle Oeuvre</span>
              </motion.button>
            )}
          </div>
        </div>

        {/* Search & Visibility */}
        {artworks.length > 0 && (
          <div className="mb-12 space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              {/* Search Bar */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="relative max-w-md w-full"
              >
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                <input
                  type="text"
                  placeholder="Rechercher dans votre galerie..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white/50 dark:bg-neutral-900/50 border-[0.5px] border-neutral-200 dark:border-neutral-800 rounded-sm py-3 pl-12 pr-4 text-sm font-light focus:outline-none focus:border-purple-600/30 transition-colors placeholder:text-neutral-400"
                />
              </motion.div>

              {/* Media Filter Toggle */}
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
                  Filtrer
                </span>
              </motion.button>
            </div>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-neutral-100 dark:border-neutral-900 pb-6">
              {/* Privacy Filters (Owner only) - Always Visible */}
              {isOwner ? (
                <div className="flex gap-8">
                  {[
                    { id: 'all', label: 'Tous', count: artworks.length },
                    { id: 'public', label: 'Publiques', count: artworks.filter(a => a.is_public).length },
                    { id: 'private', label: 'Privées', count: artworks.filter(a => !a.is_public).length }
                  ].map((f) => (
                    <button
                      key={f.id}
                      onClick={() => setFilter(f.id as any)}
                      className={`text-[10px] uppercase tracking-[0.3em] transition-all duration-500 relative pb-2 ${
                        filter === f.id
                          ? 'text-purple-600'
                          : 'text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200'
                      }`}
                    >
                      {f.label} ({f.count})
                      {filter === f.id && (
                        <motion.div
                          layoutId="activeFilter"
                          className="absolute bottom-[-1px] left-0 right-0 h-px bg-purple-600"
                        />
                      )}
                    </button>
                  ))}
                </div>
              ) : (
                <div /> // Spacer for non-owners to push filter button to the right
              )}

              {/* Media Filter Toggle */}
            </div>

            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] as any }}
                  className="overflow-hidden"
                >
                  <div className="pt-2">
                    {/* Media Type Filters */}
                    <div className="space-y-4">
                      <span className="text-[8px] uppercase tracking-[0.4em] text-neutral-400 block ml-1">Type de média</span>
                      <div className="flex flex-wrap gap-8 border-b border-neutral-100 dark:border-neutral-900 pb-4">
                       {[
                          { id: 'image', label: 'Photos', icon: Camera, count: mediaCounts.image },
                          { id: 'video', label: 'Vidéos', icon: Play, count: mediaCounts.video },
                          { id: 'audio', label: 'Audios', icon: Music, count: mediaCounts.audio }
                        ].map((f) => (
                          <button
                            key={f.id}
                            onClick={() => setMediaFilter(f.id as any)}
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
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* Layout Switcher (Owner only) */}
        {isOwner && artworks.length > 0 && (
          <div className="flex items-center justify-end gap-6 mb-8">
            <span className="text-[8px] uppercase tracking-[0.4em] text-neutral-400">Scénographie</span>
            <div className="flex items-center gap-1 border-[0.5px] border-neutral-100 dark:border-neutral-900 p-1 rounded-sm bg-neutral-50/30 dark:bg-neutral-900/10">
              {[
                { id: 'grid', icon: Grid, label: 'Musée' },
                { id: 'masonry', icon: Layout, label: 'Masonry' },
                { id: 'editorial', icon: Maximize2, label: 'Éditorial' }
              ].map((l) => (
                <button
                  key={l.id}
                  onClick={() => handleUpdateLayout(l.id as any)}
                  disabled={isUpdatingLayout}
                  className={`p-2 transition-all duration-300 relative group/layout ${
                    galleryProfile?.gallery_layout === l.id
                      ? 'text-purple-600'
                      : 'text-neutral-300 hover:text-neutral-600 dark:hover:text-neutral-200'
                  }`}
                  title={l.label}
                >
                  <l.icon size={14} />
                  {galleryProfile?.gallery_layout === l.id && (
                    <motion.div
                      layoutId="activeLayoutTab"
                      className="absolute inset-0 border border-purple-500/20 bg-purple-500/5 rounded-sm"
                    />
                  )}
                  {isUpdatingLayout && galleryProfile?.gallery_layout === l.id && (
                    <div className="absolute inset-0 flex items-center justify-center bg-white/50 dark:bg-neutral-950/50">
                      <Loader2 size={10} className="animate-spin" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Gallery Content Area with Stable Transitions */}
        <div className="relative min-h-[400px]">
          <AnimatePresence mode="wait" initial={false}>
            {loading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center justify-center py-48"
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                  className="w-10 h-10 border-[0.5px] border-neutral-200 dark:border-neutral-800 border-t-purple-600 rounded-full"
                />
              </motion.div>
            ) : filteredArtworks.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-48"
              >
                <p className="text-neutral-400 dark:text-neutral-500 text-xs font-light uppercase tracking-[0.5em]">
                  Aucun média correspondant
                </p>
              </motion.div>
            ) : galleryProfile?.gallery_layout === 'masonry' ? (
              <motion.div
                key={`masonry-${filter}-${mediaFilter}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8 }}
              >
                <MasonryLayout
                  artworks={filteredArtworks}
                  onArtworkClick={setSelectedArtwork}
                  isOwner={isOwner}
                />
              </motion.div>
            ) : galleryProfile?.gallery_layout === 'editorial' ? (
              <motion.div
                key={`editorial-${filter}-${mediaFilter}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8 }}
              >
                <EditorialLayout
                  artworks={filteredArtworks}
                  onArtworkClick={setSelectedArtwork}
                  isOwner={isOwner}
                />
              </motion.div>
            ) : (
              <motion.div
                key={`grid-${filter}-${mediaFilter}`}
                variants={container}
                initial="hidden"
                animate="show"
                exit="hidden"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12"
              >
                <AnimatePresence mode="popLayout">
                  {filteredArtworks.map((artwork) => (
                    <motion.div
                      key={artwork.id}
                      variants={item}
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="w-full"
                    >
                      <GalleryArtworkCard
                        artwork={artwork}
                        onClick={() => setSelectedArtwork(artwork)}
                       isOwner={isOwner}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Upload Modal (Owner only) */}
      {isOwner && (
        <ArtworkUploadModal
          isOpen={showUploadModal}
          onClose={() => setShowUploadModal(false)}
          onSuccess={handleUploadSuccess}
        />
      )}

      {/* Audio Modal */}
      <AudioModal
        artwork={selectedArtwork!}
        isOpen={!!selectedArtwork && !!selectedArtwork.image_url.match(/\.(mp3|wav|ogg|m4a|aac)$/i)}
        onClose={() => {
          setSelectedArtwork(null)
        }}
        onDelete={isOwner && selectedArtwork ? async () => {
          await deleteArtwork(selectedArtwork.id)
          setSelectedArtwork(null)
        } : undefined}
        onUpdate={isOwner && selectedArtwork ? async (fields: Partial<Artwork>) => {
          await updateArtwork(selectedArtwork.id, fields)
        } : undefined}
        onUpdateCover={isOwner && selectedArtwork ? async (coverFile: File) => {
          await updateCoverImage(selectedArtwork.id, coverFile)
        } : undefined}
        isOwner={isOwner}
      />

      {/* Lightbox for images and videos */}
      <ArtworkLightbox
        artwork={selectedArtwork}
        isOpen={!!selectedArtwork && !selectedArtwork.image_url.match(/\.(mp3|wav|ogg|m4a|aac)$/i)}
        onClose={() => setSelectedArtwork(null)}
        onUpdate={isOwner && selectedArtwork ? async (id: string, fields: Partial<Artwork>) => {
          await updateArtwork(id, fields)
        } : undefined}
        onDelete={isOwner && selectedArtwork ? async (id: string) => {
          await deleteArtwork(id)
          setSelectedArtwork(null)
        } : undefined}
        isOwner={isOwner}
      />

      <ScrollToTop />
    </div>
  )
}