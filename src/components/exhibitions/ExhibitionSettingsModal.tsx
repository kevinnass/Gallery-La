import { useState, useEffect } from 'react'
import { X, Loader2, LayoutGrid, Layout, Maximize2, Image as ImageIcon, Check } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useExhibitions, type ExhibitionWithArtworks } from '@/hooks/useExhibitions'

interface ExhibitionSettingsModalProps {
  exhibition: ExhibitionWithArtworks
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export const ExhibitionSettingsModal = ({ exhibition, isOpen, onClose, onSuccess }: ExhibitionSettingsModalProps) => {
  const { updateExhibition } = useExhibitions()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    is_public: false,
    layout: 'grid' as 'grid' | 'masonry' | 'editorial',
    cover_image_url: ''
  })

  useEffect(() => {
    if (isOpen && exhibition) {
      setFormData({
        title: exhibition.title,
        description: exhibition.description || '',
        is_public: exhibition.is_public,
        layout: exhibition.layout,
        cover_image_url: exhibition.cover_image_url || ''
      })
    }
  }, [isOpen, exhibition])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.title.trim()) return

    try {
      setLoading(true)
      await updateExhibition(exhibition.id, {
        title: formData.title.trim(),
        description: formData.description.trim() || null,
        is_public: formData.is_public,
        layout: formData.layout,
        cover_image_url: formData.cover_image_url || null
      })
      onSuccess()
      onClose()
    } catch (error) {
      console.error('Error updating exhibition settings:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-2xl bg-white dark:bg-neutral-900 rounded-sm shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
          >
            <div className="flex items-center justify-between p-6 border-b border-neutral-100 dark:border-neutral-800 shrink-0">
              <h2 className="text-[10px] uppercase tracking-[0.5em] font-medium text-neutral-900 dark:text-neutral-50">
                Paramètres de l'Exposition
              </h2>
              <button onClick={onClose} className="text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors">
                <X size={18} />
              </button>
            </div>

            <div className="overflow-y-auto p-8">
              <form onSubmit={handleSubmit} className="space-y-10">
                <div className="space-y-2">
                  <label className="text-[8px] uppercase tracking-[0.3em] text-neutral-400">Titre de l'exposition</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full bg-transparent border-b border-neutral-200 dark:border-neutral-800 py-2 text-xl font-light focus:outline-none focus:border-purple-600 transition-colors"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[8px] uppercase tracking-[0.3em] text-neutral-400">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    rows={3}
                    className="w-full bg-transparent border-b border-neutral-200 dark:border-neutral-800 py-2 text-sm font-light focus:outline-none focus:border-purple-600 transition-colors resize-none"
                  />
                </div>

                <div className="space-y-4">
                  <label className="text-[8px] uppercase tracking-[0.3em] text-neutral-400">Image de couverture</label>
                  {exhibition.artworks.length === 0 ? (
                    <div className="p-8 border-[0.5px] border-dashed border-neutral-200 dark:border-neutral-800 text-center">
                      <p className="text-[10px] uppercase tracking-widest text-neutral-400">Ajoutez des œuvres d'abord</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
                      {exhibition.artworks.map((artwork) => {
                        const isAudio = artwork.image_url.match(/\.(mp3|wav|ogg|m4a|aac)$/i)
                        // If audio, use cover_image_url as source if available
                        const thumbUrl = isAudio ? artwork.cover_image_url : artwork.image_url
                        
                        // Skip if no image source for this artwork
                        if (!thumbUrl) return null

                        const isSelected = formData.cover_image_url === thumbUrl

                        return (
                          <button
                            key={artwork.id}
                            type="button"
                            onClick={() => setFormData(prev => ({ ...prev, cover_image_url: thumbUrl }))}
                            className={`relative aspect-square rounded-sm overflow-hidden border-2 transition-all ${
                              isSelected ? 'border-purple-600 scale-105 shadow-lg z-10' : 'border-transparent hover:border-neutral-200'
                            }`}
                          >
                            <img src={thumbUrl} className="w-full h-full object-cover" />
                            {isSelected && (
                              <div className="absolute inset-0 bg-purple-600/20 flex items-center justify-center">
                                <Check size={16} className="text-white drop-shadow-md" />
                              </div>
                            )}
                          </button>
                        )
                      })}
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <label className="text-[8px] uppercase tracking-[0.3em] text-neutral-400">Style de présentation</label>
                  <div className="grid grid-cols-3 gap-4">
                    {[
                      { id: 'grid', label: 'Grille', icon: LayoutGrid },
                      { id: 'masonry', label: 'Masonry', icon: Maximize2 },
                      { id: 'editorial', label: 'Éditorial', icon: Layout }
                    ].map((style) => (
                      <button
                        key={style.id}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, layout: style.id as any }))}
                        className={`flex flex-col items-center gap-3 p-4 border transition-all duration-500 rounded-sm ${
                          formData.layout === style.id
                            ? 'border-purple-600 bg-purple-50/50 dark:bg-purple-900/10 text-purple-600'
                            : 'border-neutral-100 dark:border-neutral-800 text-neutral-400 hover:border-neutral-200'
                        }`}
                      >
                        <style.icon size={20} />
                        <span className="text-[8px] uppercase tracking-[0.2em]">{style.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between py-6 border-t border-neutral-50 dark:border-neutral-800/50">
                  <div className="space-y-1">
                    <p className="text-[10px] uppercase tracking-wider font-medium">Exposition Publique</p>
                    <p className="text-[10px] text-neutral-400">Rendre visible sur votre profil public</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, is_public: !prev.is_public }))}
                    className={`w-12 h-6 rounded-full transition-colors relative ${
                      formData.is_public ? 'bg-purple-600' : 'bg-neutral-200 dark:bg-neutral-800'
                    }`}
                  >
                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${
                      formData.is_public ? 'left-7' : 'left-1'
                    }`} />
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={loading || !formData.title.trim()}
                  className="w-full py-4 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-[10px] uppercase tracking-[0.4em] font-medium hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-3"
                >
                  {loading ? <Loader2 size={14} className="animate-spin" /> : 'Enregistrer les modifications'}
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
