// Decode one 32-frame contact sheet once; scroll draws synchronously, without video seeking.
export function initMobileSequence({video,wrapper,button,bar,compact,reduced}) {
  const visual=video.closest('.hero__visual'),hero=wrapper.querySelector('.hero')
  const canvas=document.createElement('canvas')
  canvas.className='mobile-sequence';canvas.setAttribute('aria-hidden','true')
  const hint=document.createElement('span');hint.className='sequence-hint';hint.textContent='Faites défiler. La cuisine prend forme.'
  visual.append(canvas,hint)
  const ctx=canvas.getContext('2d',{alpha:false})
  const sheet=new Image()
  let loading,enabled=false,version=0,raf=0,last=-1,distance=600
  const progress=()=>Math.max(0,Math.min(1,-wrapper.getBoundingClientRect().top/distance))
  const draw=()=>{
    raf=0
    if(!enabled||document.hidden) return
    const p=progress(),index=Math.min(31,Math.floor(p*32))
    bar.style.transform=`scaleX(${p})`
    if(index===last) return
    last=index
    const scale=Math.max(canvas.width/480,canvas.height/480)
    const width=canvas.width/scale,height=canvas.height/scale
    ctx.drawImage(sheet,(index%8)*480+(480-width)/2,Math.floor(index/8)*480+(480-height)/2,width,height,0,0,canvas.width,canvas.height)
  }
  const schedule=()=>{if(enabled&&!raf)raf=requestAnimationFrame(draw)}
  const size=()=>{
    if(!enabled)return
    const r=visual.getBoundingClientRect(),dpr=Math.min(devicePixelRatio||1,2)
    canvas.width=Math.round(r.width*dpr);canvas.height=Math.round(r.height*dpr)
    distance=Math.max(480,r.height*1.5)
    wrapper.style.height=`${hero.offsetHeight+distance}px`
    last=-1;draw()
  }
  const configure=()=>{
    const current=++version
    enabled=false;cancelAnimationFrame(raf);raf=0
    wrapper.classList.remove('is-frame-scrubbing');wrapper.style.removeProperty('height')
    if(!compact.matches||reduced.matches||navigator.connection?.saveData||!ctx)return
    button.hidden=true
    if(!loading){sheet.src='/cuisine-montage-sequence.webp';loading=sheet.decode()}
    loading.then(()=>{
      if(current!==version)return
      enabled=true;last=-1
      wrapper.classList.add('is-frame-scrubbing')
      size()
    }).catch(()=>{loading=null; /* Leave the finished-kitchen poster in place. */})
  }
  window.addEventListener('scroll',schedule,{passive:true})
  // Observe actual element dimensions, not the changing iOS browser toolbar height.
  const observer=new ResizeObserver(()=>{if(enabled)size()})
  observer.observe(visual);observer.observe(hero)
  document.addEventListener('visibilitychange',schedule)
  window.addEventListener('pageshow',schedule)
  return configure
}
