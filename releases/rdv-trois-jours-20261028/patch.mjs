export function transform(read,p){
 let html=read('rendez-vous.html'),css=read('styles/rendez-vous.css');
 const picker=read('src/ui/slot-picker.js').trim();
 if(picker!==p.before&&picker!==p.picker)throw Error('Calendrier modifié : aucune modification effectuée.');
 function once(a,b){if(html.split(a).length!==2)throw Error('Présentation différente : '+a+' ; aucune modification effectuée.');html=html.replace(a,b)}
 if(!html.includes('id="booking-choice-summary"')){
  once('          <p class="booking-slot-intro"',p.summary+'          <p class="booking-slot-intro"');
  const contact=html.match(/          <div class="booking-slot-contact">[^\n]+<\/div>/)?.[0];
  if(!contact)throw Error('Aide calendrier introuvable.');
  once(contact,contact+'\n          </div>');
  const intro=html.match(/<p class="booking-slot-intro">[^<]*<\/p>/)?.[0];
  if(!intro)throw Error('Introduction introuvable.');
  once(intro,'<p class="booking-slot-intro">Trois jours à la fois, jusqu’à cinq horaires par jour pour prendre le temps de votre projet.</p>');
  once('>Jours précédents</button>','>3 jours précédents</button>');
  once('>7 jours suivants</button>','>3 jours suivants</button>');
 }
 const ids=['booking-date','customer-name','customer-email','customer-phone','customer-address','customer-postal-code','customer-city'];
 for(const id of ids){const pattern=new RegExp('(<label for="'+id+'">)([^<]*)(</label>)');html=html.replace(pattern,(_,a,b,c)=>a+b.trimEnd()+' <span aria-hidden="true">*</span>'+c);if(!html.includes('for="'+id+'"'))throw Error('Champ absent : '+id)}
 if(!html.includes('booking-required'))once('<h3 id="booking-form-title" tabindex="-1">2. Faisons connaissance</h3>','<h3 id="booking-form-title" tabindex="-1">2. Faisons connaissance</h3>\n          <p class="hint booking-required">Les champs marqués d’un * sont obligatoires pour organiser votre rendez-vous.</p>');
 if(!css.includes(p.css)){if(css.includes('.booking-choice-summary p{'))throw Error('Styles modifiés.');css=css.trimEnd()+'\n'+p.css+'\n'}
 return {'rendez-vous.html':html,'styles/rendez-vous.css':css,'src/ui/slot-picker.js':p.picker+'\n'};
}
