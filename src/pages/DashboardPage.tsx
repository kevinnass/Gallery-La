import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Image as ImageIcon, Eye, Lock, Sparkles } from 'lucide-react'
import { useArtworks, type Artwork } from '@/hooks/useArtworks'
import { ArtworkUploadModal } from '@/components/artworks/ArtworkUploadModal'
import { ArtworkCard } from '@/components/artworks/ArtworkCard'
import { ArtworkLightbox } from '@/components/artworks/ArtworkLightbox'
import { Button } from '@/components/ui/Button'

export const DashboardPage = () => {
  const { artworks, loading, updateArtwork, deleteArtwork, refetch } = useArtworks()
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [selectedArtwork, setSelectedArtwork] = useState<Artwork | null>(null)

  const publicCount = artworks.filter((a) => a.is_public).length
  const privateCount = artworks.length - publicCount

  const handleUploadSuccess = () => {
    refetch() // Refresh the gallery
    setShowUploadModal(false)
  }

  return (
    <div className="min-h-screen relative bg-background dark:bg-neutral-950 pt-32 pb-20 overflow-hidden">
      {/* Premium Background with Texture */}
      <div className="absolute inset-0 bg-gradient-to-br from-neutral-50 via-amber-50/30 to-neutral-100 dark:from-neutral-950 dark:via-amber-950/10 dark:to-neutral-900" />
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnoiIHN0cm9rZT0iIzAwMCIgc3Ryb2tlLW9wYWNpdHk9Ii4wMiIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9nPjwvc3ZnPg==')] opacity-40 dark:opacity-20" />
      
      <div className="container mx-auto px-4 max-w-7xl relative z-10">
        {/* Elegant Header */}
        <div className="flex items-center justify-between mb-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-3 mb-2">
              <Sparkles className="w-8 h-8 text-amber-600 dark:text-amber-400" />
              <h1 className="text-5xl font-light text-neutral-900 dark:text-neutral-50 tracking-tight">
                Ma Galerie
              </h1>
            </div>
            <p className="text-neutral-500 dark:text-neutral-400 text-lg font-light ml-11">
              Collection personnelle d'œuvres d'art
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Button
              onClick={() => setShowUploadModal(true)}
              className="flex items-center gap-2 px-6 py-3 text-base shadow-lg hover:shadow-xl transition-shadow"
            >
              <Plus className="w-5 h-5" />
              Nouvelle œuvre
            </Button>
          </motion.div>
        </div>

        {/* Refined Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="group relative bg-white/60 dark:bg-neutral-900/60 backdrop-blur-xl rounded-2xl border border-neutral-200/50 dark:border-neutral-800/50 p-6 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-neutral-50/50 to-transparent dark:from-neutral-800/30 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-3 bg-gradient-to-br from-neutral-100 to-neutral-200 dark:from-neutral-800 dark:to-neutral-700 rounded-xl shadow-inner">
                  <ImageIcon className="w-6 h-6 text-neutral-700 dark:text-neutral-300" />
                </div>
                <h3 className="text-sm font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                  Total
                </h3>
              </div>
              <p className="text-4xl font-light text-neutral-900 dark:text-neutral-50 tabular-nums">
                {artworks.length}
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="group relative bg-white/60 dark:bg-neutral-900/60 backdrop-blur-xl rounded-2xl border border-emerald-200/50 dark:border-emerald-800/30 p-6 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/50 to-transparent dark:from-emerald-900/20 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-3 bg-gradient-to-br from-emerald-100 to-emerald-200 dark:from-emerald-900/40 dark:to-emerald-800/40 rounded-xl shadow-inner">
                  <Eye className="w-6 h-6 text-emerald-700 dark:text-emerald-400" />
                </div>
                <h3 className="text-sm font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                  Publiques
                </h3>
              </div>
              <p className="text-4xl font-light text-emerald-700 dark:text-emerald-400 tabular-nums">
                {publicCount}
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="group relative bg-white/60 dark:bg-neutral-900/60 backdrop-blur-xl rounded-2xl border border-neutral-200/50 dark:border-neutral-800/50 p-6 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-neutral-50/50 to-transparent dark:from-neutral-800/30 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-3 bg-gradient-to-br from-neutral-100 to-neutral-200 dark:from-neutral-800 dark:to-neutral-700 rounded-xl shadow-inner">
                  <Lock className="w-6 h-6 text-neutral-700 dark:text-neutral-300" />
                </div>
                <h3 className="text-sm font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                  Privées
                </h3>
              </div>
              <p className="text-4xl font-light text-neutral-900 dark:text-neutral-50 tabular-nums">
                {privateCount}
              </p>
            </div>
          </motion.div>
        </div>

        {/* Gallery Wall */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-amber-200 dark:border-amber-800 border-t-amber-600 dark:border-t-amber-400 rounded-full animate-spin" />
              <Sparkles className="absolute inset-0 m-auto w-6 h-6 text-amber-600 dark:text-amber-400 animate-pulse" />
            </div>
            <p className="mt-6 text-neutral-500 dark:text-neutral-400 font-light">Chargement de votre collection...</p>
          </div>
        ) : artworks.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center py-24 bg-white/40 dark:bg-neutral-900/40 backdrop-blur-xl rounded-3xl border-2 border-dashed border-neutral-300 dark:border-neutral-700"
          >
            <div className="w-32 h-32 bg-gradient-to-br from-amber-100 to-amber-200 dark:from-amber-900/30 dark:to-amber-800/30 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
              <ImageIcon className="w-16 h-16 text-amber-700 dark:text-amber-400" />
            </div>
            <h3 className="text-3xl font-light text-neutral-900 dark:text-neutral-50 mb-3">
              Votre galerie attend sa première œuvre
            </h3>
            <p className="text-neutral-500 dark:text-neutral-400 mb-8 text-lg font-light max-w-md mx-auto">
              Commencez votre collection et partagez votre art avec le monde
            </p>
            <Button
              onClick={() => setShowUploadModal(true)}
              className="flex items-center gap-2 mx-auto px-8 py-4 text-lg shadow-xl"
            >
              <Plus className="w-5 h-5" />
              Ajouter ma première œuvre
            </Button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12 md:gap-16">
            <AnimatePresence mode="popLayout">
              {artworks.map((artwork, index) => (
                <motion.div
                  key={artwork.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ 
                    delay: index * 0.08,
                    duration: 0.5,
                    ease: [0.4, 0, 0.2, 1]
                  }}
                >
                  <ArtworkCard
                    artwork={artwork}
                    onClick={() => setSelectedArtwork(artwork)}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Upload Modal */}
      <ArtworkUploadModal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        onSuccess={handleUploadSuccess}
      />

      {/* Lightbox */}
      <ArtworkLightbox
        artwork={selectedArtwork}
        isOpen={!!selectedArtwork}
        onClose={() => setSelectedArtwork(null)}
        onUpdate={updateArtwork}
        onDelete={deleteArtwork}
      />
    </div>
  )
}
