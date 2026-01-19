import { motion } from 'framer-motion'

export const Hero = () => {
  return (
    <section className="relative min-h-[100vh] flex flex-col items-center justify-center px-4 overflow-hidden">
      <div className="container mx-auto max-w-7xl text-center z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="mb-8"
        >
          <span className="text-[12px] uppercase tracking-[0.5em] text-neutral-500 dark:text-neutral-400 font-medium">
            Partage et Decouverte
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
          className="text-6xl sm:text-7xl md:text-8xl lg:text-[10rem] font-display font-medium tracking-[-0.04em] leading-[0.9] text-foreground dark:text-white"
        >
          Gallery-la
        </motion.h1>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="mt-6 max-w-xl mx-auto"
        >
          <p className="text-sm md:text-base text-neutral-500 dark:text-neutral-400 font-light leading-relaxed tracking-wide">
            Découvrez ou partagez vos créations.
          </p>
        </motion.div>
        
      </div>
    </section>
  )
}
