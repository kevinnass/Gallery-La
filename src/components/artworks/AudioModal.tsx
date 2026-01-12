import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Trash2, Eye, EyeOff, Globe, Lock, Edit2, Check } from 'lucide-react'
import type { Artwork } from '@/hooks/useArtworks'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { Input } from '@/components/ui/Input'

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
              className="fixed inset-0 bg-black/60 backdrop-blur-md z-[60]"
            />

            {/* Modal */}
            <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="relative w-full max-w-2xl bg-white dark:bg-neutral-900 rounded-3xl shadow-2xl overflow-hidden"
              >
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-neutral-200 dark:border-neutral-800">
                  <div className="flex items-center gap-3">
                    {/* Public/Private Status Badge (Top Left) */}
                    {localArtwork.is_public ? (
                      <div className="flex items-center gap-1.5 px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-xs font-medium">
                        <Globe className="w-3 h-3" />
                        <span>Public</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 px-3 py-1 bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 rounded-full text-xs font-medium">
                        <Lock className="w-3 h-3" />
                        <span>Privé</span>
                      </div>
                    )}
                  </div>
                  <button
                    onClick={onClose}
                    className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-full transition-colors"
                  >
                    <X className="w-6 h-6 text-neutral-600 dark:text-neutral-400" />
                  </button>
                </div>

                {/* Content */}
                <div className="p-8">
                  {/* Audio Player Card - Exact Upload Modal Design */}
                  <div className="relative w-full p-8 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl flex flex-col items-center justify-center mb-8">
                    
                    {/* Status Overlay Icon */}
                    <div className="absolute top-4 right-4">
                      {localArtwork.is_public ? (
                        <Globe className="w-6 h-6 text-purple-900/40 dark:text-purple-100/40" />
                      ) : (
                        <Lock className="w-6 h-6 text-purple-900/40 dark:text-purple-100/40" />
                      )}
                    </div>

                    {/* Cover Image or Default Icon */}
                    <div className="relative group mb-4">
                      {localArtwork.cover_image_url ? (
                        <div className="w-full max-w-md aspect-square rounded-xl overflow-hidden relative">
                          <img
                            src={localArtwork.cover_image_url}
                            alt={localArtwork.title || 'Audio cover'}
                            className="w-full h-full object-cover"
                          />
                          {isOwner && onUpdateCover && (
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <label className="cursor-pointer">
                                <span className="px-4 py-2 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white rounded-lg hover:opacity-90 transition-opacity inline-flex items-center gap-2">
                                  <Edit2 className="w-4 h-4" />
                                  Changer la cover
                                </span>
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={async (e) => {
                                    const file = e.target.files?.[0]
                                    if (file && file.type.startsWith('image/')) {
                                      setIsUpdating(true)
                                      try {
                                        await onUpdateCover(file)
                                        // Update local preview
                                        const reader = new FileReader()
                                        reader.onloadend = () => {
                                          setLocalArtwork(prev => prev ? {
                                            ...prev,
                                            cover_image_url: reader.result as string
                                          } : null)
                                        }
                                        reader.readAsDataURL(file)
                                      } finally {
                                        setIsUpdating(false)
                                      }
                                    }
                                  }}
                                  className="hidden"
                                  disabled={isUpdating}
                                />
                              </label>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="relative">
                          <div className="text-6xl mb-4">🎵</div>
                          {isOwner && onUpdateCover && (
                            <label className="absolute top-0 right-0 cursor-pointer">
                              <span className="px-3 py-1.5 bg-neutral-900 dark:bg-neutral-50 text-white dark:text-neutral-900 rounded-lg hover:opacity-90 transition-opacity inline-flex items-center gap-1.5 text-sm">
                                <Edit2 className="w-3 h-3" />
                                Ajouter cover
                              </span>
                              <input
                                type="file"
                                accept="image/*"
                                onChange={async (e) => {
                                  const file = e.target.files?.[0]
                                  if (file && file.type.startsWith('image/')) {
                                    setIsUpdating(true)
                                    try {
                                      await onUpdateCover(file)
                                      // Update local preview
                                      const reader = new FileReader()
                                      reader.onloadend = () => {
                                        setLocalArtwork(prev => prev ? {
                                          ...prev,
                                          cover_image_url: reader.result as string
                                        } : null)
                                      }
                                      reader.readAsDataURL(file)
                                    } finally {
                                      setIsUpdating(false)
                                    }
                                  }
                                }}
                                className="hidden"
                                disabled={isUpdating}
                              />
                            </label>
                          )}
                        </div>
                      )}
                    </div>
                    
                    
                    {/* Editable Title inside Card */}
                    {isEditingTitle ? (
                      <div className="flex items-center gap-2 mb-4 w-full max-w-md">
                        <Input
                          value={editedTitle}
                          onChange={(e) => setEditedTitle(e.target.value)}
                          className="bg-white/50 dark:bg-black/20 text-center font-medium border-transparent focus:bg-white dark:focus:bg-black/40"
                          placeholder="Titre de l'œuvre"
                          autoFocus
                        />
                        <button
                          onClick={handleSaveTitle}
                          disabled={isUpdating}
                          className="p-2 bg-purple-600 text-white rounded-full hover:bg-purple-700 disabled:opacity-50"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div 
                        onClick={() => isOwner && setIsEditingTitle(true)}
                        className={`group relative text-neutral-700 dark:text-neutral-300 font-medium mb-4 text-center ${isOwner ? 'cursor-pointer hover:bg-black/5 dark:hover:bg-white/10 px-4 py-1 rounded-lg transition-colors' : ''}`}
                      >
                        {localArtwork.title || 'Sans titre'}
                        {isOwner && (
                          <div className="absolute -right-6 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Edit2 className="w-3 h-3 text-neutral-400" />
                          </div>
                        )}
                      </div>
                    )}

                    {/* Audio Player */}
                    <div className="w-full max-w-md">
                      <audio 
                        src={localArtwork.image_url} 
                        controls 
                        controlsList="nodownload"
                        className="w-full"
                      />
                    </div>

                    {/* Artist Name Button */}
                    {artistName && onArtistClick && (
                      <motion.button
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        onClick={() => onArtistClick(artistName)}
                        className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium bg-purple-500 hover:bg-purple-600 text-white shadow-lg transition-colors"
                      >
                        👤 Voir la galerie de @{artistName}
                      </motion.button>
                    )}
                  </div>

                  {/* Editable Description */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h3  className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                        Description
                      </h3>
                      {isOwner && !isEditingDesc && (
                        <button
                          onClick={() => setIsEditingDesc(true)}
                          className="text-xs text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300 flex items-center gap-1"
                        >
                          <Edit2 className="w-3 h-3" />
                          Modifier
                        </button>
                      )}
                    </div>

                    {isEditingDesc ? (
                      <div className="relative">
                        <textarea
                          value={editedDesc}
                          onChange={(e) => setEditedDesc(e.target.value)}
                          className="w-full p-3 bg-neutral-50 dark:bg-neutral-800 rounded-xl border-none focus:ring-2 focus:ring-neutral-200 dark:focus:ring-neutral-700 min-h-[100px] resize-none"
                          placeholder="Ajouter une description..."
                          autoFocus
                        />
                        <div className="absolute bottom-3 right-3 flex gap-2">
                          <button
                            onClick={() => setIsEditingDesc(false)}
                            className="text-xs text-neutral-500 hover:text-neutral-700 px-3 py-1.5"
                          >
                            Annuler
                          </button>
                          <button
                            onClick={handleSaveDesc}
                            disabled={isUpdating}
                            className="bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 px-3 py-1.5 rounded-lg text-xs font-medium hover:opacity-90 disabled:opacity-50"
                          >
                            Enregistrer
                          </button>
                        </div>
                      </div>
                    ) : (
                      <p className="text-neutral-600 dark:text-neutral-400 text-sm leading-relaxed whitespace-pre-wrap">
                        {localArtwork.description || (isOwner ? "Aucune description. Cliquez pour en ajouter une." : "")}
                      </p>
                    )}
                  </div>
                </div>

                {/* Footer Controls (Owner only) */}
                {isOwner && (
                  <div className="flex items-center justify-between p-6 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/50">
                    <button
                      onClick={handleTogglePublic}
                      disabled={isUpdating}
                      className="flex items-center gap-2 px-4 py-2 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors text-sm font-medium disabled:opacity-50"
                    >
                      {localArtwork.is_public ? (
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

                    <button
                      onClick={() => setShowConfirmDelete(true)}
                      className="flex items-center gap-2 px-4 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors text-sm font-medium"
                    >
                      <Trash2 className="w-4 h-4" />
                      Supprimer
                    </button>
                  </div>
                )}
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showConfirmDelete}
        onClose={() => setShowConfirmDelete(false)}
        onConfirm={handleDelete}
        title="Supprimer l'œuvre ?"
        message="Cette action est irréversible. L'audio sera définitivement supprimé."
        confirmText="Supprimer"
        cancelText="Annuler"
        isLoading={isDeleting}
      />
    </>
  )
}
