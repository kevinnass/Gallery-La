import { motion, AnimatePresence } from 'framer-motion'
import { X, Trash2, Eye, EyeOff, MoreVertical } from 'lucide-react'
import type { Artwork } from '@/hooks/useArtworks'

interface AudioModalProps {
  artwork: Artwork
  isOpen: boolean
  onClose: () => void
  onDelete?: () => void
  onTogglePublic?: () => void
  isOwner?: boolean
}

export const AudioModal = ({ 
  artwork, 
  isOpen, 
  onClose, 
  onDelete, 
  onTogglePublic,
  isOwner = false 
}: AudioModalProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-md z-50"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-2xl bg-white dark:bg-neutral-900 rounded-3xl shadow-2xl overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-neutral-200 dark:border-neutral-800">
                <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">
                  {artwork.title || 'Sans titre'}
                </h2>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-full transition-colors"
                >
                  <X className="w-6 h-6 text-neutral-600 dark:text-neutral-400" />
                </button>
              </div>

              {/* Audio Player - Exact Upload Modal Design */}
              <div className="p-8">
                <div className="w-full p-8 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl flex flex-col items-center justify-center">
                  <div className="text-6xl mb-4">🎵</div>
                  <p className="text-neutral-700 dark:text-neutral-300 font-medium mb-4 text-center">
                    {artwork.title || 'Sans titre'}
                  </p>
                  <audio 
                    src={artwork.image_url} 
                    controls 
                    controlsList="nodownload"
                    className="w-full max-w-md" 
                  />
                </div>

                {/* Description */}
                {artwork.description && (
                  <div className="mt-6">
                    <h3 className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                      Description
                    </h3>
                    <p className="text-neutral-600 dark:text-neutral-400">
                      {artwork.description}
                    </p>
                  </div>
                )}
              </div>

              {/* Actions (Owner only) */}
              {isOwner && (
                <div className="flex items-center justify-end gap-2 p-6 border-t border-neutral-200 dark:border-neutral-800">
                  {onTogglePublic && (
                    <button
                      onClick={onTogglePublic}
                      className="flex items-center gap-2 px-4 py-2 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
                    >
                      {artwork.is_public ? (
                        <>
                          <EyeOff className="w-4 h-4" />
                          Rendre privé
                        </>
                      ) : (
                        <>
                          <Eye className="w-4 h-4" />
                          Rendre public
                        </>
                      )}
                    </button>
                  )}
                  {onDelete && (
                    <button
                      onClick={onDelete}
                      className="flex items-center gap-2 px-4 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                      Supprimer
                    </button>
                  )}
                </div>
              )}
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}
