import fs from 'node:fs';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
const p=JSON.parse(fs.readFileSync(new URL('./payload.json',import.meta.url),'utf8'));
const root=fs.realpathSync('.');
if(JSON.parse(fs.readFileSync('package.json','utf8')).name!=='cuisines-limetta')throw Error('Lancer depuis le dossier du site.');
function safe(n){const f=path.resolve(root,n);if(!f.startsWith(root+path.sep))throw Error('Chemin incorrect');for(let a=f;a!==root;a=path.dirname(a))if(fs.existsSync(a)&&fs.lstatSync(a).isSymbolicLink())throw Error('Lien symbolique : '+n);return f;}
const read=n=>fs.readFileSync(safe(n),'utf8').replace(/\r\n/g,'\n').replace(/^\uFEFF/,'');
let html=read('rendez-vous.html');
if(!html.includes(p.after)){if(html.split(p.before).length!==2)throw Error('Présentation du rendez-vous différente : aucune modification effectuée.');html=html.replace(p.before,p.after);}
let css=read('styles/rendez-vous.css');
if(!css.includes(p.css)){if(css.includes('.appointment-details{'))throw Error('Styles du portrait déjà modifiés : aucune modification effectuée.');css=css.trimEnd()+'\n\n'+p.css;}
const files={'rendez-vous.html':html,'styles/rendez-vous.css':css,'Médias/jordan-bayonas-rdv.webp':Buffer.from(p.photo,'base64')};
if(!process.argv.includes('--apply')){console.log('Contrôles OK. Aucune modification.');process.exit(0);}
const id=Date.now(),backup=safe('.booking-state/rdv-portrait-'+id),stage=safe('.portrait-build-'+id),dist=safe('dist');
fs.mkdirSync(backup,{recursive:true});
const manifest=Object.keys(files).map(name=>({name,exists:fs.existsSync(safe(name))}));
for(const m of manifest)if(m.exists){const b=path.join(backup,m.name);fs.mkdirSync(path.dirname(b),{recursive:true});fs.copyFileSync(safe(m.name),b);}
fs.writeFileSync(path.join(backup,'manifest.json'),JSON.stringify(manifest,null,2));
let moved=false;
try{
 for(const [name,data] of Object.entries(files)){fs.mkdirSync(path.dirname(safe(name)),{recursive:true});fs.writeFileSync(safe(name),data);}
 execFileSync(process.execPath,['node_modules/vite/bin/vite.js','build','--outDir',stage],{stdio:'inherit'});
 const built=fs.readFileSync(path.join(stage,'rendez-vous.html'),'utf8');
 if(!built.includes('Avec Jordan BAYONAS')||!built.includes('appointment-host')||!built.includes('id="booking-form"')||!fs.existsSync(path.join(stage,'jordan-bayonas-rdv.webp')))throw Error('Contrôle de compilation échoué');
 if(fs.existsSync(dist)){fs.cpSync(dist,stage,{recursive:true,force:false,errorOnExist:false});fs.renameSync(dist,path.join(backup,'dist'));moved=true;}
 fs.renameSync(stage,dist);
 console.log('PORTRAIT ET LISTE PUBLIÉS. Sauvegarde : '+backup+'\nActualisez avec Ctrl + F5. Aucun redémarrage nécessaire.');
}catch(e){for(const m of manifest){if(m.exists)fs.copyFileSync(path.join(backup,m.name),safe(m.name));else if(fs.existsSync(safe(m.name)))fs.unlinkSync(safe(m.name));}if(moved&&!fs.existsSync(dist))fs.renameSync(path.join(backup,'dist'),dist);throw e;}
