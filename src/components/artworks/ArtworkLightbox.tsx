import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Trash2, Eye, EyeOff, MoreVertical } from 'lucide-react'
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
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-white/95 dark:bg-neutral-950/95 z-50 transition-colors backdrop-blur-xl"
            onClick={onClose}
          />

          <div className="fixed inset-0 z-50 flex flex-col md:flex-row h-screen">
            {/* Close Button - Floats Top Right */}
            <motion.button
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={onClose}
              className="absolute top-8 right-8 z-[60] p-4 text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors"
            >
              <X size={24} />
            </motion.button>

            {/* Left: Media Area (70%) */}
            <div className="flex-[7] relative flex items-center justify-center p-8 md:p-12 lg:p-20 overflow-hidden" onClick={onClose}>
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
                className="relative z-10 max-h-full max-w-full flex items-center justify-center p-4 bg-white dark:bg-neutral-950 shadow-[0_0_100px_rgba(0,0,0,0.05)] dark:shadow-[0_0_100px_rgba(0,0,0,0.2)]"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Thin Inner Border Mimicking the Card */}
                <div className="absolute inset-2 border-[0.5px] border-neutral-100 dark:border-neutral-900 pointer-events-none" />

                {localArtwork.image_url.match(/\.(mp4|webm|ogg|mov)$/i) ? (
                  <video
                    src={localArtwork.image_url}
                    controls
                    controlsList="nodownload"
                    className="max-h-[80vh] w-auto block"
                    autoPlay
                  />
                ) : (
                  <img
                    src={localArtwork.image_url}
                    alt={localArtwork.title || ''}
                    className="max-h-[80vh] w-auto block object-contain"
                  />
                )}
              </motion.div>
            </div>

            {/* Right: Info Area (30%) */}
            <motion.div 
               initial={{ opacity: 0, x: 20 }}
               animate={{ opacity: 1, x: 0 }}
               exit={{ opacity: 0, x: 20 }}
               className="flex-[3] bg-white dark:bg-neutral-950 border-l-[0.5px] border-neutral-100 dark:border-neutral-900 z-10 flex flex-col pt-32 p-12 overflow-y-auto"
            >
              <div className="space-y-12">

                {/* Title and Description */}
                <div className="space-y-6">
                  {editingField === 'title' && isOwner ? (
                    <div className="space-y-4">
                      <input
                        autoFocus
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        onBlur={handleSaveTitle}
                        onKeyDown={(e) => e.key === 'Enter' && handleSaveTitle()}
                        className="w-full bg-transparent border-b border-purple-600 text-4xl font-display font-medium focus:outline-none"
                      />
                    </div>
                  ) : (
                    <h2 
                      onClick={() => isOwner && setEditingField('title')}
                      className={`text-4xl md:text-5xl lg:text-6xl font-display font-medium text-neutral-900 dark:text-neutral-50 tracking-tight transition-colors ${isOwner ? 'hover:text-purple-600 cursor-text' : ''}`}
                    >
                      {localArtwork.title || 'Sans titre'}
                    </h2>
                  )}

                  <div className="w-12 h-[1px] bg-purple-600/30" />

                  {editingField === 'description' && isOwner ? (
                    <textarea
                      autoFocus
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      onBlur={handleSaveDescription}
                      className="w-full bg-neutral-50 dark:bg-neutral-900/50 p-4 font-light text-lg leading-relaxed focus:outline-none border-[0.5px] border-neutral-200 dark:border-neutral-800 min-h-[150px]"
                    />
                  ) : (
                    <p 
                      onClick={() => isOwner && setEditingField('description')}
                      className={`text-neutral-500 dark:text-neutral-400 font-light text-lg leading-relaxed whitespace-pre-wrap ${isOwner ? 'hover:bg-neutral-50/50 dark:hover:bg-neutral-900/50 cursor-text p-2 -m-2 transition-colors' : ''}`}
                    >
                      {localArtwork.description || (isOwner ? "Aucune description fournie. Cliquez pour en ajouter une." : "")}
                    </p>
                  )}
                </div>

                {/* Technical Details Sidebar */}
                <div className="pt-12 border-t border-neutral-100 dark:border-neutral-900 space-y-8">
                   {artistName && (
                    <div className="space-y-1">
                      <span className="text-[9px] uppercase tracking-[0.4em] text-neutral-400">Provenance / Artiste</span>
                      <p 
                        onClick={() => onArtistClick?.(artistName)}
                        className="text-sm font-medium hover:text-purple-600 cursor-pointer transition-colors"
                      >
                         @{artistName}
                      </p>
                    </div>
                  )}
                  
                  <div className="space-y-1">
                    <span className="text-[9px] uppercase tracking-[0.4em] text-neutral-400">Accès</span>
                    <div className="flex items-center gap-2">
                      <div className={`w-1.5 h-1.5 rounded-full ${localArtwork.is_public ? 'bg-emerald-500' : 'bg-neutral-300'}`} />
                      <p className="text-sm font-medium uppercase tracking-widest text-neutral-600 dark:text-neutral-400">
                        {localArtwork.is_public ? 'Publique' : 'Privée'}
                      </p>
                    </div>
                  </div>

                  {isOwner && (
                    <div className="space-y-4 pt-12">
                      <button 
                        onClick={handleTogglePublic}
                        disabled={isLoading}
                        className="w-full group flex items-center hover:underline justify-between text-[10px] uppercase tracking-widest text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors disabled:opacity-50"
                      >
                        {localArtwork.is_public ? 'Rendre privé' : 'Rendre public'}
                        <div className="w-8 h-px bg-neutral-100 dark:bg-neutral-800 group-hover:w-12 transition-all" />
                      </button>
                      
                      <button 
                        onClick={() => setShowDeleteConfirm(true)}
                        disabled={isLoading}
                        className="w-full group flex items-center hover:underline justify-between text-[10px] uppercase tracking-widest text-red-400 hover:text-red-600 transition-colors disabled:opacity-50"
                      >
                        Supprimer
                        <Trash2 size={12} className="opacity-40" />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Museum Signature Bottom */}
              <div className="mt-auto pt-20 flex justify-between items-center text-neutral-300 dark:text-neutral-700">
                <span className="text-[9px] uppercase tracking-[0.5em]">Registre Gallery-La</span>
                <span className="text-[9px] tracking-tighter">© 2026</span>
              </div>
            </motion.div>
          </div>

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
