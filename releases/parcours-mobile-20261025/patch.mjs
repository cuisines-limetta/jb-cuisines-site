export function transform(read,p) {
  const files={}
  for(const [name,before,after] of p.changes){
    let s=files[name]??read(name)
    if(s.includes(before)){
      if(s.split(before).length!==2)throw Error('Code ambigu : '+name+' ; aucune modification effectuée')
      s=s.replace(before,after)
    }else if(!s.includes(after))throw Error('Code à vérifier : '+name+' ; aucune modification effectuée')
    files[name]=s
  }
  const name='styles/rendez-vous.css', css=read(name)
  files[name]=css.includes(p.css)?css:css.trimEnd()+'\n\n'+p.css+'\n'
  return files
}
