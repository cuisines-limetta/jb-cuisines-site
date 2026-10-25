import fs from 'node:fs'
import path from 'node:path'
import {execFileSync} from 'node:child_process'
const root=fs.realpathSync('.')
if(JSON.parse(fs.readFileSync('package.json')).name!=='cuisines-limetta')throw Error('Mauvais dossier')
const file=path.join(root,'booking','cancellation.js')
for(let p=file;p!==root;p=path.dirname(p))if(fs.lstatSync(p).isSymbolicLink())throw Error('Lien symbolique inattendu')
const original=fs.readFileSync(file,'utf8')
let updated=original
for(const [old,next] of [['content="no-referrer"','content="strict-origin"'],["'Referrer-Policy':'no-referrer'","'Referrer-Policy':'strict-origin'"]]){
  if(updated.split(next).length===2&&!updated.includes(old))continue
  if(updated.split(old).length!==2||updated.includes(next))throw Error('Structure inattendue ; aucun changement')
  updated=updated.replace(old,next)
}
if(updated===original){console.log('Correctif déjà installé. Redémarrez Node.js si nécessaire.');process.exit(0)}
const dir=path.join(root,'.booking-state');if(fs.existsSync(dir)&&fs.lstatSync(dir).isSymbolicLink())throw Error('Dossier de sauvegarde inattendu')
fs.mkdirSync(dir,{recursive:true,mode:0o700})
const backup=path.join(dir,'cancellation-before-origin-'+Date.now()+'.js')
fs.writeFileSync(backup,original,{mode:0o600,flag:'wx'})
const stage=file+'.origin-'+Date.now()+'.mjs'
try{
 fs.writeFileSync(stage,updated,{flag:'wx'})
 execFileSync(process.execPath,['--check',stage],{stdio:'inherit'})
 fs.renameSync(stage,file)
}finally{if(fs.existsSync(stage))fs.unlinkSync(stage)}
console.log('CONFIRMATION CORRIGÉE. Sauvegarde : '+backup)
console.log('Redémarrez Node.js puis rouvrez le lien du mail avant de confirmer à nouveau.')
