import {createHash} from 'node:crypto'
const norm=s=>s.replaceAll('\r\n','\n').trim()
export function patchBookingUI(source){
  let s=source.replaceAll('\r\n','\n')
  const header="import * as campaignTracking from './source-consent.js'"
  const fields=' projectCity: city.trim(), attribution: campaignTracking.getBookingAttribution(), advertisingConsent: campaignTracking.getAdvertisingConsent(),'
  const event='    campaignTracking.trackConfirmedBooking(data.advertisingEventId, payload.advertisingConsent)'
  if(s.includes(header)){
    if(!s.includes(fields)||!s.includes(event))throw Error('SUIVI_PARTIEL : src/ui/booking.js')
    return s
  }
  if(/getBookingAttribution|advertisingConsent|trackConfirmedBooking/.test(s))throw Error('SUIVI_PARTIEL : src/ui/booking.js')
  const payload=/const payload\s*=\s*\{\s*\.\.\.customer,/g
  const confirmed=/if\s*\(!data\.confirmed\)\s*throw new Error\(['"]unconfirmed['"]\);?/g
  if([...s.matchAll(payload)].length!==1||[...s.matchAll(confirmed)].length!==1||!s.includes('postalCode, city, ...customer'))throw Error('STRUCTURE_INATTENDUE : src/ui/booking.js')
  s=s.replace(payload,match=>match+fields).replace(confirmed,match=>match+'\n'+event)
  return header+'\n'+s
}
export function patchBookingService(source){
  let s=source.replaceAll('\r\n','\n')
  function one(a,b){if(s.includes(b))return;if(s.split(a).length!==2)throw Error('STRUCTURE_INATTENDUE : booking/service.js ; aucune modification effectuée');s=s.replace(a,b)}
  // Only add attribution metadata. Keep the installed calendar, mail and Graph settings.
  for(const line of ["import { cleanChoice } from '../src/utils/privacy-choice.js'", "import { acquisitionDraft } from './acquisition.js'", "import { randomUUID as createAdvertisingId } from 'node:crypto'"])if(!s.includes(line))s=line+'\n'+s
  one('      const selected = unseal(body.slotId)', '      const advertisingConsent = cleanChoice(body.advertisingConsent, now())\n      const selected = unseal(body.slotId)')
  one("if (previous.state === 'confirmed') return { confirmed: true, start: new Date(selected.start).toISOString() }", "if (previous.state === 'confirmed') return { confirmed: true, start: new Date(selected.start).toISOString(), ...(advertisingConsent?.advertising && previous.advertisingConsent?.advertising && previous.advertisingEventId ? { advertisingEventId: previous.advertisingEventId } : {}) }")
  if(!s.includes('acquisition: acquisitionDraft(body, customer, slot.start, now()),'))one('tx.reserve(body.requestId, {','tx.reserve(body.requestId, { acquisition: acquisitionDraft(body, customer, slot.start, now()),')
  one('        tx.reserve(body.requestId, {','        const advertisingEventId = createAdvertisingId()\n        tx.reserve(body.requestId, { advertisingEventId, advertisingConsent: advertisingConsent?.advertising ? advertisingConsent : null,')
  one('return { confirmed: true, start: new Date(slot.start).toISOString() }','return { confirmed: true, start: new Date(slot.start).toISOString(), ...(advertisingConsent?.advertising ? { advertisingEventId } : {}) }')
  return s
}
export function transform(read,p){
  const files={},errors=[]
  for(const [n,s] of Object.entries(p.files)){
    try {
    const old=norm(read(n,true)),hash=createHash('sha256').update(old).digest('hex')
    if(n==='booking/service.js'&&old!==norm(s)){files[n]=patchBookingService(old)+'\n';continue}
    if(n==='src/ui/booking.js'&&old!==norm(s)&&!p.before[n].includes(hash)){files[n]=patchBookingUI(old)+'\n';continue}
    if(old!==norm(s)&&!p.before[n].includes(old===''?'':hash))throw Error('FICHIER_MODIFIE : '+n+' ; aucune modification effectuée')
    files[n]=s+'\n'
    }catch(error){errors.push(error.message)}
  }
  if(errors.length)throw Error('Contrôle complet des fichiers :\n'+errors.join('\n')+'\nAucune modification effectuée.')
  function one(s,a,b,n){if(s.includes(b))return s;if(s.split(a).length!==2)throw Error('STRUCTURE_INATTENDUE : '+n);return s.replace(a,b)}
  let s=read('server.js')
  if(!s.includes('installVisualEditor(app'))throw Error('EDITEUR_ABSENT')
  if(!s.includes("import { installPrivacy }"))s="import { installPrivacy } from './booking/privacy.js'\n"+s
  s=one(s,'installCalendarRoute(app)','installPrivacy(app, {root:__dirname})\ninstallCalendarRoute(app)','server.js')
  s=s.replace("res.redirect(301, '/rdv'))", "res.redirect(301, '/rdv' + (req.originalUrl.includes('?') ? req.originalUrl.slice(req.originalUrl.indexOf('?')) : '')))")
  files['server.js']=s
  s=read('index.html')
  s=s.replace(/\s*<script async src="https:\/\/www.googletagmanager.com\/gtag\/js\?id=G-07FH3DK7GN"><\/script>/g,'').replace(/\s*<script>window.dataLayer=window.dataLayer\|\|\[\];function gtag\(\)\{dataLayer.push\(arguments\);\}gtag\('js',new Date\(\)\);gtag\('config','G-07FH3DK7GN'\);<\/script>/g,'')
  if(/googletagmanager|google-analytics|facebook.com\/tr|fbq\(/.test(s))throw Error('TRACEUR_INATTENDU : index.html')
  files['index.html']=s
  s=read('vite.config.js')
  for(const [key,file]of [['metaPixel','meta-pixel.html'],['acquisition','suivi-campagnes.html']])if(!s.includes("'"+file+"'"))s=one(s,'input: {','input: {\n        '+key+": resolve(__dirname, '"+file+"'),",'vite.config.js')
  files['vite.config.js']=s
  return files
}
