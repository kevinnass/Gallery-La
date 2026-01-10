# Structuration du Projet Gallery-La

Ce document décrit l'organisation du dépôt Gallery-La, un projet de galerie artistique  utilisant React, TypeScript, Vite et Tailwind CSS.

## 📁 Structure Racine

```
Gallery-La/
├── .git/                  # Historique Git
├── .gitignore            # Fichiers à ignorer par Git
├── node_modules/         # Dépendances npm (ignoré par Git)
├── interface/            # Images de référence pour le design
├── src/                  # Code source de l'application
├── index.html            # Point d'entrée HTML
├── package.json          # Configuration npm et dépendances
├── pnpm-lock.yaml        # Verrouillage des versions de dépendances
├── vite.config.ts        # Configuration Vite
├── tsconfig.json         # Configuration TypeScript
├── tsconfig.node.json    # Configuration TypeScript pour Node
├── tailwind.config.js    # Configuration Tailwind CSS
├── postcss.config.js     # Configuration PostCSS
├── Instructions.md       # Guide de développement pour l'IA
├── README.md             # Documentation du projet
└── Structuration.md      # Ce fichier
```

---

## 📂 Dossier `src/` - Code Source

### Structure Globale

```
src/
├── main.tsx              # Point d'entrée React (Provider Redux)
├── App.tsx               # Composant racine de l'application
├── index.css             # Styles globaux (Tailwind directives)
├── app/                  # Configuration Redux
├── components/           # Composants React réutilisables
├── features/             # Logique métier (Redux slices)
├── lib/                  # Utilitaires et helpers
└── pages/                # Composants de pages
```

---

## 📁 `src/app/` - Configuration Redux

Contient la configuration du store Redux et les hooks typés.

### Fichiers

- **`store.ts`** - Configuration du store Redux avec les reducers
- **`hooks.ts`** - Hooks Redux typés (`useAppDispatch`, `useAppSelector`)

**Exemple d'utilisation :**
```typescript
// Dans un composant
import { useAppSelector, useAppDispatch } from '@/app/hooks'
const theme = useAppSelector((state) => state.theme.mode)
```

---

## 📁 `src/components/` - Composants React

Les composants sont organisés par catégorie pour faciliter la maintenance.

### Structure

```
components/
├── layout/               # Composants de structure de page
│   └── Header.tsx       # En-tête avec navigation et dark mode
├── home/                # Composants spécifiques à la page d'accueil
│   ├── Hero.tsx        # Section hero avec titre "GALLERY-La"
│   └── ArtworkGrid.tsx # Grille d'artworks avec données mock
└── ui/                  # Composants UI réutilisables
    └── ArtworkCard.tsx # Carte d'artwork (image/audio/icon)
```

### Détails des Composants

#### `layout/Header.tsx`
- Logo "Gallery-La" à gauche
- Navigation centrale (accueil, artistes, galerie)
- Bouton de connexion
- Toggle dark/light mode (Moon/Sun icon)

#### `home/Hero.tsx`
- Titre massif "GALLERY-La" avec police Khand
- Sous-titre "Une Gallerie pour tout les passionnés de la création"
- Animations Framer Motion

#### `home/ArtworkGrid.tsx`
- Grille responsive (1 col mobile → 4 col desktop)
- Mock data avec 9 artworks variés
- Animations staggered avec Framer Motion

#### `ui/ArtworkCard.tsx`
- Support de 3 types : `image`, `audio`, `icon`
- Overlays de métadonnées (date, catégorie)
- Effet hover (lift -4px)

---

## 📁 `src/features/` - Logique Métier (Redux)

Contient les Redux slices organisés par domaine fonctionnel.

### Structure

```
features/
└── theme/
    └── themeSlice.ts    # Gestion du thème dark/light
```

### `theme/themeSlice.ts`

**Actions :**
- `toggleTheme()` - Bascule entre light et dark
- `setTheme(mode)` - Définit un thème spécifique

**État :**
- `mode: 'light' | 'dark'`
- Sauvegarde automatique dans `localStorage`

---

## 📁 `src/lib/` - Utilitaires

Fonctions helpers et utilitaires réutilisables.

### Fichiers

- **`utils.ts`** - Fonction `cn()` pour fusionner les classes Tailwind
  ```typescript
  import { cn } from '@/lib/utils'
  <div className={cn('base-class', condition && 'conditional-class')} />
  ```

---

## 📁 `src/pages/` - Pages

Composants de pages qui assemblent d'autres composants.

### Fichiers

- **`HomePage.tsx`** - Page d'accueil (Hero + ArtworkGrid)

---

## 🎨 Fichiers de Configuration

### `vite.config.ts`
- Plugin React
- Alias de chemin `@` → `./src`
- Optimisation des dépendances
- Configuration du serveur de développement

### `tailwind.config.js`
- **Colors** : `background`, `foreground`, `muted`, `card`
- **Fonts** : 
  - `sans` : Inter (corps de texte)
  - `display` : Khand (titres massifs)
- **Dark mode** : Stratégie `class`

### `tsconfig.json`
- Target ES2020
- Mode strict activé
- Alias de chemin configuré

### `package.json`
**Scripts :**
- `pnpm run dev` - Serveur de développement
- `pnpm run build` - Build de production
- `pnpm run preview` - Preview du build

**Dépendances principales :**
- React 19.2.3
- Redux Toolkit 2.11.2
- Tailwind CSS 3.4.19
- Framer Motion 12.25.0
- Lucide React (icônes)

---

## 🚀 Conventions de Code

### Imports
```typescript
// Ordre recommandé :
import { useState } from 'react'           // 1. React/libs externes
import { motion } from 'framer-motion'     // 2. Bibliothèques tierces
import { useAppSelector } from '@/app/hooks' // 3. Imports internes (@/)
import { cn } from '@/lib/utils'           // 4. Utilitaires
import './styles.css'                      // 5. Styles
```

### Nommage
- **Composants** : PascalCase (`Header.tsx`)
- **Hooks** : camelCase avec préfixe `use` (`useAppSelector`)
- **Slices Redux** : camelCase avec suffixe `Slice` (`themeSlice.ts`)

### TypeScript
- Toujours typer les props des composants
- Utiliser `interface` pour les props
- Éviter `any` à tout prix

---

## 📝 Prochaines Étapes (selon Instructions.md)

### Étape 2 - Authentification Supabase
- Créer `src/lib/supabase.ts`
- Créer `features/auth/authSlice.ts`
- Implémenter Login/Signup

### Étape 3 - Upload & Dashboard
- Page d'upload d'artworks
- Dashboard de gestion pour les artistes
- Supabase Storage pour les médias

---

## 🔗 Ressources

- **Documentation Vite** : https://vitejs.dev/
- **Redux Toolkit** : https://redux-toolkit.js.org/
- **Tailwind CSS** : https://tailwindcss.com/
- **Framer Motion** : https://www.framer.com/motion/
