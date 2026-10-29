import {test} from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import {patchBookingService} from './patch.mjs'
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
