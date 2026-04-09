// Scroll-scrubbing par canvas — extraction des frames en tâche de fond

const CAPTURE_SCALE = 0.5    // résolution à 50% (960×540 pour du 1080p)
const CAPTURE_INTERVAL = 50  // ms entre captures (à 2× vitesse = 10fps vidéo effectifs)
const VIDEO_SRC = '/Je_veux_que_lamnagement_intrie_Kling_30__14193.mp4'

export function initScrollVideo() {
  const heroVideo  = document.getElementById('hero-video')
  const heroCanvas = document.getElementById('hero-canvas')
  const wrapper    = document.getElementById('hero-wrapper')
  const loadingEl  = document.getElementById('hero-loading')
  const loadingBar = document.getElementById('hero-loading-bar')
  const content    = document.querySelector('.hero__content')
  const scrollBtn  = document.getElementById('scroll-down')

  if (!heroVideo || !heroCanvas || !wrapper) return

  const ctx = heroCanvas.getContext('2d')

  // Lance l'extraction en arrière-plan pendant que la vidéo tourne
  extractFrames(VIDEO_SRC, CAPTURE_SCALE, CAPTURE_INTERVAL, (progress) => {
    if (loadingBar) loadingBar.style.width = `${progress * 100}%`
  }).then((frames) => {
    if (!frames.length) return

    // Dimensionner le canvas à la taille affichée
    heroCanvas.width  = frames[0].width
    heroCanvas.height = frames[0].height

    // Fade-in canvas, fade-out vidéo + indicateur
    heroVideo.style.opacity  = '0'
    heroCanvas.classList.add('ready')
    if (loadingEl) loadingEl.style.opacity = '0'

    // Dessiner la première frame
    ctx.drawImage(frames[0], 0, 0)

    // Activer le scroll-scrubbing
    initScrubbing(frames, ctx, wrapper, content, scrollBtn)
  })
}

// ─── Étapes du projet ────────────────────────────────────────────────────────
// Chaque étape apparaît au seuil de progression défini (0→1)

const STEPS = [
  { progress: 0.30 },
  { progress: 0.47 },
  { progress: 0.64 },
  { progress: 0.81 },
]

function initSteps() {
  const stepEls    = document.querySelectorAll('.hero-step')
  const dotEls     = document.querySelectorAll('.hero-steps-progress__dot')
  let lastActive   = -1

  return (progress) => {
    // Index de la dernière étape atteinte (-1 si aucune)
    let active = -1
    for (let i = 0; i < STEPS.length; i++) {
      if (progress >= STEPS[i].progress) active = i
    }

    if (active === lastActive) return

    // Animation sortante sur l'étape précédente
    if (lastActive >= 0 && lastActive < stepEls.length) {
      const prev = stepEls[lastActive]
      prev.classList.remove('active')
      prev.classList.add('leaving')
      setTimeout(() => prev.classList.remove('leaving'), 450)
    }

    lastActive = active

    // Afficher uniquement l'étape active
    stepEls.forEach((el, i) => {
      if (i === active) {
        el.classList.add('active')
      } else {
        el.classList.remove('active')
      }
    })

    // Mettre à jour les pastilles de progression
    dotEls.forEach((dot, i) => {
      dot.classList.toggle('done',   i < active)
      dot.classList.toggle('active', i === active)
    })
  }
}

// ─── Scrubbing ──────────────────────────────────────────────────────────────

function initScrubbing(frames, ctx, wrapper, content, scrollBtn) {
  let ticking    = false
  let scrollable = wrapper.offsetHeight - window.innerHeight
  const updateSteps = initSteps()

  const getProgress = () => Math.max(0, Math.min(1, window.scrollY / scrollable))

  const update = () => {
    const progress   = getProgress()
    const frameIndex = Math.min(Math.round(progress * (frames.length - 1)), frames.length - 1)

    // Dessin GPU-accéléré : simplement blitter l'ImageBitmap sur le canvas
    ctx.drawImage(frames[frameIndex], 0, 0)

    if (content) {
      const o = Math.max(0, 1 - progress * 4)
      content.style.opacity   = o
      content.style.transform = `translateY(${-progress * 40}px)`
    }
    if (scrollBtn) {
      scrollBtn.style.opacity = Math.max(0, 1 - progress * 8)
    }

    // Mise à jour des étapes (ne touche le DOM que si ça change)
    updateSteps(progress)

    ticking = false
  }

  const onScroll = () => {
    if (!ticking) {
      requestAnimationFrame(update)
      ticking = true
    }
  }

  window.addEventListener('resize', () => {
    scrollable = wrapper.offsetHeight - window.innerHeight
  }, { passive: true })

  window.addEventListener('scroll', onScroll, { passive: true })
  update()
}

// ─── Extraction ──────────────────────────────────────────────────────────────
// Lance une vidéo cachée à 2× la vitesse et capture une ImageBitmap tous les
// CAPTURE_INTERVAL ms. Résultat : ~15s d'attente pour 30s de vidéo.

function extractFrames(src, scale, intervalMs, onProgress) {
  return new Promise((resolve) => {
    // Canvas de capture interne (hors DOM)
    const cap    = document.createElement('canvas')
    const capCtx = cap.getContext('2d')

    // Vidéo d'extraction cachée, indépendante de celle affichée
    const vid = document.createElement('video')
    vid.muted         = true
    vid.playbackRate  = 2    // 2× pour aller plus vite
    vid.playsInline   = true
    vid.preload       = 'auto'
    vid.src           = src

    const frames = []
    let captureId = null

    const capture = async () => {
      if (vid.readyState < 2) return
      capCtx.drawImage(vid, 0, 0, cap.width, cap.height)
      try {
        // ImageBitmap = copie GPU, drawImage ultra-rapide
        const bmp = await createImageBitmap(cap)
        frames.push(bmp)
      } catch (_) { /* ignore */ }

      if (onProgress && vid.duration) {
        onProgress(vid.currentTime / vid.duration)
      }
    }

    vid.addEventListener('loadedmetadata', () => {
      cap.width  = Math.round(vid.videoWidth  * scale)
      cap.height = Math.round(vid.videoHeight * scale)
      captureId  = setInterval(capture, intervalMs)
      vid.play().catch(() => {})
    }, { once: true })

    vid.addEventListener('ended', async () => {
      clearInterval(captureId)
      // Capturer la dernière frame
      await capture()
      if (onProgress) onProgress(1)
      resolve(frames)
    }, { once: true })

    // Fallback si la vidéo ne se termine pas
    vid.addEventListener('error', () => {
      clearInterval(captureId)
      resolve(frames)
    }, { once: true })
  })
}
