export function transform(read,p){
 const files={};
 function change(name,before,after){let s=files[name]??read(name);if(!s.includes(after)){if(s.split(before).length!==2)throw Error('Code à vérifier : '+name+' ; aucune modification effectuée');s=s.replace(before,after)}files[name]=s}
 const picker=read('src/ui/slot-picker.js').trim();
 if(picker!==p.before&&picker!==p.picker)throw Error('Calendrier modifié ; aucune modification effectuée');
 files['src/ui/slot-picker.js']=p.picker+'\n';
 for(const [name,data] of [['booking/availability-range.js',p.module],['confidentialite.html',p.privacy]]){const old=read(name,true);if(old&&old.trim()!==data.trim())throw Error('Fichier déjà présent et différent : '+name);files[name]=data}
 change('booking/service.js',"import { managementLink }", "import { createAvailabilityRange } from './availability-range.js'\nimport { managementLink }");
 change('booking/service.js','  return {\n    async availability(date)', '  return {\n    availabilityRange: createAvailabilityRange(graph, ledger, secret, now),\n    async availability(date)');
 change('booking/router.js',"  router.get('/availability',", "  router.get('/availability-range', async (req, res) => {\n    try { res.json(await getService().availabilityRange(req.query.date, req.query.seek === '1')) } catch (error) { failure(error, res) }\n  })\n  router.get('/availability',");
 let vite=read('vite.config.js');if(!vite.includes("'confidentialite.html'")){const line=vite.match(/^.*rendezVous:.*resolve\(__dirname, 'rendez-vous.html'\),.*$/m)?.[0];if(!line)throw Error('Configuration Vite différente');vite=vite.replace(line,line+"\n        confidentialite: resolve(__dirname, 'confidentialite.html'),")}files['vite.config.js']=vite;
 let html=read('rendez-vous.html');
 if(!html.includes(p.notice)){if(html.includes('booking-privacy')||html.includes('marketing-consent'))throw Error('Notice du formulaire déjà modifiée');const marker='          <div class="booking-review">';if(html.split(marker).length!==2)throw Error('Formulaire différent');html=html.replace(marker,p.notice+'\n'+marker)}
 files['rendez-vous.html']=html;
 return files;
}
