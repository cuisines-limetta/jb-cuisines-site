// Native H.264 seeking on desktop; a predecoded image sequence on mobile.
export function initScrollVideo() {
  const video = document.getElementById('hero-video'), wrapper = document.getElementById('hero-wrapper')
  const button = document.getElementById('film-toggle'), caption = document.getElementById('film-instruction')
  const bar = document.getElementById('film-progress')
  if (!video || !wrapper || !button) return
  const reduced = matchMedia('(prefers-reduced-motion: reduce)'), compact = matchMedia('(max-width: 767px), (max-width: 1100px) and (max-height: 500px)')
  let frame = 0, timeout = 0, active = false, manual = false, target = 0
  const simple = () => reduced.matches || compact.matches || navigator.connection?.saveData
  const seek = () => {
    if (active && !video.seeking && video.readyState >= 2 && Math.abs(video.currentTime - target) > .035) video.currentTime = target
  }
  const update = () => {
    frame = 0
    if (!active) return
    const distance = Math.max(1, wrapper.offsetHeight - innerHeight)
    const progress = Math.max(0, Math.min(1, -wrapper.getBoundingClientRect().top / distance))
    target = progress * Math.max(0, video.duration - .05)
    bar.style.transform = `scaleX(${progress})`
    seek()
  }
  const schedule = () => { if (active && !frame) frame = requestAnimationFrame(update) }
  const stop = () => {
    active = false; clearTimeout(timeout); cancelAnimationFrame(frame); frame = 0
    video.pause(); video.controls = false
    wrapper.classList.remove('is-scrubbing')
    caption.textContent = 'Imaginez ce que votre pièce peut devenir.'
    video.removeAttribute('src'); video.load()
    button.textContent = 'Voir la transformation'; button.hidden = false
    bar.style.transform = 'scaleX(0)'
  }
  video.addEventListener('seeked', seek)
  video.addEventListener('loadeddata', () => {
    clearTimeout(timeout)
    if (manual || simple() || !Number.isFinite(video.duration) || wrapper.getBoundingClientRect().bottom <= 0) return
    active = true; wrapper.classList.add('is-scrubbing')
    caption.textContent = 'Faites défiler. Votre cuisine prend forme.'
    button.textContent = 'Désactiver l’animation'; button.hidden = false
    update()
  })
  video.addEventListener('error', () => { if (video.getAttribute('src')) { stop(); button.hidden = true } })
  button.addEventListener('click', () => {
    if (active || manual) { manual = false; stop(); return }
    manual = true; video.src = video.dataset.src; video.controls = true
    video.play().then(() => { button.textContent = 'Fermer la vidéo'; caption.textContent = 'Une ambiance à imaginer chez vous.' }).catch(() => { manual = false; stop() })
  })
  const configure = () => {
    manual = false; stop()
    if(compact.matches) button.hidden=true
    if (!simple()) {
      button.hidden = true; video.preload = 'auto'; video.src = video.dataset.src; video.load()
      timeout = setTimeout(() => { if (!active) stop() }, 12000)
    }
  }
  window.addEventListener('scroll', schedule, { passive:true })
  window.addEventListener('resize', schedule, { passive:true })
  reduced.addEventListener('change', configure); compact.addEventListener('change', configure)
  window.addEventListener('pagehide', () => { clearTimeout(timeout); cancelAnimationFrame(frame); video.pause() })
  window.addEventListener('pageshow', event => { if (event.persisted) configure() })
  configure()
}
