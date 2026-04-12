// Point d'entrée principal — Cuisines Limetta
import { initNav } from './ui/nav.js'
import { initReveal } from './animations/reveal.js'
import { initCounters } from './animations/counters.js'
import { initForm } from './ui/form.js'
import { initScrollVideo } from './animations/scrollVideo.js'
import { initTheme } from './ui/theme.js'
import { initFaq }   from './ui/faq.js'
import { loadContent } from './utils/content-loader.js'

document.addEventListener('DOMContentLoaded', () => {
  loadContent() // hydrate le DOM depuis /api/content (silencieux si non disponible)
  initTheme()
  initNav()
  initScrollVideo()
  initReveal()
  initCounters()
  initForm()
  initFaq()
})
