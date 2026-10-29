import {test} from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import {patchBookingService,patchBookingUI,transform} from './patch.mjs'
const old=JSON.parse(fs.readFileSync(new URL('../annulation-20261025/payload.json',import.meta.url),'utf8')).files['booking/service.js']
test('adds tracking without changing installed Graph or mail settings; repeatable',()=>{
  const customized=old.replace('serviceName: s.displayName,',"serviceName: s.displayName + '', // preserved customization")
  const next=patchBookingService(customized)
  assert.ok(next.includes("serviceName: s.displayName + '', // preserved customization"))
  assert.ok(next.includes('optOutOfCustomerEmail: Boolean(mailer)'))
  assert.ok(next.includes('acquisition: acquisitionDraft(body, customer, slot.start, now()),'))
  assert.ok(next.includes('previous.advertisingEventId'))
  assert.equal(patchBookingService(next),next)
})
test('unknown booking structure still stops the release before writes',()=>{
  assert.throws(()=>patchBookingService(old.replace('const selected = unseal(body.slotId)','const selected = changed(body.slotId)')),/STRUCTURE_INATTENDUE/)
})
const payload=JSON.parse(fs.readFileSync(new URL('./payload.json',import.meta.url),'utf8'))
const ui=payload.files['src/ui/booking.js'].replace("import { getBookingAttribution, getAdvertisingConsent, trackConfirmedBooking } from './source-consent.js'\n",'').replace('projectCity: city.trim(), attribution: getBookingAttribution(), advertisingConsent: getAdvertisingConsent(), ','').replace('    trackConfirmedBooking(data.advertisingEventId, payload.advertisingConsent)\n','')
test('UI patch preserves installed behavior and sends only after confirmed response',()=>{
  const custom=ui.replace("'Vérification du créneau et réservation…'","'Texte personnalisé conservé'")
  const next=patchBookingUI(custom)
  assert.ok(next.includes("'Texte personnalisé conservé'"))
  assert.equal(patchBookingUI(next),next)
  assert.equal(next.split('campaignTracking.trackConfirmedBooking(').length-1,1)
  assert.ok(next.indexOf('campaignTracking.trackConfirmedBooking(')>next.indexOf("if (!data.confirmed) throw new Error('unconfirmed')"))
  assert.ok(next.includes('if (submitting || !chosen || !form.reportValidity()) return'))
})
test('UI patch rejects ambiguous success and partial tracking',()=>{
  assert.throws(()=>patchBookingUI(ui.replace("if (!data.confirmed) throw new Error('unconfirmed')",'')),/STRUCTURE_INATTENDUE/)
  assert.throws(()=>patchBookingUI(ui+'\n// advertisingConsent'),/SUIVI_PARTIEL/)
})
test('preflight reports all incompatible files together without writes',()=>{
  assert.throws(()=>transform(name=>['src/ui/booking.js','confidentialite.html'].includes(name)?'unknown':payload.files[name]||'',payload),e=>e.message.includes('src/ui/booking.js')&&e.message.includes('confidentialite.html'))
})
