import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Github, CheckCircle } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Input } from '@/components/ui/Input'
import { useAuth } from '@/hooks/useAuth'

export const AuthPage = () => {
  const [email, setEmail] = useState('')
  const [emailSent, setEmailSent] = useState(false)
  const navigate = useNavigate()
  const { sendMagicLink, loginWithGithub, loading, error } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const result = await sendMagicLink(email)
    if (result.meta.requestStatus === 'fulfilled') {
      setEmailSent(true)
    }
  }

  const handleGithubLogin = async () => {
    await loginWithGithub()
  }

  return (
    <div className="min-h-screen bg-background dark:bg-neutral-950 flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Card */}
        <div className="bg-white dark:bg-neutral-900 rounded-2xl p-8 shadow-lg">
          {/* Title */}
          <h1 className="text-3xl font-medium text-foreground dark:text-gray-300 text-center mb-8">
            Join the gallery.
          </h1>

          {emailSent ? (
            /* Success Message */
            <div className="text-center py-8">
              <CheckCircle className="mx-auto mb-4 text-green-500" size={48} />
              <h2 className="text-xl font-medium text-foreground dark:text-gray-300 mb-2">
                Check your email
              </h2>
              <p className="text-sm text-muted dark:text-neutral-400">
                We've sent a magic link to <strong>{email}</strong>
              </p>
            </div>
          ) : (
            <>
              {/* Email Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  type="email"
                  placeholder="Enter your email for a magic link"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                  icon={<ArrowRight size={20} />}
                />

                {error && (
                  <p className="text-sm text-red-500">{error}</p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-foreground dark:bg-white text-white dark:text-foreground font-medium rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  {loading ? 'Sending...' : 'Send Magic Link'}
                </button>
              </form>

              {/* Divider */}
              <div className="flex items-center gap-4 my-6">
                <div className="flex-1 h-px bg-neutral-200 dark:bg-neutral-700" />
                <span className="text-sm text-muted dark:text-neutral-400">or continue with social</span>
                <div className="flex-1 h-px bg-neutral-200 dark:bg-neutral-700" />
              </div>

              {/* GitHub Login */}
              <button
                onClick={handleGithubLogin}
                disabled={loading}
                className="w-full py-3 border border-neutral-300 dark:border-neutral-700 rounded-lg flex items-center justify-center gap-2 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors disabled:opacity-50"
              >
                <Github size={20} className="text-foreground dark:text-gray-300" />
                <span className="text-sm font-medium text-foreground dark:text-gray-300">Continue with GitHub</span>
              </button>
            </>
          )}
        </div>
      </motion.div>
    </div>
  )
}
