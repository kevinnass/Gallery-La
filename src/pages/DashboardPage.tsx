import { useAuth } from '@/hooks/useAuth'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

export const DashboardPage = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-background dark:bg-neutral-950 px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto max-w-4xl"
      >
        <div className="bg-white dark:bg-neutral-900 rounded-2xl p-8 shadow-lg">
          <h1 className="text-3xl font-medium text-foreground dark:text-gray-300 mb-4">
            dashboard
          </h1>
          
          <p className="text-muted dark:text-neutral-400 mb-6">
            welcome, <strong>{user?.email}</strong>
          </p>

          <div className="space-y-4">
            <div className="p-4 bg-neutral-50 dark:bg-neutral-800 rounded-lg">
              <h2 className="text-lg font-medium text-foreground dark:text-gray-300 mb-2">
                your profile
              </h2>
              <p className="text-sm text-muted dark:text-neutral-400">
                email: {user?.email}
              </p>
              <p className="text-sm text-muted dark:text-neutral-400">
                user id: {user?.id}
              </p>
            </div>

            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              sign out
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
