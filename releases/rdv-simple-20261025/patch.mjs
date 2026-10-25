export function transform(read, p) {
  const files = {}
  const once = (s, re, replacement) => {
    if ([...s.matchAll(new RegExp(re.source, 'g'))].length !== 1) throw Error('REPERE_INATTENDU : ' + re.source)
    return s.replace(re, () => replacement)
  }
  let h = read('rendez-vous.html')
  h = h.replace(/\s*<!-- LIMETTA_BOOKING_INTRO_START -->[\s\S]*?<!-- LIMETTA_BOOKING_INTRO_END -->/, '')
    .replace(/\s*<button\b[^>]*data-intro-replay[^>]*>[\s\S]*?<\/button>/, '')
    .replace(/\s*<aside\b[^>]*class="booking-vr"[^>]*>[\s\S]*?<\/aside>/, '')
    .replace(/\s*<link\b[^>]*href="\/styles\/booking-intro.css"[^>]*>/, '')
  if (!h.includes('id="booking-next"')) {
    h = once(h, /[ \t]*<label for="booking-date">[^<]*<\/label>\s*/, p.controls)
    h = h.replace(/(<p id="booking-status"[^>]*>)[\s\S]*?(<\/p>)/, '$1Recherche des prochains créneaux…$2')
    h = once(h, /<div id="booking-slots"[^>]*><\/div>/, '<div id="booking-slots" class="slots booking-days" aria-label="Créneaux disponibles"></div>\n' + p.buttons)
  }
  h = h.replace(/(<h2 id="calendrier-titre"[^>]*>[\s\S]*?<\/h2>\s*<p class="hint">)[\s\S]*?(<\/p>)/, '$1Étude 3D et devis gratuits, sans engagement.$2')
  if (h.includes('booking-intro-replay') || h.includes('class="booking-vr"') || h.includes('id="booking-intro"') || !h.includes('data-period="morning"')) throw Error('Structure RDV inattendue')
  files['rendez-vous.html'] = h
  let b = read('src/ui/booking.js')
  b = b.replace(/^import[^\n]*from ['"]\.\/booking-intro.js['"]\s*;?\n/m, '').replace(/^initBookingIntro\([^\n]*\)\s*;?\n/m, '')
  if (!b.includes("from './slot-picker.js'")) {
    b = "import { initSlotPicker } from './slot-picker.js'\n" + b
    b = b.replace(/, controller\b/g, '')
    b = once(b, /function lock\(value\) \{/, 'function lock(value) {\n  picker.setLocked(value)')
    b = once(b, /date.addEventListener\('change',[\s\S]*?(?=form.addEventListener\('submit')/, p.init)
    b = once(b, /date.value = ''/, 'picker.refresh()')
  }
  if (b.includes('initBookingIntro') || !b.includes('picker.setLocked(value)') || !b.includes('picker.refresh()')) throw Error('Module RDV inattendu')
  files['src/ui/booking.js'] = b
  const oldPicker = read('src/ui/slot-picker.js', true)
  if (oldPicker && oldPicker !== p.picker) throw Error('Module de créneaux déjà modifié')
  files['src/ui/slot-picker.js'] = p.picker
  const append = (name, marker, content) => { const s=read(name); files[name]=s.includes(marker)?s:s+'\n'+marker+content }
  append('styles/rendez-vous.css', '/* Recherche de disponibilités par semaine. */', p.rdvCSS)
  append('styles/tunnel.css', '@media(max-width:767px){.tunnel-mobile-cta', p.tunnelCSS)
  append('styles/vr-scroll.css', '@media(max-width:767px){:root .vr-scroll-enabled .hero__note', p.vrCSS)
  files['index.html'] = read('index.html').replaceAll('/rdv?parcours=1','/rdv#reservation')
  let t=read('src/ui/tunnel.js').replaceAll('/rdv?parcours=1','/rdv#reservation')
  if (!t.includes('<small>Étude 3D et devis gratuits, sans engagement.</small>')) t=once(t,/bar.innerHTML='[^\n]*'/, "bar.innerHTML='<a class=\"btn btn--primary\" href=\"/rdv#reservation\" data-track-location=\"navigation\">Choisir mon rendez-vous</a><small>Étude 3D et devis gratuits, sans engagement.</small>'")
  files['src/ui/tunnel.js']=t
  return files
}
