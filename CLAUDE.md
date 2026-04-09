# CLAUDE.md — Site web 3D dynamique pour cuisiniste

## Contexte du projet

Site vitrine interactif pour un cuisiniste, mettant en avant les réalisations via une expérience 3D immersive. L'objectif est d'impressionner les visiteurs avec des visualisations dynamiques de cuisines, des matériaux et des configurations possibles.

## Stack technique

- **Rendu 3D** : Three.js (bibliothèque principale pour le WebGL)
- **Framework JS** : Vanilla JS ou React selon la complexité des composants UI
- **Bundler** : Vite
- **Styles** : CSS moderne (custom properties, Grid, Flexbox) — pas de framework CSS lourd
- **Assets 3D** : Fichiers `.glb` / `.gltf` pour les modèles de cuisines
- **Animations** : GSAP pour les transitions et animations d'interface
- **Déploiement** : Statique (Netlify, Vercel, ou hébergement classique)

## Structure des fichiers

```
/
├── index.html
├── src/
│   ├── main.js          # Point d'entrée, init Three.js
│   ├── scene/           # Setup scène, caméra, lumières
│   ├── models/          # Chargement et gestion des modèles 3D
│   ├── ui/              # Composants d'interface (menus, panneaux)
│   ├── animations/      # Transitions GSAP, scroll animations
│   └── utils/           # Helpers (responsive, loaders, math)
├── public/
│   ├── models/          # Fichiers .glb/.gltf
│   ├── textures/        # Textures PBR (albedo, normal, roughness)
│   └── images/          # Photos et visuels
├── styles/
│   └── main.css
└── vite.config.js
```

## Conventions de code

- ES modules (`import/export`), pas de CommonJS
- Nommage : `camelCase` pour variables/fonctions, `PascalCase` pour classes
- Commentaires en français
- Pas de dépendances inutiles — garder le bundle léger
- Les modèles 3D doivent être optimisés (Draco compression pour les .glb)

## Performance 3D

- Utiliser `LOD` (Level of Detail) pour les modèles complexes
- Limiter les `draw calls` — fusionner les géométries statiques
- Textures en puissance de 2 (512, 1024, 2048px)
- Activer le `frustum culling` Three.js (activé par défaut)
- Préférer `BufferGeometry` aux géométries non-bufferisées
- Éviter les allocations dans la boucle `animate()` (pas de `new Vector3()` dans requestAnimationFrame)

## UX / Expérience

- Le chargement 3D doit avoir un écran de chargement avec progression
- Navigation caméra : orbite sur desktop, gyroscope optionnel sur mobile
- Responsive : expérience dégradée gracieusement sur mobile (pas de WebGL → fallback images)
- Accessibilité : conserver un contenu textuel indexable par les moteurs de recherche
- Transitions fluides entre les sections (scroll ou clic)

## Ce qu'il ne faut pas faire

- Ne pas mettre la logique 3D dans le HTML inline
- Ne pas charger des modèles non-compressés (> 5 Mo par modèle)
- Ne pas bloquer le thread principal avec des calculs lourds — utiliser des Web Workers si nécessaire
- Ne pas oublier de disposer (`dispose()`) les géométries, matériaux et textures Three.js non utilisés pour éviter les fuites mémoire
