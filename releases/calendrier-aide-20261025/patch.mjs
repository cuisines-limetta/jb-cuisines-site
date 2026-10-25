export function transform(read,p){
 const files={}
 for(const [name,before,after] of p.changes){
  let s=files[name]??read(name)
  if(!s.includes(after)){
   if(s.split(before).length!==2)throw Error('Code à vérifier : '+name+' ; aucune modification effectuée')
   s=s.replace(before,after)
  }
  files[name]=s
 }
 const name='styles/rendez-vous.css',css=read(name)
 if(css.includes('/* Navigation et aide à la recherche de créneaux. */')&&!css.includes(p.css))throw Error('Styles modifiés ; aucune modification effectuée')
 files[name]=css.includes(p.css)?css:css.trimEnd()+'\n\n'+p.css+'\n'
 return files
}
