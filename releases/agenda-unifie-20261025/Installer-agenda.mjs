import fs from 'node:fs'
import path from 'node:path'
import {execFileSync} from 'node:child_process'
import {createRequire} from 'node:module'
import {patch,normalize} from './patch.mjs'
const {changes,files}=JSON.parse(fs.readFileSync(new URL('./payload.json',import.meta.url),'utf8'))
const root=fs.realpathSync('.')
const safe=n=>{const f=path.resolve(root,n);if(!f.startsWith(root+path.sep))throw Error('Chemin incorrect');for(let p=f;p!==root;p=path.dirname(p))if(fs.existsSync(p)&&fs.lstatSync(p).isSymbolicLink())throw Error('Lien symbolique');return f}
if(JSON.parse(fs.readFileSync(safe('package.json'))).name!=='cuisines-limetta')throw Error('Mauvais dossier')
const require=createRequire(path.join(root,'package.json'))
const originalEnv=fs.readFileSync(safe('.env'),'utf8'),env={...require('dotenv').parse(originalEnv),...process.env}
for(const key of ['BOOKINGS_CUSTOM_EMAIL','BOOKINGS_ALLOW_WRITES','BOOKINGS_OWNER_MANAGEMENT'])if(env[key]!=='true')throw Error('Configuration requise : '+key+'=true')
if(process.env.BOOKINGS_UNIFIED_CALENDAR && process.env.BOOKINGS_UNIFIED_CALENDAR!=='true')throw Error('Retirer la surcharge BOOKINGS_UNIFIED_CALENDAR dans le tableau de bord')
if(!fs.readFileSync(safe('booking/ledger.js'),'utf8').includes('...data[key]'))throw Error('Registre à vérifier')
const outputs={}
for(const [name,rules] of Object.entries(changes))outputs[name]=patch(fs.readFileSync(safe(name),'utf8'),rules,name)
for(const [name,source] of Object.entries(files)){
 if(fs.existsSync(safe(name))&&normalize(fs.readFileSync(safe(name),'utf8'))!==normalize(source))throw Error('Module existant différent : '+name)
 outputs[name]=source
}
// Validate every result before writing any source file or configuration.
for(const source of Object.values(outputs))execFileSync(process.execPath,['--input-type=module','--check'],{input:source,stdio:['pipe','pipe','pipe']})
const updatedEnv=originalEnv.replace(/^\s*(?:export\s+)?BOOKINGS_UNIFIED_CALENDAR\s*=.*(?:\r?\n|$)/gm,'').trimEnd()+'\nBOOKINGS_UNIFIED_CALENDAR=true\n'
if(!process.argv.includes('--apply')){console.log('Contrôles OK. Aucun fichier modifié.');process.exit(0)}
const backup=safe('.booking-state/agenda-unifie-'+Date.now());fs.mkdirSync(backup,{recursive:true,mode:0o700})
const manifest=Object.keys(outputs).map(name=>({name,exists:fs.existsSync(safe(name))}))
for(const m of manifest)if(m.exists){const dest=path.join(backup,m.name);fs.mkdirSync(path.dirname(dest),{recursive:true,mode:0o700});fs.copyFileSync(safe(m.name),dest)}
fs.writeFileSync(path.join(backup,'manifest.json'),JSON.stringify(manifest),{mode:0o600})
fs.writeFileSync(path.join(backup,'environment.backup'),originalEnv,{mode:0o600})
try{
 for(const [name,source] of Object.entries(outputs))fs.writeFileSync(safe(name),source)
 fs.writeFileSync(safe('.env'),updatedEnv,{mode:0o600})
}catch(error){
 for(const m of manifest){if(m.exists)fs.copyFileSync(path.join(backup,m.name),safe(m.name));else if(fs.existsSync(safe(m.name)))fs.unlinkSync(safe(m.name))}
 fs.writeFileSync(safe('.env'),originalEnv,{mode:0o600});throw error
}
console.log('AGENDA UNIFIÉ INSTALLÉ. Sauvegarde : '+backup)
console.log('Redémarrez le site Node.js dans Infomaniak, puis créez un NOUVEAU rendez-vous de test. Les notifications natives Bookings restent actives.')
