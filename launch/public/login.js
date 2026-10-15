document.getElementById('login').addEventListener('submit',async event=>{
 event.preventDefault();const button=event.target.querySelector('button'),error=document.getElementById('error');button.disabled=true;error.textContent=''
 try{const response=await fetch('/acces-prive',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({password:document.getElementById('password').value})});const data=await response.json();if(!response.ok)throw new Error(data.error);location.assign('/')}
 catch(e){error.textContent=e.message||'Connexion impossible. Réessayez.';button.disabled=false}
})
