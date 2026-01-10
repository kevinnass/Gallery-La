export const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="w-full border-t border-neutral-200 dark:border-neutral-800 bg-background dark:bg-neutral-950 py-8 transition-colors">
      <div className="container mx-auto max-w-7xl px-8">
        <p className="text-center text-sm text-muted dark:text-neutral-400">
          © {currentYear} - Tous les droits appartiennent aux créateurs
        </p>
      </div>
    </footer>
  )
}
