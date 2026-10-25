export const normalize = s => s.replace(/^\uFEFF/,'').replace(/\r\n/g,'\n')
export function patch(source,rules,name) {
 let result=normalize(source)
 for(const [before,after] of rules){
  if(result.includes(after)){if(result.split(after).length!==2)throw Error('Modification ambiguë : '+name);continue}
  if(result.split(before).length!==2)throw Error('Code à vérifier : '+name+' ; aucune modification effectuée')
  result=result.replace(before,after)
 }
 return result
}
