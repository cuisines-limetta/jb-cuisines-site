export function patchService(original) {
  const eol=original.includes('\r\n')?'\r\n':'\n'
  let s=original.replaceAll('\r\n','\n')
  const addedImport="import { managementLink } from './cancellation.js'"
  const anchor="const appointment = await graph.call('/appointments', {"
  const added="\n            ...(process.env.BOOKINGS_OWNER_MANAGEMENT === 'true' ? { serviceNotes: 'Gestion privée Jordan — ne pas transférer : ' + managementLink(body.requestId) } : {}),"
  if(s.includes('managementLink')) {
    // Accept precisely our previous delivery, regardless of the insertion position.
    const line=added.trim()
    if(s.split(addedImport).length!==2||s.split(line).length!==2)throw Error('STRUCTURE_SERVICE_INATTENDUE : lien de gestion existant')
    return original
  }
  if(s.split(anchor).length!==2 || s.includes('serviceNotes:') || !s.includes('body.requestId'))throw Error('STRUCTURE_SERVICE_INATTENDUE ; aucune modification effectuée')
  s=addedImport+'\n'+s.replace(anchor,anchor+added)
  return s.replaceAll('\n',eol)
}
