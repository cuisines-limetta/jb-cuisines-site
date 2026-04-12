// Animation FAQ — grid-template-rows trick (0fr → 1fr), aucun calcul JS
export function initFaq () {
  document.querySelectorAll('.faq__item').forEach(item => {
    const btn    = item.querySelector('.faq__question')
    const answer = item.querySelector('.faq__answer')

    btn.addEventListener('click', () => {
      const open = item.classList.toggle('is-open')
      btn.setAttribute('aria-expanded', open)
      answer.setAttribute('aria-hidden', !open)
    })
  })
}
