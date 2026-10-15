// Mobile editorial entry points; all sections remain in normal document flow.
export function initMobileShowroom() {
  const discovery=document.createElement('section')
  discovery.className='mobile-discovery'
  discovery.setAttribute('aria-labelledby','mobile-discovery-title')
  discovery.innerHTML=`<div class="container"><p class="label">Votre cuisine, vos possibilités</p><h2 id="mobile-discovery-title">À quoi ressemble<br>votre prochaine cuisine ?</h2><div class="mobile-discovery__list">
    <a href="#projection"><img src="/inspiration-cuisine-naturelle.webp" alt="Cuisine avec îlot et finitions naturelles" width="1254" height="1254" loading="lazy"><span class="mobile-discovery__caption"><span><small>Couleurs, matières et implantations</small><strong>Découvrez les cuisines</strong></span><svg class="ui-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M6 18 18 6M6 6h12v12"/></svg></span></a>
    <a href="#experience-vr"><img src="/experience-vr-flyer.webp" alt="Découverte d’une cuisine en réalité virtuelle avec Jordan" width="1589" height="1391" loading="lazy"><span class="mobile-discovery__caption"><span><small>Une expérience à vivre chez vous</small><strong>Entrez dans votre projet</strong></span><svg class="ui-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M6 18 18 6M6 6h12v12"/></svg></span></a>
  </div></div>`
  document.getElementById('hero-wrapper').after(discovery)
}
