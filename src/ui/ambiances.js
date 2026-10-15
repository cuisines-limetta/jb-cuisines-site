const AMBIANCES = {
  bleu: { src:'/cuisine-bleue-apres.webp', alt:'Cuisine aux façades bleu profond avec un plan de travail clair', description:'Façades bleu profond, plan clair et touches de bois.' },
  noyer: { src:'/ambiance-noyer.webp', alt:'Cuisine aux façades aspect noyer avec un plan beige et des poignées bronze', description:'Façades aspect noyer, plan beige et poignées bronze.' },
  blanc: { src:'/ambiance-blanc.webp', alt:'Cuisine blanche avec un plan de travail aspect chêne clair et des poignées noires', description:'Façades blanches, plan aspect chêne clair et poignées noires.' },
  terracotta: { src:'/ambiance-terracotta.webp', alt:'Cuisine terracotta avec un plan blanc et des poignées dorées', description:'Façades terracotta, plan blanc et poignées dorées.' }
}
export function initAmbiances() {
  const buttons = [...document.querySelectorAll('[data-ambiance]')]
  const image = document.getElementById('ambiance-image')
  const wrap = document.getElementById('ambiance-image-wrap')
  const description = document.getElementById('ambiance-description')
  if (!image || !wrap || !description) return
  let request = 0, animation
  const reduced = matchMedia('(prefers-reduced-motion: reduce)')
  const select = async key => {
    const choice = AMBIANCES[key]
    if (!choice) return
    const current = ++request
    wrap.setAttribute('aria-busy','true')
    try {
      const preload = new Image(); preload.src = choice.src
      await preload.decode()
      if (current !== request) return
      animation?.cancel()
      image.src = choice.src; image.alt = choice.alt
      description.textContent = choice.description
      buttons.forEach(button => {
        const selected = button.dataset.ambiance === key
        button.classList.toggle('is-selected',selected)
        button.setAttribute('aria-pressed',String(selected))
      })
      if (!reduced.matches) animation = image.animate([{opacity:.3,transform:'scale(1.025)'},{opacity:1,transform:'scale(1)'}],{duration:480,easing:'cubic-bezier(.2,.7,.2,1)'})
    } catch {
      if (current === request) description.textContent = 'Ce visuel n’a pas pu se charger. Réessayez en sélectionnant cette ambiance.'
    } finally { if (current === request) wrap.setAttribute('aria-busy','false') }
  }
  buttons.forEach((button,index) => {
    button.addEventListener('click',()=>select(button.dataset.ambiance))
    button.addEventListener('keydown',event=>{
      if (!['ArrowRight','ArrowLeft','Home','End'].includes(event.key)) return
      event.preventDefault()
      const next=event.key==='Home'?0:event.key==='End'?buttons.length-1:(index+(event.key==='ArrowRight'?1:-1)+buttons.length)%buttons.length
      buttons[next].focus(); select(buttons[next].dataset.ambiance)
    })
  })
}
