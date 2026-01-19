import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Trash2, MoreVertical } from 'lucide-react'
import type { Artwork } from '@/hooks/useArtworks'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'

interface AudioModalProps {
  artwork: Artwork | null
  isOpen: boolean
  onClose: () => void
  onDelete?: () => Promise<void>
  onUpdate?: (updates: Partial<Artwork>) => Promise<void>
  onUpdateCover?: (coverFile: File) => Promise<void>
  isOwner?: boolean
  artistName?: string
  onArtistClick?: (username: string) => void
}

export const AudioModal = ({ 
  artwork, 
  isOpen, 
  onClose, 
  onDelete, 
  onUpdate,
  onUpdateCover,
  isOwner = false,
  artistName,
  onArtistClick
}: AudioModalProps) => {
  const [localArtwork, setLocalArtwork] = useState<Artwork | null>(artwork)
  const [isEditingTitle, setIsEditingTitle] = useState(false)
  const [isEditingDesc, setIsEditingDesc] = useState(false)
  const [editedTitle, setEditedTitle] = useState(artwork?.title || '')
  const [editedDesc, setEditedDesc] = useState(artwork?.description || '')
  const [showConfirmDelete, setShowConfirmDelete] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)

  useEffect(() => {
    if (artwork) {
      setLocalArtwork(artwork)
      setEditedTitle(artwork.title || '')
      setEditedDesc(artwork.description || '')
    }
  }, [artwork])

  if (!isOpen || !localArtwork) return null

  const handleSaveTitle = async () => {
    if (!onUpdate) return
    setIsUpdating(true)
    try {
      await onUpdate({ title: editedTitle })
      setLocalArtwork(prev => prev ? ({ ...prev, title: editedTitle }) : null)
      setIsEditingTitle(false)
    } catch (err) {
      console.error('Error saving title:', err)
    } finally {
      setIsUpdating(false)
    }
  }

  const handleSaveDesc = async () => {
    if (!onUpdate) return
    setIsUpdating(true)
    try {
      await onUpdate({ description: editedDesc })
      setLocalArtwork(prev => prev ? ({ ...prev, description: editedDesc }) : null)
      setIsEditingDesc(false)
    } catch (err) {
      console.error('Error saving description:', err)
    } finally {
      setIsUpdating(false)
    }
  }

  const handleTogglePublic = async () => {
    if (!onUpdate || !localArtwork) return
    setIsUpdating(true)
    try {
      const newStatus = !localArtwork.is_public
      await onUpdate({ is_public: newStatus })
      setLocalArtwork(prev => prev ? ({ ...prev, is_public: newStatus }) : null)
    } catch (err) {
      console.error('Error toggling visibility:', err)
    } finally {
      setIsUpdating(false)
    }
  }

  const handleDelete = async () => {
    if (!onDelete) return
    setIsDeleting(true)
    try {
      await onDelete()
      setShowConfirmDelete(false)
      onClose()
    } catch (err) {
      console.error('Error deleting audio:', err)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 bg-white/95 dark:bg-neutral-950/95 z-[60] backdrop-blur-xl transition-colors"
            />

            {/* Layout Wrapper */}
            <div className="fixed inset-0 z-[70] flex flex-col md:flex-row h-screen">
              
              {/* Close Button */}
              <motion.button
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={onClose}
                className="absolute top-8 right-8 z-[80] p-4 text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors"
                disabled={isUpdating || isDeleting}
              >
                <X size={24} />
              </motion.button>

              {/* Left Side: Audio Player Card (70%) */}
              <div className="flex-[7] relative flex items-center justify-center p-8 md:p-12 lg:p-24" onClick={onClose}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
                  className="relative z-10 w-full max-w-2xl bg-white dark:bg-neutral-950 p-8 md:p-12 shadow-[0_0_100px_rgba(0,0,0,0.05)] dark:shadow-[0_0_100px_rgba(0,0,0,0.2)]"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="absolute inset-2 border-[0.5px] border-neutral-100 dark:border-neutral-900 pointer-events-none" />

                  <div className="space-y-12">
                     {/* Cover Image Area */}
                    <div className="relative group mx-auto w-full aspect-square max-w-[400px] border-[0.5px] border-neutral-100 dark:border-neutral-900 p-4">
                       <div className="absolute inset-2 border-[0.5px] border-neutral-50 dark:border-neutral-900 pointer-events-none" />
                      
                      {localArtwork.cover_image_url ? (
                        <img
                          src={localArtwork.cover_image_url}
                          alt={localArtwork.title || ''}
                          className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity grayscale hover:grayscale-0 duration-700"
                        />
                      ) : (
                        <div className="w-full h-full bg-neutral-50 dark:bg-neutral-900/50 flex flex-col items-center justify-center space-y-4">
                          <span className="text-6xl opacity-20">🎵</span>
                          <span className="text-[10px] uppercase tracking-[0.5em] text-neutral-300">Aucune_Cover</span>
                        </div>
                      )}

                      {isOwner && onUpdateCover && (
                        <div className="absolute inset-0 bg-white/60 dark:bg-black/60 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center backdrop-blur-sm">
                           <label className="cursor-pointer">
                            <span className="px-6 py-2 border-[0.5px] border-neutral-900 dark:border-white text-[10px] uppercase tracking-widest font-medium hover:bg-neutral-900 hover:text-white dark:hover:bg-white dark:hover:text-neutral-950 transition-all">
                              {isUpdating ? 'Chargement...' : 'Télécharger une Cover'}
                            </span>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={async (e) => {
                                const file = e.target.files?.[0]
                                if (file) {
                                  setIsUpdating(true)
                                  await onUpdateCover(file)
                                  setIsUpdating(false)
                                }
                              }}
                              className="hidden"
                              disabled={isUpdating}
                            />
                          </label>
                        </div>
                      )}
                    </div>

                    {/* Simple Native Player Styled Minimalist */}
                    <div className="w-full max-w-[400px] mx-auto space-y-4">
                       <audio 
                        src={localArtwork.image_url} 
                        controls 
                        className="w-full opacity-60 hover:opacity-100 transition-opacity"
                      />
                      <div className="flex justify-between items-center px-1">
                        <span className="text-[8px] uppercase tracking-[0.4em] text-neutral-400">Flux_Audio</span>
                        <span className="text-[8px] uppercase tracking-[0.4em] text-neutral-400">Flux_Encodé</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Right Side: Metadata (30%) */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="flex-[3] bg-white dark:bg-neutral-950 border-l-[0.5px] border-neutral-100 dark:border-neutral-900 z-10 flex flex-col pt-32 p-12 overflow-y-auto"
              >
                 <div className="space-y-12">
                   {/* Header Stats */}

                    {/* Title and Description */}
                    <div className="space-y-6">
                      {isEditingTitle && isOwner ? (
                        <input
                          autoFocus
                          value={editedTitle}
                          onChange={(e) => setEditedTitle(e.target.value)}
                          onBlur={handleSaveTitle}
                          onKeyDown={(e) => e.key === 'Enter' && handleSaveTitle()}
                          className="w-full bg-transparent border-b border-purple-600 text-4xl font-display font-medium focus:outline-none"
                          disabled={isUpdating}
                        />
                      ) : (
                        <h2 
                          onClick={() => isOwner && setIsEditingTitle(true)}
                          className={`text-4xl md:text-5xl lg:text-6xl font-display font-medium text-neutral-900 dark:text-neutral-50 tracking-tight transition-colors ${isOwner ? 'hover:text-purple-600 cursor-text' : ''}`}
                        >
                          {localArtwork.title || 'Boucle_Sans_Titre'}
                        </h2>
                      )}

                      <div className="w-12 h-[1px] bg-purple-600/30" />

                      {isEditingDesc && isOwner ? (
                        <textarea
                          autoFocus
                          value={editedDesc}
                          onChange={(e) => setEditedDesc(e.target.value)}
                          onBlur={handleSaveDesc}
                          className="w-full bg-neutral-50 dark:bg-neutral-900/50 p-4 font-light text-lg leading-relaxed focus:outline-none border-[0.5px] border-neutral-200 dark:border-neutral-800 min-h-[150px]"
                          disabled={isUpdating}
                        />
                      ) : (
                        <p 
                          onClick={() => isOwner && setIsEditingDesc(true)}
                          className={`text-neutral-500 dark:text-neutral-400 font-light text-lg leading-relaxed whitespace-pre-wrap ${isOwner ? 'hover:bg-neutral-50/50 dark:hover:bg-neutral-900/50 cursor-text p-2 -m-2 transition-colors' : ''}`}
                        >
                          {localArtwork.description || (isOwner ? "Ajouter une description audio..." : "")}
                        </p>
                      )}
                    </div>



                    {/* Sidebar Links & Control */}
                    <div className="pt-12 border-t border-neutral-100 dark:border-neutral-900 space-y-8">
                       {artistName && (
                        <div className="space-y-1">
                          <span className="text-[9px] uppercase tracking-[0.4em] text-neutral-400">Compositeur / Artiste</span>
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
                        <div className="space-y-4 ">
                           <button 
                            onClick={handleTogglePublic}
                            disabled={isUpdating}
                            className="w-full group flex items-center hover:underline justify-between text-[10px] uppercase tracking-widest text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors disabled:opacity-50"
                          >
                             {localArtwork.is_public ? 'Rendre privé' : 'Rendre public'}
                             <div className="w-8 h-px bg-neutral-100 dark:bg-neutral-800 group-hover:w-12 transition-all" />
                          </button>
                          
                          <button 
                            onClick={() => setShowConfirmDelete(true)}
                            disabled={isUpdating || isDeleting}
                            className="w-full group flex items-center hover:underline justify-between text-[10px] uppercase tracking-widest text-red-400 hover:text-red-600 transition-colors disabled:opacity-50"
                          >
                             Supprimer
                             <Trash2 size={12} className="opacity-40" />
                          </button>
                        </div>
                      )}
                    </div>
                 </div>

                 <div className="mt-auto pt-20 flex justify-between items-center text-neutral-300 dark:text-neutral-700">
                    <span className="text-[9px] uppercase tracking-[0.5em]">Registre_Audio / La</span>
                    <span className="text-[9px] tracking-tighter">V.01-26</span>
                  </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>

      <ConfirmDialog
        isOpen={showConfirmDelete}
        onClose={() => setShowConfirmDelete(false)}
        onConfirm={handleDelete}
        title="Détruire le fichier audio ?"
        message="Ceci supprimera définitivement l'objet audio de l'archive numérique. Cette action est irréversible."
        confirmText="Confirmer la destruction"
        cancelText="Annuler"
        isLoading={isDeleting}
      />
    </>
  )
}
