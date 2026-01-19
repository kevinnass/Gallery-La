import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Hero } from '@/components/home/Hero'

export const HomePage = () => {
  const navigate = useNavigate()

  const sections = [
    {
      title: "Pureté",
      text: "Chaque pixel est une intention. Chaque œuvre est une émotion.",
      metadata: ["ID: 001", "MEDIUM: DIGITAL", "PERMANENT COLLECTION"]
    },
    {
      title: "Expérience",
      text: "Une interface pensée pour laisser place à la contemplation.",
      metadata: ["ID: 002", "TYPE: IMMERSIVE", "CURATED VIEW"]
    },
    {
      title: "Liberté",
      text: "Votre espace, vos règles, votre vision du monde.",
      metadata: ["ID: 003", "ORIGIN: ARTIST OWNED", "DECENTRALIZED"]
    }
  ]

  return (
    <div className="relative min-h-screen bg-background dark:bg-neutral-950 transition-colors selection:bg-purple-500/30">
      <Hero /> 
      
      {/* Narrative Section */}
      <section className="relative px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="space-y-60 py-32">
            {sections.map((section, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 1, delay: 0.2 }}
                className={`flex flex-col ${index % 2 === 1 ? 'items-end text-right' : 'items-start text-left'}`}
              >
                <span className="text-xs uppercase tracking-[0.4em] text-neutral-400 mb-6 font-medium">
                  {`0${index + 1}`}
                </span>
                <h2 className="text-4xl md:text-5xl font-display font-medium text-foreground dark:text-white mb-6">
                  {section.title}
                </h2>
                <p className="text-lg md:text-xl text-neutral-500 dark:text-neutral-400 max-w-md font-light leading-relaxed mb-8">
                  {section.text}
                </p>
                
                {/* Museum Label */}
                <div className={`flex gap-4 opacity-30 ${index % 2 === 1 ? 'flex-row-reverse' : ''}`}>
                  {section.metadata.map((meta, i) => (
                    <span key={i} className="text-[9px] uppercase tracking-[0.2em] font-medium text-neutral-500 dark:text-neutral-400">
                      {meta}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Curated Collection Section - MIMICKING A PHYSICAL GALLERY WALL */}
      {/* <section className="py-40 px-4 relative z-10">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="border-t border-neutral-200 dark:border-neutral-800 pt-8 mb-20"
          >
            <span className="text-[10px] uppercase tracking-[0.5em] text-neutral-400 font-medium">
              Séléction Commissaire / Exhibition 2026.01
            </span>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-neutral-200 dark:bg-neutral-800 border-[0.5px] border-neutral-200 dark:border-neutral-800">
            {[1, 2, 3].map((item) => (
              <motion.div
                key={item}
                whileHover={{ backgroundColor: "rgba(147, 51, 234, 0.05)" }}
                className="bg-background dark:bg-neutral-950 p-12 aspect-[4/5] flex flex-col items-center justify-center relative cursor-crosshair group transition-colors duration-700"
              >
                <div className="w-full h-full border-[0.5px] border-neutral-100 dark:border-neutral-900 group-hover:border-purple-500/30 transition-colors duration-700 flex items-center justify-center p-8">
                  <div className="w-12 h-12 border border-neutral-300 dark:border-neutral-700 rounded-full flex items-center justify-center opacity-20 group-hover:opacity-100 transition-opacity">
                    <span className="text-[8px] uppercase tracking-tighter">+</span>
                  </div>
                </div>
                <div className="absolute bottom-6 left-6 text-left">
                  <p className="text-[9px] uppercase tracking-[0.3em] font-medium text-neutral-400">Item_{item.toString().padStart(3, '0')}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section> */}

      {/* Subtle CTA Section */}
      <section className="py-40 px-4 relative z-10">
        <div className="container mx-auto max-w-3xl text-center">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.5 }}
          >
            <h2 className="text-3xl md:text-4xl font-display font-medium text-foreground dark:text-white mb-12">
              Prêt à commencer le voyage ?
            </h2>
            
            <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16">
              {[
                { name: 'Explorer', path: '/gallery' },
                { name: 'Artistes', path: '/artists' },
                { name: 'Rejoindre', path: '/auth' }
              ].map((item) => (
                <motion.button
                  key={item.name}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate(item.path)}
                  className="group relative"
                >
                  <span className="text-sm uppercase tracking-[0.3em] font-medium text-neutral-600 dark:text-neutral-400 group-hover:text-purple-600 transition-colors">
                    {item.name}
                  </span>
                  <span className="absolute -bottom-2 left-0 w-0 h-px bg-purple-600 transition-all duration-500 group-hover:w-full" />
                </motion.button>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
      
      {/* Final minimalist signature */}
      <div className="py-20 text-center opacity-20 hover:opacity-100 transition-opacity duration-1000">
        <span className="text-[10px] uppercase tracking-[1em] text-neutral-500">
          Gallery-La — 2026
        </span>
      </div>
    </div>
  )
}
