export function transform(read,p){
 const files={}
 for(const [name,rules] of Object.entries(p.rules)){
  let s=read(name)
  for(const [before,after] of rules){if(s.includes(after)){if(s.split(after).length!==2)throw Error('Code ambigu : '+name);continue}if(s.split(before).length!==2)throw Error('Code à vérifier : '+name+' ; aucune modification effectuée');s=s.replace(before,after)}
  files[name]=s
 }
 const name='styles/rendez-vous.css',s=read(name)
 if(s.includes('/* LIMETTA_AVAILABILITY_ORB_V1 */')&&!s.includes(p.css))throw Error('Style existant différent ; aucune modification effectuée')
 files[name]=s.includes(p.css)?s:s.trimEnd()+'\n\n'+p.css
 return files
}
