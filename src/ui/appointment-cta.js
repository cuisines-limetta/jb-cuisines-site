// One real link travels from its hero slot into the persistent header slot.
export function initAppointmentCTA() {
  const button = document.getElementById('appointment-cta')
  const home = document.getElementById('hero-appointment-slot')
  const destination = document.getElementById('nav-appointment-slot')
  if (!button || !home || !destination) return
  const reduced = matchMedia('(prefers-reduced-motion: reduce)')
  const compact = matchMedia('(max-width: 767px), (max-width: 1100px) and (max-height: 500px)')
  const sticky=document.createElement('div')
  destination.removeAttribute('aria-hidden')
  let docked=false,transition
  sticky.className='mobile-appointment'
  const wrapper=document.getElementById('hero-wrapper'),intro=document.getElementById('intro')
  wrapper.after(sticky)
  const arrange=()=>{
    transition?.cancel()
    docked=false;sticky.classList.remove('is-docked')
    const focused=document.activeElement===button
    button.classList.remove('appointment-cta--travelling')
    for(const property of ['left','top','width','height','font-size','transform']) button.style.removeProperty(property)
    if(compact.matches) {
      sticky.append(button)
      sticky.after(intro)
    } else {
      home.append(button)
      document.querySelector('.mobile-discovery')?.after(intro)
    }
    if(focused)button.focus({preventScroll:true})
  }
  arrange()
  let frame = 0
  const update = () => {
    frame = 0
    if(compact.matches) {
      const next=wrapper.getBoundingClientRect().bottom<=66
      if(next===docked)return
      transition?.cancel()
      const from=button.getBoundingClientRect()
      const focused=document.activeElement===button
      docked=next
      sticky.classList.toggle('is-docked',next)
      ;(next?destination:sticky).append(button)
      if(focused)button.focus({preventScroll:true})
      const to=button.getBoundingClientRect()
      if(!reduced.matches && from.bottom>0 && from.top<innerHeight) {
        transition=button.animate([
          {transformOrigin:'top left',transform:`translate(${from.left-to.left}px,${from.top-to.top}px) scale(${from.width/to.width},${from.height/to.height})`},
          {transformOrigin:'top left',transform:'none'}
        ],{duration:240,easing:'cubic-bezier(.2,.7,.2,1)'})
      }
      return
    }
    const progress = reduced.matches ? Number(scrollY >= 220) : Math.max(0,Math.min(1,scrollY/220))
    document.documentElement.style.setProperty('--cta-progress',progress)
    if (!progress) {
      if (button.parentElement !== home) {
        const focused = document.activeElement === button
        home.append(button)
        if (focused) button.focus({preventScroll:true})
      }
      button.classList.remove('appointment-cta--travelling')
      for(const property of ['left','top','width','height','font-size','transform']) button.style.removeProperty(property)
      return
    }
    const start = home.getBoundingClientRect(), end = destination.getBoundingClientRect()
    const mobile = innerWidth <= 767
    const width = mobile ? 150 : innerWidth <= 1100 ? 200 : 220
    const mix = (a,b) => a + (b-a)*progress
    if (button.parentElement !== document.body) {
      const focused = document.activeElement === button
      document.body.append(button)
      if (focused) button.focus({preventScroll:true})
    }
    button.classList.add('appointment-cta--travelling')
    button.style.left = '0px'
    button.style.top = '0px'
    button.style.transform = `translate3d(${mix(start.left,end.right-width)}px,${mix(start.top,end.top)}px,0)`
    button.style.width = `${mix(start.width,width)}px`
    button.style.height = `${mix(start.height,44)}px`
    button.style.fontSize = `${mobile?12:14}px`
  }
  const schedule = () => { if (!frame) frame=requestAnimationFrame(update) }
  window.addEventListener('scroll',schedule,{passive:true})
  compact.addEventListener('change',()=>{arrange();schedule()})
  window.addEventListener('resize',schedule,{passive:true})
  window.visualViewport?.addEventListener('resize',schedule,{passive:true})
  reduced.addEventListener('change',schedule)
  // Header size changes with the logo; observe it to avoid a one-frame mismatch.
  const observer = new ResizeObserver(schedule)
  observer.observe(home)
  document.fonts?.ready.then(schedule)
  window.addEventListener('pageshow',schedule)
  update()
}
