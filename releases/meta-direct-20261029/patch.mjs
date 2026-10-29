import {createHash} from 'node:crypto';
export function transform(read,p){const source=read(p.file);const hash=createHash('sha256').update(source.replaceAll('\r\n','\n')).digest('hex');if(hash===p.after)return {};if(hash!==p.before)throw Error('FICHIER_MODIFIE : '+p.file+' ; aucune modification effectuée');return {[p.file]:p.source};}
