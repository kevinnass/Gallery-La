import { motion } from 'framer-motion'

export const Hero = () => {
  return (
    <section className="bg-background dark:bg-neutral-950 px-4 pt-24 sm:pt-28 md:pt-32 lg:pt-36 pb-12 transition-colors">
      <div className="container mx-auto max-w-5xl text-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-display font-bold tracking-tight text-foreground dark:text-gray-300 flex flex-wrap justify-center"
        >
          {"Gallery-la".split("").map((letter, index) => (
            <motion.span
              key={index}
              whileHover={{
                y: -10,
                transition: {
                  type: "spring",
                  stiffness: 300,
                  damping: 10
                }
              }}
              className="inline-block"
            >
              {letter}
            </motion.span>
          ))}          
        </motion.h1>

      </div>
    </section>
  )
}
