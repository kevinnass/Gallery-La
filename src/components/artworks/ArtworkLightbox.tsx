import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Trash2, Eye, EyeOff, MoreVertical, FileText, Type } from 'lucide-react'
import type { Artwork } from '@/hooks/useArtworks'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'

interface ArtworkLightboxProps {
  artwork: Artwork | null
  isOpen: boolean
  onClose: () => void
  onUpdate: (id: string, data: Partial<Pick<Artwork, 'title' | 'description' | 'is_public'>>) => Promise<Artwork | void>
  onDelete: (id: string) => Promise<void>
  isOwner?: boolean
  artistName?: string
  onArtistClick?: (username: string) => void
}

export const ArtworkLightbox = ({
  artwork,
  isOpen,
  onClose,
  onUpdate,
  onDelete,
  isOwner = true,
  artistName,
  onArtistClick
}: ArtworkLightboxProps) => {
  const [localArtwork, setLocalArtwork] = useState<Artwork | null>(null)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [editingField, setEditingField] = useState<'title' | 'description' | null>(null)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  // Update local artwork when prop changes
  useEffect(() => {
    if (artwork) {
      setLocalArtwork(artwork)
      setTitle(artwork.title || '')
      setDescription(artwork.description || '')
    }
  }, [artwork])

  const handleSaveTitle = async () => {
    if (!localArtwork) return
    try {
      setIsLoading(true)
      const updated = await onUpdate(localArtwork.id, { title: title.trim() || undefined })
      if (updated) {
        setLocalArtwork(updated)
      }
      setEditingField(null)
    } catch (err) {
      console.error('Error updating title:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSaveDescription = async () => {
    if (!localArtwork) return
    try {
      setIsLoading(true)
      const updated = await onUpdate(localArtwork.id, { description: description.trim() || undefined })
      if (updated) {
        setLocalArtwork(updated)
      }
      setEditingField(null)
    } catch (err) {
      console.error('Error updating description:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleTogglePublic = async () => {
    if (!localArtwork) return
    try {
      setIsLoading(true)
      const updated = await onUpdate(localArtwork.id, { is_public: !localArtwork.is_public })
      if (updated) {
        setLocalArtwork(updated)
      }
      setIsMenuOpen(false)
    } catch (err) {
      console.error('Error toggling visibility:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!localArtwork) return
    try {
      setIsLoading(true)
      await onDelete(localArtwork.id)
      onClose()
    } catch (err) {
      console.error('Error deleting artwork:', err)
      setIsLoading(false)
    }
  }

  if (!localArtwork) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop with Blur */}
          <motion.div
            initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
            animate={{ opacity: 1, backdropFilter: 'blur(40px)' }}
            exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/20 z-50"
            onClick={onClose}
          />

          {/* Lightbox Container */}
          <div className="fixed inset-0 z-50 flex flex-col items-center justify-center p-8 gap-4" onClick={onClose}>
            <div className="relative" onClick={(e) => e.stopPropagation()}>
              
              {/* Top Bar - Close + Badge */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  {/* Public/Private Badge */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    <span
                      className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium backdrop-blur-2xl shadow-xl border ${
                        localArtwork.is_public
                          ? 'bg-emerald-500/90 text-white border-emerald-400/20'
                          : 'bg-neutral-800/90 dark:bg-neutral-200/90 text-white dark:text-neutral-900 border-neutral-700/20 dark:border-neutral-300/20'
                      }`}
                    >
                      {localArtwork.is_public ? '🌐 Public' : '🔒 Privé'}
                    </span>
                  </motion.div>

                  {/* Artist Name Button */}
                  {artistName && onArtistClick && (
                    <motion.button
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.15 }}
                      onClick={() => onArtistClick(artistName)}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium backdrop-blur-2xl shadow-xl border bg-purple-500/90 hover:bg-purple-600/90 text-white border-purple-400/20 transition-colors"
                    >
                      👤 @{artistName}
                    </motion.button>
                  )}
                </div>

                {/* Close Button */}
                <motion.button
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                  onClick={onClose}
                  className="w-10 h-10 bg-white/90 dark:bg-neutral-900/90 backdrop-blur-2xl rounded-full shadow-xl flex items-center justify-center hover:bg-white dark:hover:bg-neutral-900 transition-all border border-white/20 dark:border-neutral-700/20"
                >
                  <X className="w-5 h-5 text-neutral-900 dark:text-white" />
                </motion.button>
              </div>

              {/* Artwork */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="relative"
              >
                {localArtwork.image_url.match(/\.(mp4|webm|ogg|mov)$/i) ? (
                  // Video Player
                  <div className="relative bg-neutral-950 rounded-2xl overflow-hidden shadow-2xl">
                    <video
                      src={localArtwork.image_url}
                      controls
                      controlsList="nodownload"
                      className="max-h-[65vh] w-full rounded-2xl"
                      autoPlay={false}
                    />
                  </div>
                ) : localArtwork.image_url.match(/\.(mp3|wav|ogg|m4a|aac)$/i) ? (
                  // Audio Player - LARGE
                  <div className="w-full p-16 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20 rounded-3xl shadow-2xl flex flex-col items-center justify-center min-h-[500px]">
                    <div className="text-9xl mb-8">🎵</div>
                    <p className="text-neutral-700 dark:text-neutral-300 font-bold text-4xl mb-12 text-center px-8">{localArtwork.title || 'Sans titre'}</p>
                    <audio 
                      src={localArtwork.image_url} 
                      controls 
                      controlsList="nodownload"
                      className="w-full max-w-3xl h-16" 
                    />
                  </div>
                ) : (
                  // Image
                  <img
                    src={localArtwork.image_url}
                    alt={localArtwork.title || 'Sans titre'}
                    className="max-h-[65vh] max-w-full rounded-2xl shadow-2xl"
                  />
                )}
              </motion.div>

              {/* Bottom Bar - Title + Menu */}
              <div className="flex items-center justify-between gap-4 mt-4">
                {/* Title/Description Card */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="flex-1 bg-white/90 dark:bg-neutral-900/90 backdrop-blur-2xl rounded-2xl shadow-xl p-4 border border-white/20 dark:border-neutral-700/20"
                >
                  {editingField === 'title' ? (
                    <div className="space-y-3">
                      <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        autoFocus
                        className="w-full text-lg font-semibold bg-white/50 dark:bg-neutral-800/50 backdrop-blur-xl border-2 border-neutral-900 dark:border-neutral-50 rounded-xl px-3 py-2 text-neutral-900 dark:text-neutral-50 focus:outline-none"
                        placeholder="Titre"
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={handleSaveTitle}
                          disabled={isLoading}
                          className="flex-1 px-3 py-1.5 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
                        >
                          Valider
                        </button>
                        <button
                          onClick={() => {
                            setTitle(localArtwork.title || '')
                            setEditingField(null)
                          }}
                          disabled={isLoading}
                          className="flex-1 px-3 py-1.5 bg-neutral-200 dark:bg-neutral-700 text-neutral-900 dark:text-white rounded-lg text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
                        >
                          Annuler
                        </button>
                      </div>
                    </div>
                  ) : editingField === 'description' ? (
                    <div className="space-y-3">
                      <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        autoFocus
                        className="w-full p-3 bg-white/50 dark:bg-neutral-800/50 backdrop-blur-xl border-2 border-neutral-900 dark:border-neutral-50 rounded-xl text-neutral-900 dark:text-neutral-50 focus:outline-none resize-none"
                        rows={3}
                        placeholder="Description (optionnelle)"
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={handleSaveDescription}
                          disabled={isLoading}
                          className="flex-1 px-3 py-1.5 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
                        >
                          Valider
                        </button>
                        <button
                          onClick={() => {
                            setDescription(localArtwork.description || '')
                            setEditingField(null)
                          }}
                          disabled={isLoading}
                          className="flex-1 px-3 py-1.5 bg-neutral-200 dark:bg-neutral-700 text-neutral-900 dark:text-white rounded-lg text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
                        >
                          Annuler
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-50">
                        {localArtwork.title || 'Sans titre'}
                      </h2>
                      {localArtwork.description && (
                        <p className="text-neutral-700 dark:text-neutral-300 text-sm mt-1 line-clamp-2">
                          {localArtwork.description}
                        </p>
                      )}
                    </div>
                  )}
                </motion.div>

                {/* Edit Menu (Owner only) */}
                {isOwner && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="relative"
                  >
                    <AnimatePresence>
                      {isMenuOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.9 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.9 }}
                          className="absolute bottom-16 right-0 bg-white/95 dark:bg-neutral-900/95 backdrop-blur-2xl rounded-2xl shadow-2xl p-2 min-w-[220px] border border-white/20 dark:border-neutral-700/20"
                        >
                          <button
                            onClick={() => {
                              setEditingField('title')
                              setIsMenuOpen(false)
                            }}
                            className="w-full flex items-center gap-3 px-4 py-3 text-left text-neutral-700 dark:text-neutral-300 hover:bg-white/50 dark:hover:bg-neutral-800/50 rounded-xl transition-all"
                          >
                            <Type className="w-4 h-4" />
                            <span className="text-sm font-medium">Modifier le titre</span>
                          </button>
                          <button
                            onClick={() => {
                              setEditingField('description')
                              setIsMenuOpen(false)
                            }}
                            className="w-full flex items-center gap-3 px-4 py-3 text-left text-neutral-700 dark:text-neutral-300 hover:bg-white/50 dark:hover:bg-neutral-800/50 rounded-xl transition-all"
                          >
                            <FileText className="w-4 h-4" />
                            <span className="text-sm font-medium">Modifier la description</span>
                          </button>
                          <button
                            onClick={handleTogglePublic}
                            disabled={isLoading}
                            className="w-full flex items-center gap-3 px-4 py-3 text-left text-neutral-700 dark:text-neutral-300 hover:bg-white/50 dark:hover:bg-neutral-800/50 rounded-xl transition-all disabled:opacity-50"
                          >
                            {localArtwork.is_public ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            <span className="text-sm font-medium">
                              {localArtwork.is_public ? 'Rendre privé' : 'Rendre public'}
                            </span>
                          </button>
                          <div className="h-px bg-neutral-200/50 dark:bg-neutral-700/50 my-1" />
                          <button
                            onClick={() => {
                              setShowDeleteConfirm(true)
                              setIsMenuOpen(false)
                            }}
                            className="w-full flex items-center gap-3 px-4 py-3 text-left text-red-600 dark:text-red-400 hover:bg-red-50/50 dark:hover:bg-red-900/10 rounded-xl transition-all"
                          >
                            <Trash2 className="w-4 h-4" />
                            <span className="text-sm font-medium">Supprimer</span>
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <button
                      onClick={() => setIsMenuOpen(!isMenuOpen)}
                      className="w-12 h-12 bg-neutral-900/90 dark:bg-white/90 backdrop-blur-2xl text-white dark:text-neutral-900 rounded-full shadow-xl flex items-center justify-center hover:bg-neutral-900 dark:hover:bg-white transition-all border border-neutral-700/20 dark:border-white/20"
                    >
                      <MoreVertical className="w-5 h-5" />
                    </button>
                  </motion.div>
                )}
              </div>
            </div>
          </div>

          {/* Delete Confirmation Dialog */}
          <ConfirmDialog
            isOpen={showDeleteConfirm}
            onClose={() => setShowDeleteConfirm(false)}
            onConfirm={handleDelete}
            title="Supprimer l'œuvre"
            message="Êtes-vous sûr de vouloir supprimer cette œuvre ? Cette action est irréversible."
            confirmText="Supprimer"
            cancelText="Annuler"
            isLoading={isLoading}
          />
        </>
      )}
    </AnimatePresence>
  )
}
