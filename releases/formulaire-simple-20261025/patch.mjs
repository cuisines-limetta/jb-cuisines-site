function once(s,a,b,name){if(s.split(a).length!==2)throw Error('Code à vérifier : '+name+' ; aucune modification effectuée');return s.replace(a,b)}
export function transform(read,p){
 let html=read('rendez-vous.html'),js=read('src/ui/booking.js'),css=read('styles/rendez-vous.css')
 if(!html.includes('class="booking-note-toggle"')){
  html=once(html,'          <p id="selected-slot">Choisissez d’abord votre créneau.</p>\n','','récapitulatif')
  html=once(html,p.oldPreference,'','ambiance')
  html=once(html,p.oldNotes,p.notes,'précisions')
  html=once(html,'          <button id="booking-submit"',p.review+'\n          <button id="booking-submit"','bouton')
 }
 if(!html.includes(p.notes)||!html.includes(p.review)||html.includes('id="preferred-ambiance"')||html.split('id="selected-slot"').length!==2)throw Error('Formulaire inattendu ; aucune modification effectuée')
 const oldImport='import { initBookingPreference, bookingNotes }',newImport='import { bookingNotes }'
 if(js.includes(oldImport)){js=once(js,oldImport,newImport,'import');js=once(js,'initBookingPreference()\n','','initialisation')}
 if(!js.includes(newImport)||js.includes('initBookingPreference()'))throw Error('Initialisation à vérifier ; aucune modification effectuée')
 if(css.includes('/* LIMETTA_BOOKING_FORM_SIMPLE_V1 */')&&!css.includes(p.css))throw Error('Styles à vérifier ; aucune modification effectuée')
 if(!css.includes(p.css))css=css.trimEnd()+'\n\n'+p.css
 return {'rendez-vous.html':html,'src/ui/booking.js':js,'styles/rendez-vous.css':css}
}
