// Animation d'entrée au scroll via IntersectionObserver

export function initReveal() {
  const elements = document.querySelectorAll('.reveal')

  if (!elements.length) return

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          // Délai en cascade pour les éléments dans la même section
          const siblings = [...entry.target.parentElement.querySelectorAll('.reveal')]
          const index = siblings.indexOf(entry.target)
          const delay = index * 80

          setTimeout(() => {
            entry.target.classList.add('visible')
          }, delay)

          observer.unobserve(entry.target)
        }
      })
    },
    {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    }
  )

  elements.forEach(el => observer.observe(el))
}
