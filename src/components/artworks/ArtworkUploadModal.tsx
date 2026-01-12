import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Upload, Loader2 } from 'lucide-react'
import { useArtworks } from '@/hooks/useArtworks'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

interface ArtworkUploadModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
}

export const ArtworkUploadModal = ({ isOpen, onClose, onSuccess }: ArtworkUploadModalProps) => {
  const { uploadArtwork } = useArtworks()
  
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [coverImage, setCoverImage] = useState<File | null>(null)
  const [coverPreview, setCoverPreview] = useState<string | null>(null)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [isPublic, setIsPublic] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const droppedFile = e.dataTransfer.files[0]
    if (droppedFile && (droppedFile.type.startsWith('image/') || droppedFile.type.startsWith('video/') || droppedFile.type.startsWith('audio/'))) {
      handleFileSelect(droppedFile)
    } else {
      setError('Veuillez sélectionner un fichier média valide (image, vidéo ou audio)')
    }
  }, [])

  const handleFileSelect = (selectedFile: File) => {
    // Validate file type
    const isImage = selectedFile.type.startsWith('image/')
    const isVideo = selectedFile.type.startsWith('video/')
    const isAudio = selectedFile.type.startsWith('audio/')
    
    if (!isImage && !isVideo && !isAudio) {
      setError('Veuillez sélectionner un fichier média valide (image, vidéo ou audio)')
      return
    }

    setFile(selectedFile)
    setError(null)

    // Create preview for all media types
    if (isImage) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result as string)
      }
      reader.readAsDataURL(selectedFile)
    } else if (isVideo || isAudio) {
      const mediaURL = URL.createObjectURL(selectedFile)
      setPreview(mediaURL)
    }
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      handleFileSelect(selectedFile)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!file) {
      setError('Veuillez sélectionner un fichier')
      return
    }

    try {
      setIsSubmitting(true)
      setError(null)
      
      await uploadArtwork({
        file,
        coverImage: coverImage || undefined,
        title: title.trim() || undefined,
        description: description.trim() || undefined,
        is_public: isPublic,
      })

      // Reset form
      setFile(null)
      setPreview(null)
      setTitle('')
      setDescription('')
      setIsPublic(false)

      onSuccess?.()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    if (!isSubmitting) {
      setFile(null)
      setPreview(null)
      setTitle('')
      setDescription('')
      setIsPublic(false)
      setError(null)
      onClose()
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={handleClose}
          />

          {/* Modal */}
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2 }}
              className="bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl max-w-2xl w-full p-6 border border-neutral-200 dark:border-neutral-800 max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-light text-neutral-900 dark:text-neutral-50">
                  Ajouter une œuvre
                </h2>
                <button
                  onClick={handleClose}
                  disabled={isSubmitting}
                  className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* File Upload Area */}
                {!preview ? (
                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={`border-2 border-dashed rounded-xl p-12 text-center transition-colors ${
                      isDragging
                        ? 'border-neutral-900 dark:border-neutral-50 bg-neutral-50 dark:bg-neutral-800'
                        : 'border-neutral-300 dark:border-neutral-700'
                    }`}
                  >
                    <Upload className="w-12 h-12 mx-auto mb-4 text-neutral-400" />
                    <p className="text-neutral-600 dark:text-neutral-400 mb-2">
                      Glissez-déposez un fichier ici
                    </p>
                    <p className="text-sm text-neutral-400 mb-4">ou</p>
                    <label className="cursor-pointer">
                      <span className="px-4 py-2 bg-neutral-900 dark:bg-neutral-50 text-white dark:text-neutral-900 rounded-lg hover:opacity-90 transition-opacity inline-block">
                        Parcourir
                      </span>
                      <input
                        type="file"
                        accept="image/*,video/*,audio/*"
                        onChange={handleFileInputChange}
                        className="hidden"
                      />
                    </label>
                    <p className="text-xs text-neutral-400 mt-4">
                      Images, Vidéos, Audio (toutes tailles acceptées)
                    </p>
                  </div>
                ) : (
                  <div className="relative">
                    {file?.type.startsWith('image/') && preview ? (
                      <img
                        src={preview}
                        alt="Preview"
                        className="w-full h-64 object-cover rounded-xl"
                      />
                    ) : file?.type.startsWith('video/') && preview ? (
                      <video
                        src={preview}
                        controls
                        controlsList="nodownload"
                        className="w-full h-64 rounded-xl bg-black"
                      />
                    ) : file?.type.startsWith('audio/') && preview ? (
                      <div className="space-y-4">
                        {/* Cover Image Upload Section */}
                        <div className="relative">
                          {coverPreview ? (
                            <div className="relative w-full aspect-square rounded-xl overflow-hidden">
                              <img
                                src={coverPreview}
                                alt="Cover"
                                className="w-full h-full object-cover"
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  setCoverImage(null)
                                  setCoverPreview(null)
                                }}
                                className="absolute top-2 right-2 p-2 bg-black/50 hover:bg-black/70 rounded-lg text-white transition-colors"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          ) : (
                            <div className="w-full aspect-square bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 dark:from-indigo-900/20 dark:via-purple-900/20 dark:to-pink-900/20 rounded-xl flex flex-col items-center justify-center border-2 border-dashed border-neutral-300 dark:border-neutral-700 hover:border-neutral-400 dark:hover:border-neutral-600 transition-colors">
                              <div className="text-7xl mb-4">🎵</div>
                              <p className="text-neutral-700 dark:text-neutral-300 font-medium mb-4 text-center px-4">
                                {file.name}
                              </p>
                              <label className="cursor-pointer">
                                <span className="px-4 py-2 bg-neutral-900 dark:bg-neutral-50 text-white dark:text-neutral-900 rounded-lg hover:opacity-90 transition-opacity inline-block text-sm">
                                  Ajouter une cover
                                </span>
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={(e) => {
                                    const coverFile = e.target.files?.[0]
                                    if (coverFile && coverFile.type.startsWith('image/')) {
                                      setCoverImage(coverFile)
                                      const reader = new FileReader()
                                      reader.onloadend = () => {
                                        setCoverPreview(reader.result as string)
                                      }
                                      reader.readAsDataURL(coverFile)
                                    }
                                  }}
                                  className="hidden"
                                />
                              </label>
                              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-2">
                                Optionnel - Image pour représenter l'audio
                              </p>
                            </div>
                          )}
                        </div>
                        
                        {/* Audio Player */}
                        <div className="w-full p-6 bg-neutral-50 dark:bg-neutral-800/50 rounded-xl">
                          <audio src={preview} controls controlsList="nodownload" className="w-full" />
                        </div>
                      </div>
                    ) : null}
                    <button
                      type="button"
                      onClick={() => {
                        setFile(null)
                        setPreview(null)
                      }}
                      className="absolute top-2 right-2 p-2 bg-black/50 hover:bg-black/70 rounded-lg text-white transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}

                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                    Titre
                  </label>
                  <Input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Sans titre"
                    maxLength={100}
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                    Description
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Décrivez votre œuvre..."
                    rows={3}
                    maxLength={500}
                    className="w-full px-4 py-2.5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-50 focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-neutral-50 resize-none"
                  />
                  <p className="text-xs text-neutral-400 mt-1">{description.length}/500</p>
                </div>

                {/* Public Toggle */}
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="is-public"
                    checked={isPublic}
                    onChange={(e) => setIsPublic(e.target.checked)}
                    className="w-4 h-4 rounded border-neutral-300 dark:border-neutral-700"
                  />
                  <label htmlFor="is-public" className="text-sm text-neutral-700 dark:text-neutral-300">
                    Rendre cette œuvre publique
                  </label>
                </div>

                {/* Error Message */}
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3 rounded-lg bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800"
                  >
                    <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                  </motion.div>
                )}

                {/* Submit Button */}
                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleClose}
                    disabled={isSubmitting}
                    className="flex-1"
                  >
                    Annuler
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1"
                    disabled={isSubmitting || !file}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Upload...
                      </>
                    ) : (
                      'Publier'
                    )}
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}
