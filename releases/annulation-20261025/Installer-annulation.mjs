import fs from 'node:fs'
import path from 'node:path'
import {createHash} from 'node:crypto'
import {execFileSync} from 'node:child_process'
import {createRequire} from 'node:module'
import {patchGraph} from './patch-graph.mjs'
const {files,before}=JSON.parse(fs.readFileSync(new URL('./payload.json',import.meta.url)))
const root=fs.realpathSync('.')
const hash=s=>createHash('sha256').update(s.replace(/\r\n/g,'\n').replace(/^\uFEFF/,'')).digest('hex')
const safe=n=>{const f=path.resolve(root,n);if(!f.startsWith(root+path.sep))throw Error('Chemin incorrect');for(let p=f;p!==root;p=path.dirname(p))if(fs.existsSync(p)&&fs.lstatSync(p).isSymbolicLink())throw Error('Lien symbolique');return f}
if(JSON.parse(fs.readFileSync('package.json')).name!=='cuisines-limetta')throw Error('Mauvais dossier')
const require=createRequire(path.join(root,'package.json'))
const envFile=safe('.env'), originalEnv=fs.readFileSync(envFile,'utf8')
const env={...require('dotenv').parse(originalEnv),...process.env}
for(const n of ['BOOKINGS_CUSTOM_EMAIL','BOOKINGS_ALLOW_WRITES'])if(env[n]!=='true')throw Error('Configuration préalable requise : '+n+'=true')
if(process.env.BOOKINGS_OWNER_MANAGEMENT && process.env.BOOKINGS_OWNER_MANAGEMENT!=='true')throw Error('Retirer la surcharge BOOKINGS_OWNER_MANAGEMENT du tableau de bord avant activation')
const owner=env.BOOKINGS_OWNER_EMAIL || JSON.parse(fs.readFileSync(safe('content.json'))).site.emailContact
if(!/^[^\s@<>]+@cuisines-limetta\.com$/i.test(owner||''))throw Error('Adresse de gestion Limetta incorrecte')
const updatedEnv=originalEnv.replace(/^\s*(?:export\s+)?BOOKINGS_OWNER_MANAGEMENT\s*=.*(?:\r?\n|$)/gm,'').replace(/\s*$/,'')+'\nBOOKINGS_OWNER_MANAGEMENT=true\n'
const deployedGraph=fs.readFileSync(safe('booking/graph.js'),'utf8')
files['booking/graph.js']=patchGraph(deployedGraph)
before['booking/graph.js']=hash(deployedGraph)
for(const [n,s] of Object.entries(files)){const f=safe(n);if(fs.existsSync(f)){const h=hash(fs.readFileSync(f,'utf8'));if(h!==hash(s)&&h!==before[n])throw Error('FICHIER_MODIFIE : '+n+' ; aucune modification effectuée')}else if(before[n])throw Error('FICHIER_ABSENT : '+n)}
if(!process.argv.includes('--apply')){console.log('Contrôles OK ; aucune modification.');process.exit(0)}
const backup=safe('.booking-state/annulation-'+Date.now());fs.mkdirSync(backup,{recursive:true,mode:0o700})
const manifest=Object.keys(files).map(name=>({name,exists:fs.existsSync(safe(name))}))
for(const m of manifest)if(m.exists){const f=path.join(backup,m.name);fs.mkdirSync(path.dirname(f),{recursive:true});fs.copyFileSync(safe(m.name),f)}
fs.writeFileSync(path.join(backup,'manifest.json'),JSON.stringify(manifest),{mode:0o600})
fs.writeFileSync(path.join(backup,'environment.backup'),originalEnv,{mode:0o600})
try{
 for(const [n,s]of Object.entries(files)){fs.writeFileSync(safe(n),s);execFileSync(process.execPath,['--check',safe(n)],{stdio:'inherit'})}
 fs.writeFileSync(envFile,updatedEnv,{mode:0o600})
}catch(error){for(const m of manifest){if(m.exists)fs.copyFileSync(path.join(backup,m.name),safe(m.name));else if(fs.existsSync(safe(m.name)))fs.unlinkSync(safe(m.name))}fs.writeFileSync(envFile,originalEnv,{mode:0o600});throw error}
console.log('ANNULATION LIMETTA INSTALLÉE. Sauvegarde : '+backup)
console.log('Redémarrez maintenant le site Node.js dans Infomaniak, puis créez un rendez-vous de test depuis le site.')
