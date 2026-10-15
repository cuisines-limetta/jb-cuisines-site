// Point d'entrée principal — Cuisines Limetta
import { initNav } from './ui/nav.js'
import { initMobileShowroom } from './ui/mobile-app.js'
import { initAppointmentCTA } from './ui/appointment-cta.js'
import { initAmbiances } from './ui/ambiances.js'
import { initExperienceMotion } from './animations/experience.js'
import { initCounters } from './animations/counters.js'
import { initForm } from './ui/form.js'
import { initScrollVideo } from './animations/scrollVideo.js'
import { initTheme } from './ui/theme.js'
import { initFaq }   from './ui/faq.js'
import { loadContent } from './utils/content-loader.js'

document.addEventListener('DOMContentLoaded', () => {
  loadContent() // hydrate le DOM depuis /api/content (silencieux si non disponible)
  initTheme()
  initMobileShowroom()
  initNav()
  initAppointmentCTA()
  initScrollVideo()
  initAmbiances()
  initExperienceMotion()
  initCounters()
  initForm()
  initFaq()
})
