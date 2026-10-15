// Run on the server (or locally for a local trial). Never prints or transmits the password.
import fs from 'node:fs/promises'
import path from 'node:path'
import crypto from 'node:crypto'
import readline from 'node:readline'
import {fileURLToPath} from 'node:url'
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..')
if(!process.stdin.isTTY){console.error('Ouvrez ce programme dans un terminal interactif.');process.exit(1)}
const ask=label=>new Promise(resolve=>{
 process.stdout.write(label);let value=''
 readline.emitKeypressEvents(process.stdin);process.stdin.setRawMode(true);process.stdin.resume()
 const listener=(str,key)=>{
  if(key?.ctrl&&key.name==='c'){process.stdin.setRawMode(false);process.exit(1)}
  if(key?.name==='return'){process.stdin.off('keypress',listener);process.stdin.setRawMode(false);process.stdin.pause();process.stdout.write('\n');resolve(value);return}
  if(key?.name==='backspace'){if(value.length){value=value.slice(0,-1);process.stdout.write('\b \b')}return}
  if(str&&!key?.ctrl&&!/[\x00-\x1f\x7f]/.test(str)){value+=str;process.stdout.write('*'.repeat(str.length))}
 }
 process.stdin.on('keypress',listener)
})
const password=await ask('Choisissez votre mot de passe privé (16 caractères minimum) : ')
if(password.length<16||password.length>256){console.error('Utilisez de 16 à 256 caractères.');process.exit(1)}
if(await ask('Confirmez le mot de passe : ')!==password){console.error('Les deux saisies diffèrent. Aucun changement.');process.exit(1)}
const salt=crypto.randomBytes(16).toString('hex')
const hash=crypto.scryptSync(password,salt,64).toString('hex')
const values={SITE_PRELAUNCH:'true',LAUNCH_AT:'2026-10-19T00:00:00+02:00',PREVIEW_PASSWORD_HASH:`${salt}:${hash}`,PREVIEW_SESSION_SECRET:crypto.randomBytes(32).toString('hex'),PREVIEW_COOKIE_SECURE:process.argv.includes('--local')?'false':'true'}
const file=path.join(root,'.env')
let existing='';try{existing=await fs.readFile(file,'utf8')}catch(e){if(e.code!=='ENOENT')throw e}
for(const [key,value] of Object.entries(values)){
 const line=`${key}=${value}`;const pattern=new RegExp(`^${key}=.*$`,'m')
 existing=pattern.test(existing)?existing.replace(pattern,line):existing.trimEnd()+'\n'+line+'\n'
}
await fs.writeFile(file,existing,{mode:0o600})
console.log('Accès privé configuré. Redémarrez le serveur, puis ouvrez /acces-prive.')
console.log(process.argv.includes('--local')?'Mode local HTTP : à reconfigurer sans --local sur l’hébergement HTTPS.':'Mode HTTPS : prêt pour l’hébergement.')
