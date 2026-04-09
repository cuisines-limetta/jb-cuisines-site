// Point d'entrée principal — JB Cuisines
import { initNav } from './ui/nav.js'
import { initReveal } from './animations/reveal.js'
import { initCounters } from './animations/counters.js'
import { initForm } from './ui/form.js'
import { initScrollVideo } from './animations/scrollVideo.js'

document.addEventListener('DOMContentLoaded', () => {
  initNav()
  initScrollVideo()
  initReveal()
  initCounters()
  initForm()
})
