let target=Date.parse('2026-10-19T00:00:00+02:00'),offset=0
const tick=()=>{
 const seconds=Math.max(0,Math.floor((target-Date.now()-offset)/1000))
 const values=[Math.floor(seconds/86400),Math.floor(seconds/3600)%24,Math.floor(seconds/60)%60,seconds%60]
 ;['days','hours','minutes','seconds'].forEach((id,i)=>document.getElementById(id).textContent=String(values[i]).padStart(2,'0'))
 if(seconds===0)document.getElementById('launch-message').textContent='Le grand jour est arrivé. L’ouverture du site est en préparation.'
}
fetch('/launch-date',{cache:'no-store'}).then(r=>r.json()).then(data=>{target=data.target;offset=data.now-Date.now();tick()}).catch(()=>{})
tick();setInterval(tick,1000)
