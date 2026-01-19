import { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Header } from './components/layout/Header'
import { Footer } from './components/layout/Footer'
import { MobileBottomNav } from './components/layout/MobileBottomNav'
import { CTAPopup } from './components/ui/CTAPopup'
import { PWAInstallPrompt } from './components/ui/PWAInstallPrompt'
import { ScrollToTopOnNavigation } from './components/ui/ScrollToTopOnNavigation'
import { ProfileCompletionModal } from './components/profile/ProfileCompletionModal'
import { HomePage } from './pages/HomePage'
import { AuthPage } from './pages/AuthPage'
import { PublicGalleryPage } from './pages/PublicGalleryPage'
import { ArtistsPage } from './pages/ArtistsPage'
import { GalleryPage } from './pages/GalleryPage'
import { MyGalleryRedirect } from './pages/MyGalleryRedirect'
import { SettingsPage } from './pages/SettingsPage'
import { NotFoundPage } from './pages/NotFoundPage'
import { useAppSelector, useAppDispatch } from './app/hooks'
import { useProfile } from './hooks/useProfile'
import { supabase } from './lib/supabase'
import { setSession } from './features/auth/authSlice'

function App() {
  const theme = useAppSelector((state) => state.theme.mode)
  const user = useAppSelector((state) => state.auth.user)
  const dispatch = useAppDispatch()
  const { isProfileComplete, loading: profileLoading } = useProfile()
  
  const [showProfileModal, setShowProfileModal] = useState(false)

  useEffect(() => {
    const root = document.documentElement
    if (theme === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
  }, [theme])

  // Listen for auth state changes
  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      dispatch(setSession(session))
    })

    // Listen for changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      dispatch(setSession(session)) 
    })

    return () => subscription.unsubscribe()
  }, [dispatch])

  // Check if profile is complete when user logs in
  useEffect(() => {
    if (user && !profileLoading) {
      // Show modal if profile is incomplete
      setShowProfileModal(!isProfileComplete)
    } else {
      setShowProfileModal(false)
    }
  }, [user, isProfileComplete, profileLoading])

  return (
    <BrowserRouter>
      <ScrollToTopOnNavigation />
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/gallery" element={<PublicGalleryPage />} />
        <Route path="/artists" element={<ArtistsPage />} />
        <Route path="/artists/:username" element={<GalleryPage />} />
        <Route path="/my-gallery" element={<MyGalleryRedirect />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <Footer />
      <MobileBottomNav />
      {/* <CTAPopup /> */}
      <PWAInstallPrompt />
      
      {/* Profile Completion Modal */}
      <ProfileCompletionModal 
        isOpen={showProfileModal} 
        onClose={() => setShowProfileModal(false)} 
      />
    </BrowserRouter>
  )
}

export default App
