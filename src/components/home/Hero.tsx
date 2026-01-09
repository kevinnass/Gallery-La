import { motion } from 'framer-motion'

export const Hero = () => {
  return (
    <section className="bg-background dark:bg-neutral-950 px-4 pt-16 pb-12 lg:pt-24 lg:pb-16 transition-colors">
      <div className="container mx-auto max-w-5xl text-center">
         <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-base text-muted dark:text-neutral-400 lg:text-lg"
        >
          Une Gallerie pour tout les passionnés de la création
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-4 text-8xl font-display font-bold uppercase tracking-tight text-foreground dark:text-white lg:text-9xl"
        >
          GALLERY-La
        </motion.h1>

      </div>
    </section>
  )
}
