import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Home, Search, ArrowLeft } from 'lucide-react'

export const NotFoundPage = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-background dark:bg-neutral-950 flex items-center justify-center">
      <div className="max-w-2xl w-full text-center">
        {/* Animated 404 */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, type: "spring" }}
          className="mb-"
        >
          <motion.h1
            transition={{ duration: 2, repeat: Infinity }}
            className="text-9xl font-bold text-neutral-900 dark:text-neutral-100"
          >
            404
          </motion.h1>
        </motion.div>

        {/* Error Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-"
        >
          <h2 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100 mb-4">
            Not Found
          </h2>
          <p className="text-lg text-neutral-600 dark:text-neutral-400 mb-2">
            Oups ! La page que vous visitez n'existe pas !
          </p>
        </motion.div>

        {/* Animated Search Icon */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-12"
        >
          <motion.div
            animate={{
              rotate: [0, 10, -10, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{ duration: 2, repeat: Infinity }}
            className="inline-block"
          >
            <Search className="w-24 h-24 text-neutral-300 dark:text-neutral-700 mx-auto" />
          </motion.div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate(-1)}
            className="px-8 py-4 bg-black dark:bg-neutral-800 text-white dark:text-neutral-100 rounded-xl font-medium hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors border-2 border-neutral-200 dark:border-neutral-700 inline-flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-5 h-5" />
            Retour
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/')}
            className="px-8 py-4 bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 rounded-xl font-medium hover:opacity-90 transition-opacity inline-flex items-center justify-center gap-2"
          >
            <Home className="w-5 h-5" />
            Accueil
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/gallery')}
            className="px-8 py-4 bg-black dark:bg-neutral-800 text-white dark:text-neutral-100 rounded-xl font-medium hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors border-2 border-neutral-200 dark:border-neutral-700 inline-flex items-center justify-center gap-2"
          >
            <Search className="w-5 h-5" />
            Explorer
          </motion.button>
        </motion.div>
      </div>
    </div>
  )
}
