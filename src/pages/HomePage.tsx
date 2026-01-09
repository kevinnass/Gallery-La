import { Hero } from '@/components/home/Hero'
import { ArtworkGrid } from '@/components/home/ArtworkGrid'

export const HomePage = () => {
  return (
    <div className="min-h-screen bg-background dark:bg-neutral-950 transition-colors">
      <Hero />
      <ArtworkGrid />
    </div>
  )
}
