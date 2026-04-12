// Animation FAQ — ouverture/fermeture fluide
export function initFaq () {
  const items = document.querySelectorAll('.faq__item')

  items.forEach(details => {
    const summary = details.querySelector('.faq__question')
    const answer  = details.querySelector('.faq__answer')

    summary.addEventListener('click', e => {
      e.preventDefault()

      if (details.open) {
        // Fermeture
        const startH = answer.scrollHeight
        answer.style.height = startH + 'px'
        answer.style.overflow = 'hidden'

        requestAnimationFrame(() => {
          answer.style.transition = 'height 0.35s cubic-bezier(0.4,0,0.2,1), opacity 0.25s ease'
          answer.style.opacity = '0'
          answer.style.height  = '0'
        })

        answer.addEventListener('transitionend', function handler () {
          details.removeAttribute('open')
          answer.style.cssText = ''
          answer.removeEventListener('transitionend', handler)
        }, { once: true })

      } else {
        // Ouverture
        details.setAttribute('open', '')
        const targetH = answer.scrollHeight
        answer.style.height   = '0'
        answer.style.opacity  = '0'
        answer.style.overflow = 'hidden'

        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            answer.style.transition = 'height 0.35s cubic-bezier(0.4,0,0.2,1), opacity 0.3s ease'
            answer.style.height  = targetH + 'px'
            answer.style.opacity = '1'
          })
        })

        answer.addEventListener('transitionend', function handler (e) {
          if (e.propertyName !== 'height') return
          answer.style.height   = 'auto'
          answer.style.overflow = ''
          answer.style.transition = ''
          answer.removeEventListener('transitionend', handler)
        }, { once: false })
      }
    })
  })
}
