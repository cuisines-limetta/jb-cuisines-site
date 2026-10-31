export function transform(read,p){
const files={};for(const [n,s] of Object.entries(p.files)){const old=read(n,true);if(old&&old!==s)throw Error('FICHIER_MODIFIE : '+n);if(old!==s)files[n]=s;}
let html=read('rendez-vous.html');const original=html;
const insert=(anchor,content)=>{if(html.includes(content))return;if(html.split(anchor).length!==2)throw Error('STRUCTURE_INATTENDUE : rendez-vous.html : '+anchor);html=html.replace(anchor,content+anchor)};
if(html.includes('booking-theme-toggle')&&!html.includes(p.button))throw Error('BOUTON_THEME_MODIFIE');
if(!html.includes(p.head))insert('</head>',p.head+'\n');
if(!html.includes('href="/styles/booking-theme.css"'))insert('</head>','  <link rel="stylesheet" href="/styles/booking-theme.css">\n');
insert('</header>',p.button);
insert('</body>','<script type="module" src="/src/ui/booking-theme.js"></script>\n');
if(html!==original)files['rendez-vous.html']=html;return files;
}
