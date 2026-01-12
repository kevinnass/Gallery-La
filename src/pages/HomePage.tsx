import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, Image, Globe, Users } from 'lucide-react'
import { Hero } from '@/components/home/Hero'

export const HomePage = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-background dark:bg-neutral-950 transition-colors">
      <Hero />
      
      {/* Features Section */}
      <section className="py-10 px-4">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 dark:text-neutral-100 mb-4">
              Partagez vos créations avec le monde
            </h2>
            <p className="text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
              Gallery-La est une plateforme moderne pour les artistes qui souhaitent partager leurs œuvres
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-white dark:bg-neutral-900 p-8 border-2 border-black dark:border-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mb-6">
                <Image className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 mb-3">
                Créez & Uploadez
              </h3>
              <p className="text-neutral-600 dark:text-neutral-400">
                Partagez vos images, vidéos et fichiers audio. Ajoutez des covers personnalisées pour vos créations audio.
              </p>
            </motion.div>

            {/* Feature 2 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white dark:bg-neutral-900 border-2 border-black dark:border-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mb-6">
                <Globe className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 mb-3">
                Public ou Privé
              </h3>
              <p className="text-neutral-600 dark:text-neutral-400">
                Contrôlez la visibilité de vos œuvres. Rendez-les publiques pour le monde ou gardez-les privées.
              </p>
            </motion.div>

            {/* Feature 3 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-white dark:bg-neutral-900 border-2 border-black dark:border-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center mb-6">
                <Users className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 mb-3">
                Découvrez & Connectez
              </h3>
              <p className="text-neutral-600 dark:text-neutral-400">
                Explorez les créations d'autres artistes et construisez votre communauté créative.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20">
        <div className="container mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 dark:text-neutral-100 mb-6">
              Prêt à découvrir des créations ?
            </h2>
            <p className="text-lg text-neutral-600 dark:text-neutral-400 mb-8 max-w-2xl mx-auto">
              Rejoignez notre communauté d'artistes et commencez à partager vos œuvres dès aujourd'hui
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate('/gallery')}
                className="px-8 py-4 bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 rounded-xl font-medium hover:opacity-90 transition-opacity inline-flex items-center justify-center gap-2"
              >
                Explorer la galerie
                <ArrowRight className="w-5 h-5" />
              </button>
              <button
                onClick={() => navigate('/artists')}
                className="px-8 py-4 bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 rounded-xl font-medium hover:opacity-90 transition-opacity inline-flex items-center justify-center gap-2"
              >
                Decouvrez les artistes
                <ArrowRight className="w-5 h-5" />
              </button>
              <button
                onClick={() => navigate('/auth')}
                className="px-8 py-4 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 rounded-xl font-medium hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors border-2 border-neutral-200 dark:border-neutral-700"
              >
                Commencer gratuitement
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
