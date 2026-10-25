// Preserve the deployed authentication and error handling; only extend the call adapter.
export function patchGraph(original) {
  const eol=original.includes('\r\n')?'\r\n':'\n'
  let s=original.replaceAll('\r\n','\n')
  const once=(from,to)=>{
    if(s.split(from).length!==2)throw Error('STRUCTURE_GRAPH_INATTENDUE ; aucune modification effectuée')
    s=s.replace(from,to)
  }
  if(s.includes('async function call(route, body) {')) {
    once('async function call(route, body) {','async function call(route, body, method) {')
    once("method: body === undefined ? 'GET' : 'POST',", "method: method || (body === undefined ? 'GET' : 'POST'),")
    once('    return response.json()\n  }','    if (response.status === 204) return null\n    return response.json()\n  }')
  } else {
    for(const marker of ['async function call(route, body, method) {',"method: method || (body === undefined ? 'GET' : 'POST'),",'    if (response.status === 204) return null\n    return response.json()\n  }']) {
      if(s.split(marker).length!==2)throw Error('STRUCTURE_GRAPH_INATTENDUE ; aucune modification effectuée')
    }
  }
  return s.replaceAll('\n',eol)
}
