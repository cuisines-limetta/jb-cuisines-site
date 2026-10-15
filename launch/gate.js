import crypto from 'node:crypto'
import { promisify } from 'node:util'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import express from 'express'
const scrypt=promisify(crypto.scrypt)
const root=path.dirname(fileURLToPath(import.meta.url))
const equal=(a,b)=>{
  if(typeof a!=='string'||typeof b!=='string')return false
  const left=Buffer.from(a),right=Buffer.from(b)
  return left.length===right.length&&crypto.timingSafeEqual(left,right)
}

export function installLaunchGate(app,env=process.env) {
  const enabled=env.SITE_PRELAUNCH!=='false'
  if(!enabled)return
  const secret=env.PREVIEW_SESSION_SECRET||''
  const passwordHash=env.PREVIEW_PASSWORD_HASH||''
  const ready=secret.length>=32&&/^[a-f0-9]{32}:[a-f0-9]{128}$/i.test(passwordHash)
  const secure=env.PREVIEW_COOKIE_SECURE!=='false'
  const cookieName='limetta_preview'
  const sign=value=>crypto.createHmac('sha256',secret).update(value).digest('hex')
  const cookie=(token,age)=>`${cookieName}=${token}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${age}${secure?'; Secure':''}`
  const authorized=req=>{
    if(!ready)return false
    const token=(req.headers.cookie||'').split(';').map(x=>x.trim()).find(x=>x.startsWith(cookieName+'='))?.slice(cookieName.length+1)||''
    const [expiry,nonce,signature]=token.split('.')
    return /^\d+$/.test(expiry||'')&&Number(expiry)>Date.now()&&Number(expiry)<Date.now()+8*86400000&&/^[a-f0-9]{32}$/.test(nonce||'')&&equal(signature,sign(`${expiry}.${nonce}`))
  }
  const attempts=new Map()
  app.use((req,res,next)=>{
    res.set('Cache-Control','private, no-store')
    res.set('X-Robots-Tag','noindex, nofollow, noarchive')
    res.set('X-Content-Type-Options','nosniff')
    res.set('Referrer-Policy','same-origin')
    next()
  })
  app.use('/launch-assets',express.static(path.join(root,'public'),{dotfiles:'deny',index:false,fallthrough:false}))
  app.get('/robots.txt',(req,res)=>res.type('text/plain').send('User-agent: *\nDisallow: /\n'))
  app.get('/launch-date',(req,res)=>{
    const raw=env.LAUNCH_AT||'2026-10-19T00:00:00+02:00'
    const target=Date.parse(raw)
    res.json({target:Number.isFinite(target)?target:Date.parse('2026-10-19T00:00:00+02:00'),now:Date.now()})
  })
  app.get('/acces-prive',(req,res)=>res.sendFile(path.join(root,'login.html')))
  app.post('/acces-prive',async(req,res)=>{
    // Browser cross-site submissions are rejected, even before password verification.
    const origin=req.headers.origin
    let foreign=req.headers['sec-fetch-site']==='cross-site'
    try {if(origin&&new URL(origin).host!==req.headers.host)foreign=true} catch {foreign=true}
    if(foreign)return res.status(403).json({error:'Accès refusé.'})
    if(!ready)return res.status(503).json({error:'L’accès privé doit être configuré sur le serveur.'})
    const now=Date.now(),key=req.socket.remoteAddress||'unknown'
    for(const [ip,item] of attempts)if(item.until<now)attempts.delete(ip)
    if(!attempts.has(key)&&attempts.size>=1024)return res.status(429).json({error:'Réessayez dans quelques minutes.'})
    const item=attempts.get(key)||{count:0,until:now+15*60000}
    if(item.count>=5)return res.status(429).json({error:'Trop de tentatives. Réessayez dans 15 minutes.'})
    item.count++;attempts.set(key,item)
    const password=req.body?.password
    if(typeof password!=='string'||password.length>256)return res.status(401).json({error:'Mot de passe incorrect.'})
    const [salt,expected]=passwordHash.split(':')
    try {
      const actual=(await scrypt(password,salt,64)).toString('hex')
      if(!equal(actual,expected))return res.status(401).json({error:'Mot de passe incorrect.'})
      attempts.delete(key)
      const payload=`${Date.now()+7*86400000}.${crypto.randomBytes(16).toString('hex')}`
      res.setHeader('Set-Cookie',cookie(`${payload}.${sign(payload)}`,7*86400))
      res.json({ok:true})
    }catch {res.status(500).json({error:'Connexion indisponible. Réessayez.'})}
  })
  app.post('/quitter-apercu',(req,res)=>{
    res.setHeader('Set-Cookie',cookie('',0));res.redirect(303,'/')
  })
  app.use((req,res,next)=>{
    if(authorized(req))return next()
    // Keep the authenticated publishing webhook available during the waiting period.
    if(req.path==='/deploy'&&req.method==='POST'&&env.DEPLOY_TOKEN&&equal(req.query.token,env.DEPLOY_TOKEN))return next()
    if(req.path.startsWith('/api/')||req.method!=='GET'&&req.method!=='HEAD')return res.status(401).json({error:'Site en préparation. Accès privé requis.'})
    // No private HTML, content API, scripts or media are served to unauthenticated visitors.
    if(req.path!=='/'&&path.extname(req.path))return res.status(404).end()
    res.sendFile(path.join(root,'waiting.html'))
  })
}
