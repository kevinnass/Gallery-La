import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Library, Search, SlidersHorizontal, User } from 'lucide-react'
import { useExhibitions } from '@/hooks/useExhibitions'
import { ScrollToTop } from '@/components/ui/ScrollToTop'

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.23, 1, 0.32, 1] as any
    }
  },
}

export const ExhibitionsPage = () => {
  const navigate = useNavigate()
  const { fetchAllPublicExhibitions, loading } = useExhibitions()
  const [exhibitions, setExhibitions] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    const loadExhibitions = async () => {
      const data = await fetchAllPublicExhibitions()
      setExhibitions(data)
    }
    loadExhibitions()
  }, [fetchAllPublicExhibitions])

  const filteredExhibitions = exhibitions.filter(ex => 
    ex.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ex.profiles?.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ex.profiles?.full_name?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-background dark:bg-neutral-950 pt-32 pb-20 selection:bg-purple-500/30">
      <div className="container mx-auto px-6 max-w-7xl">
        {/* Header */}
        <div className="mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-[10px] uppercase tracking-[0.5em] text-neutral-500 font-medium mb-4 block">
              Exploration
            </span>
            <h1 className="text-5xl md:text-7xl font-display font-medium text-neutral-900 dark:text-neutral-50 tracking-tight mb-6">
              Expositions
            </h1>
            <div className="w-12 h-[1px] bg-purple-600/30 mb-8" />
            <p className="text-neutral-500 dark:text-neutral-400 font-light text-lg max-w-xl leading-relaxed">
              Découvrez les sélections thématiques et les univers curatés par nos artistes.
            </p>
          </motion.div>
        </div>

        {/* Search & Filters */}
        <div className="mb-12 flex flex-col md:flex-row gap-6 items-center justify-between">
          <div className="relative max-w-md w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input
              type="text"
              placeholder="Rechercher une exposition, un artiste..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/50 dark:bg-neutral-900/50 border-[0.5px] border-neutral-200 dark:border-neutral-800 rounded-sm py-3 pl-12 pr-4 text-sm font-light focus:outline-none focus:border-purple-600/30 transition-colors placeholder:text-neutral-400"
            />
          </div>
          
          <div className="hidden md:flex items-center gap-4 text-[10px] uppercase tracking-[0.3em] text-neutral-400">
            <SlidersHorizontal size={14} />
            <span>Trier par date</span>
          </div>
        </div>

        {/* Exhibition Grid */}
        <AnimatePresence mode="wait">
          {loading ? (
            <div className="flex items-center justify-center py-48">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                className="w-8 h-8 border-[0.5px] border-neutral-200 dark:border-neutral-800 border-t-purple-600 rounded-full"
              />
            </div>
          ) : (
            <motion.div
              variants={container}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12"
            >
              {filteredExhibitions.map((exhibition) => (
                <motion.div
                  key={exhibition.id}
                  variants={item}
                  className="group cursor-pointer"
                  onClick={() => navigate(`/artists/${exhibition.profiles?.username}/exhibitions/${exhibition.id}`)}
                >
                  <div className="relative aspect-[16/9] overflow-hidden bg-neutral-100 dark:bg-neutral-900 mb-6 rounded-sm">
                    {exhibition.cover_image_url ? (
                      <img 
                        src={exhibition.cover_image_url} 
                        alt={exhibition.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center opacity-10">
                        <Library size={64} />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-500" />
                    
                    <div className="absolute top-4 left-4">
                      <div className="px-3 py-1 bg-white/10 backdrop-blur-md border border-white/20 rounded-full">
                         <span className="text-[8px] uppercase tracking-[0.2em] text-white">Public</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-neutral-400">
                      <User size={12} />
                      <span className="text-[10px] uppercase tracking-[0.2em]">
                        {exhibition.profiles?.username || 'Artiste'}
                      </span>
                    </div>
                    <h3 className="text-2xl font-display font-medium text-neutral-900 dark:text-neutral-50 tracking-tight group-hover:text-purple-600 transition-colors">
                      {exhibition.title}
                    </h3>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400 line-clamp-2 font-light leading-relaxed">
                      {exhibition.description || 'Une curation unique à découvrir.'}
                    </p>
                  </div>
                </motion.div>
              ))}
              
              {filteredExhibitions.length === 0 && (
                <div className="col-span-full py-48 text-center border-[0.5px] border-dashed border-neutral-200 dark:border-neutral-800">
                  <p className="text-neutral-400 text-xs uppercase tracking-[0.5em]">Aucune exposition trouvée</p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <ScrollToTop />
    </div>
  )
}
