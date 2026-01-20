import { useState } from 'react'
import { X, Loader2, LayoutGrid, Layout, Maximize2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useExhibitions } from '@/hooks/useExhibitions'

interface CreateExhibitionModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export const CreateExhibitionModal = ({ isOpen, onClose, onSuccess }: CreateExhibitionModalProps) => {
  const { createExhibition } = useExhibitions()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    is_public: false,
    layout: 'grid' as 'grid' | 'masonry' | 'editorial'
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.title.trim()) return

    try {
      setLoading(true)
      await createExhibition({
        title: formData.title.trim(),
        description: formData.description.trim() || null,
        is_public: formData.is_public,
        layout: formData.layout
      })
      onSuccess()
      onClose()
      setFormData({ title: '', description: '', is_public: false, layout: 'grid' })
    } catch (error) {
      console.error('Error creating exhibition:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
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
            className="relative w-full max-w-lg bg-white dark:bg-neutral-900 rounded-sm shadow-2xl overflow-hidden"
          >
            <div className="flex items-center justify-between p-6 border-b border-neutral-100 dark:border-neutral-800">
              <h2 className="text-[10px] uppercase tracking-[0.5em] font-medium text-neutral-900 dark:text-neutral-50">
                Nouvelle Exposition
              </h2>
              <button onClick={onClose} className="text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-8">
              <div className="space-y-2">
                <label className="text-[8px] uppercase tracking-[0.3em] text-neutral-400">Titre de l'exposition'</label>
                <input
                  autoFocus
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Ex: Soleil d'Hiver"
                  className="w-full bg-transparent border-b border-neutral-200 dark:border-neutral-800 py-2 text-xl font-light focus:outline-none focus:border-purple-600 transition-colors placeholder:text-neutral-200 dark:placeholder:text-neutral-700"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[8px] uppercase tracking-[0.3em] text-neutral-400">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Racontez l'histoire derrière cette sélection..."
                  rows={3}
                  className="w-full bg-transparent border-b border-neutral-200 dark:border-neutral-800 py-2 text-sm font-light focus:outline-none focus:border-purple-600 transition-colors resize-none placeholder:text-neutral-200 dark:placeholder:text-neutral-700"
                />
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

              <div className="flex items-center justify-between py-4 border-t border-neutral-50 dark:border-neutral-800/50">
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
                {loading ? <Loader2 size={14} className="animate-spin" /> : 'Créer la collection'}
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
