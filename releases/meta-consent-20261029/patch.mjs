import {createHash} from 'node:crypto'
const norm=s=>s.replaceAll('\r\n','\n').trim()
export function transform(read,p){
  const files={}
  for(const [n,s] of Object.entries(p.files)){
    const old=norm(read(n,true)),hash=createHash('sha256').update(old).digest('hex')
    if(old!==norm(s)&&!p.before[n].includes(old===''?'':hash))throw Error('FICHIER_MODIFIE : '+n+' ; aucune modification effectuée')
    files[n]=s+'\n'
  }
  function one(s,a,b,n){if(s.includes(b))return s;if(s.split(a).length!==2)throw Error('STRUCTURE_INATTENDUE : '+n);return s.replace(a,b)}
  let s=read('server.js')
  if(!s.includes('installVisualEditor(app'))throw Error('EDITEUR_ABSENT')
  if(!s.includes("import { installPrivacy }"))s="import { installPrivacy } from './booking/privacy.js'\n"+s
  s=one(s,'installCalendarRoute(app)','installPrivacy(app, {root:__dirname})\ninstallCalendarRoute(app)','server.js')
  s=s.replace("res.redirect(301, '/rdv'))", "res.redirect(301, '/rdv' + (req.originalUrl.includes('?') ? req.originalUrl.slice(req.originalUrl.indexOf('?')) : '')))")
  files['server.js']=s
  s=read('index.html')
  s=s.replace(/\s*<script async src="https:\/\/www.googletagmanager.com\/gtag\/js\?id=G-07FH3DK7GN"><\/script>/g,'').replace(/\s*<script>window.dataLayer=window.dataLayer\|\|\[\];function gtag\(\)\{dataLayer.push\(arguments\);\}gtag\('js',new Date\(\)\);gtag\('config','G-07FH3DK7GN'\);<\/script>/g,'')
  if(/googletagmanager|google-analytics|facebook.com\/tr|fbq\(/.test(s))throw Error('TRACEUR_INATTENDU : index.html')
  files['index.html']=s
  s=read('vite.config.js')
  for(const [key,file]of [['metaPixel','meta-pixel.html'],['acquisition','suivi-campagnes.html']])if(!s.includes("'"+file+"'"))s=one(s,'input: {','input: {\n        '+key+": resolve(__dirname, '"+file+"'),",'vite.config.js')
  files['vite.config.js']=s
  return files
}
