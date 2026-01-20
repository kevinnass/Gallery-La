import { useState, useEffect } from 'react'
import { X, Loader2, Check, Plus, Search } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useExhibitions, type ExhibitionWithArtworks } from '@/hooks/useExhibitions'
import { useArtworks } from '@/hooks/useArtworks'

interface ExhibitionEditorModalProps {
  exhibition: ExhibitionWithArtworks
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export const ExhibitionEditorModal = ({ exhibition, isOpen, onClose, onSuccess }: ExhibitionEditorModalProps) => {
  const { artworks, fetchArtworksByUserId, loading: artworksLoading } = useArtworks()
  const { addArtworksToExhibition, removeArtworkFromExhibition } = useExhibitions()
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedIds, setSelectedIds] = useState<string[]>([])

  useEffect(() => {
    if (isOpen && exhibition) {
      setSelectedIds(exhibition.artworks.map(a => a.id))
      if (exhibition.user_id) {
        fetchArtworksByUserId(exhibition.user_id)
      }
    }
  }, [isOpen, exhibition, fetchArtworksByUserId])

  const handleToggleArtwork = async (artworkId: string) => {
    const isSelected = selectedIds.includes(artworkId)
    try {
      setLoading(true)
      if (isSelected) {
        await removeArtworkFromExhibition(exhibition.id, artworkId)
        setSelectedIds(prev => prev.filter(id => id !== artworkId))
      } else {
        await addArtworksToExhibition(exhibition.id, [artworkId])
        setSelectedIds(prev => [...prev, artworkId])
      }
    } catch (error) {
      console.error('Error toggling artwork in exhibition:', error)
    } finally {
      setLoading(false)
      onSuccess() // Refresh the detail page
    }
  }

  const filteredArtworks = artworks.filter(a => 
    a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (a.description?.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
          />
          
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="relative w-full max-w-4xl max-h-[90vh] bg-white dark:bg-neutral-900 rounded-sm shadow-2xl flex flex-col overflow-hidden"
          >
            <div className="p-6 border-b border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
              <div>
                <h2 className="text-[10px] uppercase tracking-[0.5em] font-medium text-neutral-900 dark:text-neutral-50 mb-1">
                  Ajouter des œuvres
                </h2>
                <p className="text-[10px] text-neutral-400 uppercase tracking-widest">{exhibition.title}</p>
              </div>
              <button onClick={onClose} className="text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="p-6 border-b border-neutral-100 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-950/50">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                <input
                  type="text"
                  placeholder="Rechercher une œuvre à ajouter..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent border border-neutral-200 dark:border-neutral-800 rounded-sm py-3 pl-12 pr-4 text-sm font-light focus:outline-none focus:border-purple-600/30 transition-colors"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-8">
              {artworksLoading ? (
                <div className="flex items-center justify-center py-20">
                  <Loader2 className="animate-spin text-purple-600" />
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {filteredArtworks.map((artwork) => {
                    const isSelected = selectedIds.includes(artwork.id)
                    const isAudio = artwork.image_url.match(/\.(mp3|wav|ogg|m4a|aac)$/i)
                    
                    return (
                      <button
                        key={artwork.id}
                        onClick={() => handleToggleArtwork(artwork.id)}
                        disabled={loading}
                        className={`group relative aspect-square transition-all duration-500 rounded-sm overflow-hidden border-2 ${
                          isSelected 
                            ? 'border-purple-600' 
                            : 'border-transparent hover:border-neutral-200 dark:hover:border-neutral-800'
                        }`}
                      >
                        {isAudio ? (
                           <div className="w-full h-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center">
                            {artwork.cover_image_url ? (
                              <img src={artwork.cover_image_url} className="w-full h-full object-cover opacity-60" />
                            ) : (
                              <div className="text-neutral-400 uppercase text-[8px] tracking-widest">Audio</div>
                            )}
                          </div>
                        ) : (
                          <img 
                            src={artwork.image_url} 
                            alt={artwork.title} 
                            className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 ${isSelected ? 'opacity-40' : 'opacity-100'}`} 
                          />
                        )}
                        
                        <div className={`absolute inset-0 flex items-center justify-center transition-colors ${isSelected ? 'bg-purple-600/20' : 'bg-black/0 group-hover:bg-black/20'}`}>
                          {isSelected ? (
                            <div className="bg-purple-600 text-white p-2 rounded-full shadow-lg">
                              <Check size={16} />
                            </div>
                          ) : (
                            <div className="bg-white/90 dark:bg-neutral-900/90 text-neutral-900 dark:text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                              <Plus size={16} />
                            </div>
                          )}
                        </div>
                        
                        <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/60 to-transparent">
                          <p className="text-[8px] text-white uppercase tracking-widest truncate">{artwork.title}</p>
                        </div>
                      </button>
                    )
                  })}
                </div>
              )}
            </div>
            
            <div className="p-6 border-t border-neutral-100 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 flex justify-between items-center">
               <p className="text-[10px] text-neutral-400 uppercase tracking-widest">
                {selectedIds.length} œuvre{selectedIds.length > 1 ? 's' : ''} sélectionnée{selectedIds.length > 1 ? 's' : ''}
              </p>
              <button 
                onClick={onClose}
                className="px-6 py-2 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-[10px] uppercase tracking-[0.3em] font-medium hover:opacity-90"
              >
                Terminer
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
