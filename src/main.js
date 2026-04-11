// Point d'entrée principal — Cuisines Limetta
import { initNav } from './ui/nav.js'
import { initReveal } from './animations/reveal.js'
import { initCounters } from './animations/counters.js'
import { initForm } from './ui/form.js'
import { initScrollVideo } from './animations/scrollVideo.js'
import { initTheme } from './ui/theme.js'

document.addEventListener('DOMContentLoaded', () => {
  initTheme()
  initNav()
  initScrollVideo()
  initReveal()
  initCounters()
  initForm()
})
