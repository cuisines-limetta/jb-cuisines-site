// ═══════════════════════════════════════════════════════════════════
//  CONTENU — Cuisines Limetta
//  Ce fichier centralise tout le contenu modifiable du site.
//  Modifiez ici sans toucher au code technique.
// ═══════════════════════════════════════════════════════════════════

export const SITE = {

  // ─── Informations générales ────────────────────────────────────
  nom:      'Cuisines Limetta',
  slogan:   'À vos côtés, sans pépins.',
  url:      'https://www.cuisines-limetta.com',

  // ─── Contact ───────────────────────────────────────────────────
  telephone:      '+33 7 67 01 21 02',
  telephoneHref:  'tel:+33767012102',
  emailContact:   'j.bayonas@cuisines-limetta.com',
  emailFormulaire:'formulaire@cuisines-limetta.com',
  adresse:        '410 rue des Rives de l\'Ain, 01160 Varambon',
  zone:           'Lyon & 50 km autour',

  // ─── Signature ─────────────────────────────────────────────────
  prenom:   'Jordan',
  nom_:     'Bayonas',
  initiales:'JB',
}

export const EMAIL_CLIENT = {

  // ─── Objet de l'email ──────────────────────────────────────────
  // {prenom} sera remplacé automatiquement par le prénom du client
  sujet: 'Bonjour {prenom}, votre demande a bien été reçue 🌿',

  // ─── Titre principal ───────────────────────────────────────────
  // {prenom} sera remplacé automatiquement
  titre_ligne1: 'Bonjour {prenom},',
  titre_ligne2: 'votre demande est entre de bonnes mains.',

  // ─── Paragraphes du corps ──────────────────────────────────────
  paragraphe1: `Merci de l'intérêt que vous portez à <strong>Cuisines Limetta</strong>. J'ai bien reçu votre demande et je vous recontacterai personnellement dans les <strong>24h</strong> pour organiser un premier échange.`,

  paragraphe2: `Chaque cuisine que je crée est unique — pensée, fabriquée et posée avec le même soin du détail. J'ai hâte de découvrir votre projet.`,

  // ─── Boutons d'action ──────────────────────────────────────────
  bouton_realisations: 'Voir nos réalisations',
  bouton_appel:        'Nous appeler',

  // ─── Styles de cuisine — bandeau coloré ────────────────────────
  // Ajoutez ou modifiez des styles ici
  styles: {
    contemporain: { label: 'Contemporain',         bg: '#24336a', text: '#ffffff' },
    classique:    { label: 'Classique',             bg: '#8b7355', text: '#ffffff' },
    scandinave:   { label: 'Scandinave',            bg: '#b2bec3', text: '#2d3436' },
    industriel:   { label: 'Industriel',            bg: '#2d3436', text: '#ffffff' },
    autre:        { label: 'Style à définir ensemble', bg: '#95c13b', text: '#ffffff' },
  },

  // ─── Texte sous le bandeau de style ───────────────────────────
  style_sous_titre: 'Nous affinerons ensemble vos envies lors de notre première rencontre.',

  // ─── Label au-dessus du récapitulatif du message ──────────────
  recap_label: 'Votre message',

  // ─── Phrase de conclusion (bande verte) ───────────────────────
  citation: '« À vos côtés, sans pépins. »',
}

export const EMAIL_ADMIN = {

  // ─── Objet reçu par Jordan ─────────────────────────────────────
  // {prenom} et {nom} sont remplacés automatiquement
  sujet: 'Nouvelle demande de devis — {prenom} {nom}',

  // ─── Note en bas de l'email admin ─────────────────────────────
  note: 'Répondre directement à cet email pour contacter {prenom} {nom}.',
}
