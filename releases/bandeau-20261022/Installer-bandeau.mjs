import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
const hash=s=>createHash('sha256').update(s.replace(/\r\n/g,'\n').replace(/^\uFEFF/,'')).digest('hex');
const digest=b=>createHash('sha256').update(b).digest('hex');
const {files,before,assets}=JSON.parse(gunzipSync(Buffer.from('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','base64')));
const root=fs.realpathSync('.'),bundle=path.dirname(fileURLToPath(import.meta.url));
if(JSON.parse(fs.readFileSync('package.json')).name!=='cuisines-limetta')throw Error('Mauvais dossier : lancer depuis le dossier du site.');
const safe=n=>{const f=path.resolve(root,n);if(!f.startsWith(root+path.sep))throw Error('Chemin incorrect');for(let p=f;p!==root;p=path.dirname(p))if(fs.existsSync(p)&&fs.lstatSync(p).isSymbolicLink())throw Error('Lien symbolique : '+n);return f};
for(const [n,text] of Object.entries(files)){
 const f=safe(n);
 if(fs.existsSync(f)){const current=hash(fs.readFileSync(f,'utf8'));if(current!==hash(text)&&current!==before[n])throw Error('FICHIER_MODIFIE : '+n+' ; aucune modification effectuée');}
 else if(before[n])throw Error('FICHIER_ABSENT : '+n);
}
for(const a of assets){
 if(digest(fs.readFileSync(path.join(bundle,a.file)))!==a.sha256)throw Error('Transfert incomplet : '+a.file);
 const f=safe(a.name);if(fs.existsSync(f)&&digest(fs.readFileSync(f))!==a.sha256)throw Error('MEDIA_MODIFIE : '+a.name);
}
for(const n of ['src/ui/visual-editor.js','styles/tunnel.css','src/ui/tunnel.js'])if(!fs.existsSync(safe(n)))throw Error('Installation précédente manquante : '+n);
if(!process.argv.includes('--apply')){console.log('Contrôles OK : fichiers et vidéo vérifiés, aucune modification.');process.exit(0)}
const id=Date.now(),backup=safe('.booking-state/vr-'+id),stage=safe('.vr-build-'+id),dist=safe('dist');
fs.mkdirSync(backup,{recursive:true});
const manifest=[...Object.keys(files),...assets.map(a=>a.name)].map(name=>({name,exists:fs.existsSync(safe(name))}));
for(const m of manifest)if(m.exists){const b=path.join(backup,m.name);fs.mkdirSync(path.dirname(b),{recursive:true});fs.copyFileSync(safe(m.name),b)}
fs.writeFileSync(path.join(backup,'manifest.json'),JSON.stringify(manifest,null,2));
let moved=false;
try{
 for(const [n,text] of Object.entries(files)){fs.mkdirSync(path.dirname(safe(n)),{recursive:true});fs.writeFileSync(safe(n),text)}
 for(const a of assets){fs.mkdirSync(path.dirname(safe(a.name)),{recursive:true});fs.copyFileSync(path.join(bundle,a.file),safe(a.name))}
 execFileSync(process.execPath,['--check','src/ui/vr-scroll.js'],{stdio:'inherit'});
 execFileSync(process.execPath,['node_modules/vite/bin/vite.js','build','--outDir',stage],{stdio:'inherit'});
 const html=fs.readFileSync(path.join(stage,'index.html'),'utf8');
 if(!html.includes('vr-scroll-video')||!html.includes('visual-editor-'))throw Error('Compilation incomplète');
 for(const a of assets)if(digest(fs.readFileSync(path.join(stage,'vr',a.file)))!==a.sha256)throw Error('Média compilé incorrect : '+a.file);
 if(fs.existsSync(dist)){fs.cpSync(dist,stage,{recursive:true,force:false,errorOnExist:false});fs.renameSync(dist,path.join(backup,'dist'));moved=true}
 fs.renameSync(stage,dist);
 console.log('BANDEAU PUBLIÉ. Sauvegarde : '+backup);
 console.log('Actualisez avec Ctrl + F5. Aucun redémarrage nécessaire.');
}catch(error){
 for(const m of manifest){if(m.exists)fs.copyFileSync(path.join(backup,m.name),safe(m.name));else if(fs.existsSync(safe(m.name)))fs.unlinkSync(safe(m.name))}
 if(moved&&!fs.existsSync(dist))fs.renameSync(path.join(backup,'dist'),dist);
 throw error;
}
