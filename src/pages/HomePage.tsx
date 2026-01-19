import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Hero } from '@/components/home/Hero'

export const HomePage = () => {
  const navigate = useNavigate()

  const sections = [
    {
      title: "Pureté",
      text: "Chaque œuvre est une émotion.",
      metadata: ''
    },
    {
      title: "Expérience",
      text: "Une interface pensée pour laisser place à la contemplation.",
      metadata: ''
    },
    {
      title: "Liberté",
      text: "Vos œuvres, votre vision du monde.",
      metadata: ''
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
              </motion.div>
            ))}
          </div>
        </div>
      </section>

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
    </div>
  )
}
