import { useEffect } from 'react'
import { Header } from './components/layout/Header'
import { Footer } from './components/layout/Footer'
import { CTAPopup } from './components/ui/CTAPopup'
import { HomePage } from './pages/HomePage'
import { useAppSelector } from './app/hooks'

function App() {
  const theme = useAppSelector((state) => state.theme.mode)

  useEffect(() => {
    const root = document.documentElement
    if (theme === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
  }, [theme])

  return (
    <>
      <Header />
      <HomePage />
      <Footer />
      <CTAPopup />
    </>
  )
}

export default App
