// Animation FAQ — ouverture/fermeture fluide
export function initFaq () {
  const EASING   = 'cubic-bezier(0.4,0,0.2,1)'
  const DURATION = '0.36s'

  const items = document.querySelectorAll('.faq__item')

  items.forEach(details => {
    const summary = details.querySelector('.faq__question')
    const answer  = details.querySelector('.faq__answer')

    summary.addEventListener('click', e => {
      e.preventDefault()

      if (details.open) {
        // ── Fermeture ────────────────────────────────────────────────
        answer.style.overflow   = 'hidden'
        answer.style.height     = answer.scrollHeight + 'px'
        answer.style.opacity    = '1'

        // Forcer le reflow — empêche le saccade initial
        getComputedStyle(answer).height // eslint-disable-line no-unused-expressions

        answer.style.transition = `height ${DURATION} ${EASING}, opacity ${DURATION} ${EASING}`
        answer.style.height     = '0'
        answer.style.opacity    = '0'

        answer.addEventListener('transitionend', function handler (e) {
          if (e.propertyName !== 'height') return
          details.removeAttribute('open')
          answer.style.cssText = ''
          answer.removeEventListener('transitionend', handler)
        })

      } else {
        // ── Ouverture ────────────────────────────────────────────────
        details.setAttribute('open', '')

        answer.style.overflow   = 'hidden'
        answer.style.height     = '0'
        answer.style.opacity    = '0'

        // Forcer le reflow
        getComputedStyle(answer).height // eslint-disable-line no-unused-expressions

        const targetH = answer.scrollHeight
        answer.style.transition = `height ${DURATION} ${EASING}, opacity ${DURATION} ${EASING}`
        answer.style.height     = targetH + 'px'
        answer.style.opacity    = '1'

        answer.addEventListener('transitionend', function handler (e) {
          if (e.propertyName !== 'height') return
          answer.style.height     = 'auto'
          answer.style.overflow   = ''
          answer.style.transition = ''
          answer.removeEventListener('transitionend', handler)
        })
      }
    })
  })
}
