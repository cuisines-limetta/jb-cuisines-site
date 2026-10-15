// Gestion de la navigation — scroll + menu mobile

export function initNav() {
  const nav = document.getElementById('nav')
  const burger = document.getElementById('burger')
  const mobileMenu = document.getElementById('mobile-menu')
  const compact = matchMedia('(max-width: 1100px)')
  const setMenu = (open) => {
    burger?.classList.toggle('open', open)
    burger?.setAttribute('aria-expanded', String(open))
    burger?.setAttribute('aria-label', open ? 'Fermer le menu' : 'Ouvrir le menu')
    mobileMenu?.classList.toggle('open', open)
    mobileMenu?.setAttribute('aria-hidden', String(!open))
  }
  burger?.setAttribute('aria-controls', 'mobile-menu')
  const measureHeader = () => {
    const row = nav.querySelector('.nav__container')
    const bottom = row.getBoundingClientRect().bottom + 8
    document.documentElement.style.setProperty('--header-height', `${bottom}px`)
  }
  new ResizeObserver(measureHeader).observe(nav.querySelector('.nav__container'))

  let frame = 0
  const onScroll = () => {
    if (frame) return
    frame = requestAnimationFrame(() => {
      const progress = Math.min(1, Math.max(0, window.scrollY / 220))
      document.documentElement.style.setProperty('--nav-progress', progress)
      nav.classList.toggle('scrolled', progress > .85)
      frame = 0
    })
  }
  window.addEventListener('scroll', onScroll, { passive: true })
  onScroll()

  // Menu burger mobile
  burger?.addEventListener('click', () => {
    setMenu(burger.getAttribute('aria-expanded') !== 'true')
  })

  // Fermer le menu au clic sur un lien mobile
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && burger?.getAttribute('aria-expanded') === 'true') {
      setMenu(false)
      burger.focus({preventScroll:true})
    }
  })
  document.addEventListener('click', event => {
    if (!nav.contains(event.target)) setMenu(false)
  })
  compact.addEventListener('change', () => { setMenu(false); measureHeader() })
  window.addEventListener('orientationchange', () => setMenu(false))
  measureHeader()

  // Scroll fluide pour les ancres
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const id = anchor.getAttribute('href')
      if (id === '#') return
      const target = document.querySelector(id)
      if (target) {
        e.preventDefault()
        setMenu(false)
        // Anchors land below the final compact header, not the expanded menu/logo.
        const navHeight = innerWidth <= 767 || (innerWidth <= 1100 && innerHeight <= 500) ? 66 : 84
        const stickyHeight = 0
        const top = id === '#hero' ? 0 : target.getBoundingClientRect().top + window.scrollY - navHeight - stickyHeight - 12
        window.scrollTo({ top, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' })
      }
    })
  })

  // Bouton "défiler vers le bas" : commence la vidéo en scrollant doucement
  document.getElementById('scroll-down')?.addEventListener('click', () => {
    window.scrollBy({ top: window.innerHeight * 0.6, behavior: 'smooth' })
  })
}
