import fs from 'node:fs'
import path from 'node:path'
import {execFileSync} from 'node:child_process'
import {transform} from './patch.mjs'
const p=JSON.parse(fs.readFileSync(new URL('./payload.json',import.meta.url),'utf8'))
const root=fs.realpathSync('.')
function safe(n){const f=path.resolve(root,n);if(!f.startsWith(root+path.sep))throw Error('CHEMIN_HORS_SITE');for(let a=f;a!==root;a=path.dirname(a))if(fs.existsSync(a)&&fs.lstatSync(a).isSymbolicLink())throw Error('LIEN_SYMBOLIQUE : '+n);return f}
const read=(n,optional=false)=>optional&&!fs.existsSync(safe(n))?'':fs.readFileSync(safe(n),'utf8').replaceAll('\r\n','\n')
if(JSON.parse(read('package.json')).name!=='cuisines-limetta')throw Error('Lancer depuis le dossier du site')
const files=transform(read,p)
if(!process.argv.includes('--apply')){console.log('Contrôles OK. Aucune modification.');process.exit(0)}
const backup=safe('.booking-state/booking-dark-'+Date.now()),stage=safe('.booking-dark-build-'+Date.now()),dist=safe('dist')
fs.mkdirSync(backup,{recursive:true,mode:0o700})
const manifest=Object.keys(files).map(name=>({name,exists:fs.existsSync(safe(name))}))
for(const m of manifest)if(m.exists){const f=path.join(backup,m.name);fs.mkdirSync(path.dirname(f),{recursive:true});fs.copyFileSync(safe(m.name),f)}
fs.writeFileSync(path.join(backup,'manifest.json'),JSON.stringify(manifest,null,2))
let moved=false,published=false
try{
  for(const[n,s]of Object.entries(files)){fs.mkdirSync(path.dirname(safe(n)),{recursive:true});fs.writeFileSync(safe(n),s)}
  for(const n of Object.keys(files).filter(n=>n.endsWith('.js')))execFileSync(process.execPath,['--check',n],{stdio:'inherit'})
  execFileSync(process.execPath,['node_modules/vite/bin/vite.js','build','--outDir',stage],{stdio:'inherit'})
  for(const n of ['index.html','rendez-vous.html'])if(!fs.existsSync(path.join(stage,n)))throw Error('COMPILATION_INCOMPLETE : '+n)
  if(fs.existsSync(dist)){fs.cpSync(dist,stage,{recursive:true,force:false,errorOnExist:false});fs.renameSync(dist,path.join(backup,'dist'));moved=true}
  fs.renameSync(stage,dist);published=true
  console.log('MODE SOMBRE RDV 20261031 INSTALLÉ. Sauvegarde : '+backup)
  console.log('Redémarrez le site Node.js dans Infomaniak. Rechargez /rdv et vérifiez le bouton Mode sombre. Aucun réglage .env modifié.')
}catch(error){
  for(const m of manifest){if(m.exists)fs.copyFileSync(path.join(backup,m.name),safe(m.name));else if(fs.existsSync(safe(m.name)))fs.unlinkSync(safe(m.name))}
  if(moved&&!published&&!fs.existsSync(dist))fs.renameSync(path.join(backup,'dist'),dist)
  throw error
}
