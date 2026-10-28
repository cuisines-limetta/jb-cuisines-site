import fs from 'node:fs'
import path from 'node:path'
import { execFileSync } from 'node:child_process'
import { transform } from './patch.mjs'
const p=JSON.parse(fs.readFileSync(new URL('./payload.json',import.meta.url),'utf8'))
const root=fs.realpathSync('.')
if(JSON.parse(fs.readFileSync('package.json')).name!=='cuisines-limetta') throw Error('Lancer depuis le dossier du site')
function safe(name){const f=path.resolve(root,name);if(!f.startsWith(root+path.sep))throw Error('Chemin incorrect');for(let a=f;a!==root;a=path.dirname(a))if(fs.existsSync(a)&&fs.lstatSync(a).isSymbolicLink())throw Error('Lien symbolique : '+name);return f}
const read=(n,optional=false)=>optional&&!fs.existsSync(safe(n))?'':fs.readFileSync(safe(n),'utf8').replace(/\r\n/g,'\n').replace(/^\uFEFF/,'')
const files=transform(read,p)
if(!process.argv.includes('--apply')){console.log('Contrôles OK. Aucune modification.');process.exit(0)}
const id=Date.now(), backup=safe('.booking-state/rdv-rapide-confidentialite-'+id), stage=safe('.rapide-build-'+id), dist=safe('dist')
fs.mkdirSync(backup,{recursive:true})
const manifest=Object.keys(files).map(name=>({name,exists:fs.existsSync(safe(name))}))
for(const m of manifest)if(m.exists){const b=path.join(backup,m.name);fs.mkdirSync(path.dirname(b),{recursive:true});fs.copyFileSync(safe(m.name),b)}
fs.writeFileSync(path.join(backup,'manifest.json'),JSON.stringify(manifest,null,2))
let moved=false
try {
  for(const [n,s] of Object.entries(files)){fs.mkdirSync(path.dirname(safe(n)),{recursive:true});fs.writeFileSync(safe(n),s)}
  for(const n of ['src/ui/booking.js','src/ui/slot-picker.js','booking/availability-range.js','booking/service.js','booking/router.js'])execFileSync(process.execPath,['--check',n],{stdio:'inherit'})
  execFileSync(process.execPath,['node_modules/vite/bin/vite.js','build','--outDir',stage],{stdio:'inherit'})
  const html=fs.readFileSync(path.join(stage,'rendez-vous.html'),'utf8'), home=fs.readFileSync(path.join(stage,'index.html'),'utf8')
  if(!html.includes('id="booking-next"')||!html.includes('data-period="afternoon"')||html.includes('booking-intro-replay')||html.includes('class="booking-vr"')||html.includes('créneaux fictifs'))throw Error('Vérification réservation échouée')
  if(html.includes('id="preferred-ambiance"')||!html.includes('class="booking-note-toggle"')||!html.includes('class="booking-review"')||html.indexOf('id="selected-slot"')>html.indexOf('id="booking-submit"'))throw Error('Formulaire compilé incorrect')
  if(!html.includes('id="booking-form-title"')||!home.includes('Prévoyez environ 2 heures')||!html.includes('Prévoyez environ 2 heures'))throw Error('Parcours compilé incorrect')
  if(!html.includes('id="booking-previous"')||!html.includes('id="booking-range"')||!html.includes('booking-slot-contact')||!html.includes('Pas besoin d’avoir déjà un plan'))throw Error('Calendrier compilé incorrect')
  const entry=html.match(/src="([^"]*assets\/rendezVous-[^"]+\.js)"/)?.[1]
  if(!entry||!fs.readFileSync(path.join(stage,entry.replace(/^\//,'')),'utf8').includes('recherche des disponibilités'))throw Error('Orbe absente de la compilation')
  if(!fs.readFileSync(path.join(stage,entry.replace(/^\//,'')),'utf8').includes('.finished.catch('))throw Error('Transition absente de la compilation')
  if(!html.includes('id="booking-choice-summary"')||!html.includes('3 jours suivants')||!html.includes('booking-required'))throw Error('Nouveau calendrier absent');
  const privacy=fs.readFileSync(path.join(stage,'confidentialite.html'),'utf8');
  if(!html.includes('/confidentialite.html')||html.includes('id="marketing-consent"')||privacy.includes('privacy-draft')||!privacy.includes('130 763 816'))throw Error('Notice de confidentialité incorrecte');
  if(!home.includes('vr-scroll-video')||!home.includes('visual-editor-'))throw Error('Vérification accueil échouée')
  if(fs.existsSync(dist)){fs.cpSync(dist,stage,{recursive:true,force:false,errorOnExist:false});fs.renameSync(dist,path.join(backup,'dist'));moved=true}
  fs.renameSync(stage,dist)
  console.log('FICHIERS INSTALLÉS — REDÉMARRAGE NODE.JS NÉCESSAIRE. Sauvegarde : '+backup)
  console.log('Redémarrez le site Node.js depuis Infomaniak, puis actualisez avec Ctrl + F5.')
} catch(error) {
  for(const m of manifest){if(m.exists)fs.copyFileSync(path.join(backup,m.name),safe(m.name));else if(fs.existsSync(safe(m.name)))fs.unlinkSync(safe(m.name))}
  if(moved&&!fs.existsSync(dist))fs.renameSync(path.join(backup,'dist'),dist)
  throw error
}
