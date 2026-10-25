# Annulation depuis Outlook

Livraison pour installation sur le serveur. Aucun envoi réel ni annulation réelle effectués pendant les tests.

- Lien privé dans les notes staff Bookings des nouvelles réservations du site.
- Mail de gestion séparé à BOOKINGS_OWNER_EMAIL, à défaut site.emailContact, exclusivement @cuisines-limetta.com.
- Confirmation avec nom, date, aperçu du texte client et message facultatif.
- Suppression Microsoft via DELETE après préparation durable du mail ; envoi du modèle HTML Limetta uniquement après confirmation de suppression. Aucun appel à /cancel, qui demande une notification Microsoft.
- GET ne modifie rien ; lien signé, preuve de confirmation 15 minutes, contrôle d'origine, verrou persistant, aucune relance après résultat ambigu.
- État cancelled exclu des créneaux bloqués et des rappels personnalisés.
- Anciennes réservations non migrées ; anciens événements Outlook non réécrits.

## Activation serveur

L’installateur sauvegarde et vérifie les sources et .env, vérifie BOOKINGS_CUSTOM_EMAIL=true et BOOKINGS_ALLOW_WRITES=true, puis active BOOKINGS_OWNER_MANAGEMENT=true. BOOKINGS_OWNER_EMAIL est optionnel et reste inchangé. Redémarrer ensuite le site Node.js depuis Infomaniak. Aucun npm ci ni build nécessaire.
Faire une réservation à une adresse de test contrôlée. Ouvrir le mail privé reçu par Jordan et confirmer l'annulation. Vérifier disparition dans Bookings, créneau libéré, texte client reçu une fois, notes staff dans Outlook et absence de rappel ultérieur.
La remise effective du mail Limetta, la disparition de l’événement Outlook et l’absence de notification Microsoft supplémentaire doivent être vérifiées sur ce compte. Le contrat DELETE documente la suppression mais ne garantit pas les effets de notification propres au compte. Ne pas annoncer une livraison effective sur la seule réponse 204.

## Vérifications

41 tests ciblés passent : annulation, réservation, mails, Graph et rappels. Deux anciens tests de migration restent incompatibles avec les fichiers existants server.js et email-template.js, non modifiés ici. Aucun appel réel de création, annulation ou envoi de mail réalisé.
