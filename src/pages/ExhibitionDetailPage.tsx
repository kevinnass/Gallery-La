import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import { useExhibitions, type ExhibitionWithArtworks } from '@/hooks/useExhibitions'
import { useAuth } from '@/hooks/useAuth'
import { MasonryLayout } from '@/components/artworks/layouts/MasonryLayout'
import { EditorialLayout } from '@/components/artworks/layouts/EditorialLayout'
import { GalleryArtworkCard } from '@/components/artworks/GalleryArtworkCard'
import { ArtworkLightbox } from '@/components/artworks/ArtworkLightbox'
import { AudioModal } from '@/components/artworks/AudioModal'
import { ExhibitionEditorModal } from '@/components/exhibitions/ExhibitionEditorModal'
import { ExhibitionSettingsModal } from '@/components/exhibitions/ExhibitionSettingsModal'
import { ScrollToTop } from '@/components/ui/ScrollToTop'
import type { Artwork } from '@/hooks/useArtworks'

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

export const ExhibitionDetailPage = () => {
  const { exhibitionId } = useParams<{ username: string; exhibitionId: string }>()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { fetchExhibitionDetails, deleteExhibition, loading } = useExhibitions()
  const [exhibition, setExhibition] = useState<ExhibitionWithArtworks | null>(null)
  const [selectedArtwork, setSelectedArtwork] = useState<Artwork | null>(null)
  const [showEditor, setShowEditor] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const isOwner = user?.id === exhibition?.user_id

  useEffect(() => {
    const loadExhibition = async () => {
      if (!exhibitionId) return
      const data = await fetchExhibitionDetails(exhibitionId)
      if (!data) {
        navigate('/404')
        return
      }
      setExhibition(data)
    }
    loadExhibition()
  }, [exhibitionId, fetchExhibitionDetails, navigate])

  const handleDelete = async () => {
    if (!exhibition || !window.confirm('Êtes-vous sûr de vouloir supprimer cette exposition ?')) return
    try {
      setIsDeleting(true)
      await deleteExhibition(exhibition.id)
      navigate(-1)
    } catch (error) {
      console.error('Error deleting exhibition:', error)
    } finally {
      setIsDeleting(false)
    }
  }

  const handleRefresh = async () => {
    if (exhibitionId) {
      const data = await fetchExhibitionDetails(exhibitionId)
      if (data) setExhibition(data)
    }
  }

  if (loading || !exhibition) {
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
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors mb-12 text-[10px] uppercase tracking-[0.3em]"
        >
          <ArrowLeft className="w-3 h-3" />
          Retour à la galerie
        </button>

        <div className="mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <span className="text-[10px] uppercase tracking-[0.5em] text-purple-600 font-medium mb-4 block">
              Exposition 
            </span>
            <h1 className="text-5xl md:text-7xl font-display font-medium text-neutral-900 dark:text-neutral-50 tracking-tight mb-6">
              {exhibition.title}
            </h1>
            <div className="w-12 h-[1px] bg-purple-600/30 mx-auto mb-8" />
            
            {isOwner && (
              <div className="flex items-center justify-center gap-4 mb-12">
                <button
                  onClick={() => setShowEditor(true)}
                  className="px-6 py-2 border border-neutral-200 dark:border-neutral-800 text-[10px] uppercase tracking-[0.3em] hover:border-purple-600 transition-all font-medium"
                >
                  Ajouter des œuvres
                </button>
                <button
                  onClick={() => setShowSettings(true)}
                  className="px-6 py-2 border border-neutral-200 dark:border-neutral-800 text-[10px] uppercase tracking-[0.3em] hover:border-purple-600 transition-all font-medium"
                >
                  Paramètres
                </button>
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="px-6 py-2 text-red-500 hover:bg-neutral-50 dark:hover:bg-neutral-900/10 text-[10px] uppercase tracking-[0.3em] transition-all disabled:opacity-50"
                >
                  {isDeleting ? 'Suppression...' : 'Supprimer'}
                </button>
              </div>
            )}

            <p className="text-neutral-500 dark:text-neutral-400 font-light text-lg max-w-2xl mx-auto leading-relaxed">
              {exhibition.description || 'Une exploration thématique à travers les œuvres.'}
            </p>
          </motion.div>
        </div>

        <div className="relative min-h-[400px]">
          {exhibition.artworks.length === 0 ? (
            <div className="text-center py-48">
              <p className="text-neutral-400 text-xs uppercase tracking-[0.5em]">L'exposition est vide</p>
            </div>
          ) : exhibition.layout === 'masonry' ? (
            <MasonryLayout
              artworks={exhibition.artworks}
              onArtworkClick={setSelectedArtwork as any}
              isOwner={isOwner}
            />
          ) : exhibition.layout === 'editorial' ? (
            <EditorialLayout
              artworks={exhibition.artworks}
              onArtworkClick={setSelectedArtwork as any}
              isOwner={isOwner}
            />
          ) : (
            <motion.div
              variants={container}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12"
            >
              {exhibition.artworks.map((artwork) => (
                <motion.div key={artwork.id} variants={item} className="w-full">
                  <GalleryArtworkCard
                    artwork={artwork}
                    onClick={() => setSelectedArtwork(artwork)}
                    isOwner={isOwner}
                  />
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </div>

      {/* Detail Modals */}
      <AudioModal
        artwork={selectedArtwork!}
        isOpen={!!selectedArtwork && !!selectedArtwork.image_url.match(/\.(mp3|wav|ogg|m4a|aac)$/i)}
        onClose={() => setSelectedArtwork(null)}
        isOwner={false} // Disable management from detail page for now
      />

      <ArtworkLightbox
        artwork={selectedArtwork}
        isOpen={!!selectedArtwork && !selectedArtwork.image_url.match(/\.(mp3|wav|ogg|m4a|aac)$/i)}
        onClose={() => setSelectedArtwork(null)}
        isOwner={false}
      />

      <ScrollToTop />

      {exhibition && (
        <ExhibitionEditorModal
          exhibition={exhibition}
          isOpen={showEditor}
          onClose={() => setShowEditor(false)}
          onSuccess={handleRefresh}
        />
      )}

      {exhibition && (
        <ExhibitionSettingsModal
          exhibition={exhibition}
          isOpen={showSettings}
          onClose={() => setShowSettings(false)}
          onSuccess={handleRefresh}
        />
      )}
    </div>
  )
}
