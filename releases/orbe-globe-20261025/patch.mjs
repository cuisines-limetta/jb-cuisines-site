export function transform(read,p){
 const files={}
 for(const [name,rules] of Object.entries(p.rules)){
  let s=read(name)
  for(const [before,after] of rules){if(s.includes(after)){if(s.split(after).length!==2)throw Error('Code ambigu : '+name);continue}if(s.split(before).length!==2)throw Error('Code à vérifier : '+name+' ; aucune modification effectuée');s=s.replace(before,after)}
  files[name]=s
 }
 for(const [name,s] of Object.entries(p.files)) {const existing=read(name,true);if(existing&&existing!==s.replace(/\r\n/g,'\n'))throw Error('Module différent : '+name);files[name]=s}
 return files
}
