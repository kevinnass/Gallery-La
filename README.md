# Gallery-La 🎨

Galerie d'art en ligne permettant aux artistes de partager leurs œuvres (images, vidéos, audio) et de créer des expositions virtuelles.

## Stack

- **Frontend** — React 19, TypeScript, Vite, Tailwind CSS
- **State** — Redux Toolkit
- **Backend** — Supabase (Auth, PostgreSQL, Storage)
- **Animations** — Framer Motion
- **3D** — Three.js / React Three Fiber (canvas artistique)
- **PWA** — vite-plugin-pwa
- **UI** — Lucide React, Radix UI
- **Déploiement** — Vercel

## Fonctionnalités

- 🔐 Authentification (Supabase Auth, PKCE, OAuth)
- 🖼️ Upload d'œuvres (images, vidéos, audio) avec couverture personnalisable
- 🎭 Galerie personnelle avec 3 modes d'affichage (grille, masonry, éditorial)
- 🏛️ Expositions virtuelles — créer des collections thématiques avec drag & drop
- 👤 Profils artistes avec page publique (`/artists/:username`)
- 🔍 Recherche et filtres par type de média (photo, vidéo, audio)
- 🔒 Gestion de visibilité (public / privé) par œuvre
- 🌙 Mode sombre / clair
- 📱 PWA installable + navigation mobile dédiée
- 🎵 Lecteur audio personnalisé avec pochette

## Installation

```bash
# Cloner le repo
git clone https://github.com/kevinnass/gallery-la.git
cd gallery-la

# Installer les dépendances
pnpm install

# Configurer les variables d'environnement
cp .env.example .env
# Remplir VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY

# Lancer en dev
pnpm dev
```

## Scripts

```bash
pnpm dev       # Serveur de développement
pnpm build     # Build de production
pnpm preview   # Preview du build
```

## Structure

```
src/
├── app/           # Store Redux + hooks typés
├── components/    # Composants (layout, ui, artworks, exhibitions, home, profile)
├── features/      # Redux slices (auth, theme)
├── hooks/         # Custom hooks (useArtworks, useExhibitions, useAuth, useProfile)
├── lib/           # Supabase client + utils
└── pages/         # Pages (Home, Gallery, Artists, Auth, Settings, Exhibitions)
```

## License

MIT
