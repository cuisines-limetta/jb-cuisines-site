// Gestion de la navigation — scroll + menu mobile

export function initNav() {
  const nav = document.getElementById('nav')
  const burger = document.getElementById('burger')
  const mobileMenu = document.getElementById('mobile-menu')
  const mobileLinks = mobileMenu?.querySelectorAll('a')

  // La nav devient blanche seulement après la fin de la zone de scroll vidéo
  const heroWrapper = document.getElementById('hero-wrapper')

  const onScroll = () => {
    const threshold = heroWrapper ? heroWrapper.offsetHeight - window.innerHeight : 60
    if (window.scrollY > threshold) {
      nav.classList.add('scrolled')
    } else {
      nav.classList.remove('scrolled')
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true })
  onScroll()

  // Menu burger mobile
  burger?.addEventListener('click', () => {
    const isOpen = burger.classList.toggle('open')
    burger.setAttribute('aria-expanded', String(isOpen))
    mobileMenu.classList.toggle('open', isOpen)
    mobileMenu.setAttribute('aria-hidden', String(!isOpen))
  })

  // Fermer le menu au clic sur un lien mobile
  mobileLinks?.forEach(link => {
    link.addEventListener('click', () => {
      burger.classList.remove('open')
      burger.setAttribute('aria-expanded', 'false')
      mobileMenu.classList.remove('open')
      mobileMenu.setAttribute('aria-hidden', 'true')
    })
  })

  // Scroll fluide pour les ancres
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const id = anchor.getAttribute('href')
      if (id === '#') return
      const target = document.querySelector(id)
      if (target) {
        e.preventDefault()
        const navHeight = nav.offsetHeight
        const top = target.getBoundingClientRect().top + window.scrollY - navHeight
        window.scrollTo({ top, behavior: 'smooth' })
      }
    })
  })

  // Bouton "défiler vers le bas" : commence la vidéo en scrollant doucement
  document.getElementById('scroll-down')?.addEventListener('click', () => {
    window.scrollBy({ top: window.innerHeight * 0.6, behavior: 'smooth' })
  })
}
