// Animation des compteurs statistiques

export function initCounters() {
  const counters = document.querySelectorAll('.stat__number[data-count]')

  if (!counters.length) return

  const animate = (el) => {
    const target = parseInt(el.dataset.count, 10)
    const duration = 1800
    const start = performance.now()

    const step = (now) => {
      const elapsed = now - start
      const progress = Math.min(elapsed / duration, 1)
      // Easing easeOutExpo
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress)
      el.textContent = Math.floor(eased * target)

      if (progress < 1) {
        requestAnimationFrame(step)
      } else {
        el.textContent = target
      }
    }

    requestAnimationFrame(step)
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animate(entry.target)
          observer.unobserve(entry.target)
        }
      })
    },
    { threshold: 0.5 }
  )

  counters.forEach(counter => observer.observe(counter))
}
