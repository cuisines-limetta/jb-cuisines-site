// Motion supports the visit: reveal each group once, keep the VR image gently in view.
export function initExperienceMotion() {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)')
  const touch = matchMedia('(hover: none), (pointer: coarse)')
  const elements = [...document.querySelectorAll('.promise-strip>*, .about__visual, .about__content, .vr-intro, .vr-features article, .projection__copy, .ambiance-preview, .section-header, .inspiration-card, .quality-heading, .quality-grid article, .project-steps li, .contact__info')]
  const running = new Set()
  let observer, frame = 0
  const scene = document.querySelector('.vr-scene')
  const update = () => {
    frame = 0
    if (!scene || reduced.matches || innerWidth < 768) return
    const rect = scene.getBoundingClientRect()
    if (rect.bottom < 0 || rect.top > innerHeight) return
    const progress = Math.max(-1,Math.min(1,(rect.top+rect.height/2-innerHeight/2)/innerHeight))
    scene.style.setProperty('--image-shift',`${progress*24}px`)
  }
  const scroll = () => { if (!frame && !reduced.matches) frame=requestAnimationFrame(update) }
  const configure = () => {
    observer?.disconnect()
    running.forEach(animation=>animation.cancel()); running.clear()
    cancelAnimationFrame(frame); frame=0
    scene?.style.removeProperty('--image-shift')
    if (reduced.matches || touch.matches || !('IntersectionObserver' in window)) return
    observer = new IntersectionObserver(entries=>{
      entries.forEach((entry,index)=>{
        if (!entry.isIntersecting) return
        observer.unobserve(entry.target)
        if (entry.target.dataset.motionSeen) return
        entry.target.dataset.motionSeen='true'
        const animation=entry.target.animate([{transform:'translateY(16px)'},{transform:'translateY(0)'}],{duration:760,delay:Math.min(index,3)*75,easing:'cubic-bezier(.16,1,.3,1)',fill:'backwards'})
        running.add(animation)
        animation.finished.then(()=>running.delete(animation)).catch(()=>running.delete(animation))
      })
    },{threshold:.12})
    elements.forEach(element=>observer.observe(element))
    update()
  }
  window.addEventListener('scroll',scroll,{passive:true})
  window.addEventListener('resize',scroll,{passive:true})
  reduced.addEventListener('change',configure)
  touch.addEventListener('change',configure)
  configure()
}
