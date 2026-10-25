import {createHash} from 'node:crypto'
const hash=s=>createHash('sha256').update(s).digest('hex')
export function transform(read,p){
 const name='src/ui/slot-picker.js',s=read(name)
 if(s!==p.picker&&hash(s)!==p.before)throw Error('Code à vérifier : '+name+' ; aucune modification effectuée')
 const css=read('styles/rendez-vous.css')
 return {[name]:p.picker,'styles/rendez-vous.css':css.includes(p.css)?css:css.trimEnd()+'\n\n/* LIMETTA_AVAILABILITY_TRANSITION_V1 */\n'+p.css+'\n'}
}
