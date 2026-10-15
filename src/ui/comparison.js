export function initComparison() {
  const range = document.getElementById('comparison-range'), images = document.querySelector('.comparison__images')
  if (!range || !images) return
  const update = () => {
    images.style.setProperty('--comparison', `${range.value}%`)
    range.setAttribute('aria-valuetext', `${range.value} % de l’aménagement visible`)
  }
  range.addEventListener('input', update); update()
  const move = event => {
    const bounds = images.getBoundingClientRect()
    range.value = Math.round(Math.max(0, Math.min(100, (event.clientX - bounds.left) / bounds.width * 100)))
    update()
  }
  images.addEventListener('pointerdown', event => {
    if (event.button !== 0) return
    images.setPointerCapture(event.pointerId)
    range.focus({ preventScroll:true })
    move(event)
  })
  images.addEventListener('pointermove', event => { if (images.hasPointerCapture(event.pointerId)) move(event) })
  images.addEventListener('pointerup', event => { if (images.hasPointerCapture(event.pointerId)) images.releasePointerCapture(event.pointerId) })
}
