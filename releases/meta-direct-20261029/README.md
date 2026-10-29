# Meta direct — 20261029

Variante de diagnostic : SDK dans le document principal après accord publicitaire enregistré. Seul src/utils/meta-pixel.js est remplacé après contrôle SHA256. Sauvegarde des sources et de dist, compilation puis remplacement ; restauration des sources en cas d'échec. Aucune modification de .env, des réservations ou des campagnes.

Le SDK chargé peut accéder au document principal : cette variante ne conserve pas l'isolation documentaire. autoConfig=false, aucun argument de correspondance avancée, paramètres limités à page_name et identifiant public de conversion. Après retrait, consent revoke et aucun nouvel événement applicatif ; le SDK reste en mémoire jusqu'au rechargement.

24 tests ciblés réussis, build réussi. Réception Meta non encore vérifiée.

Depuis la racine du site : node releases/meta-direct-20261029/Installer-meta-direct.mjs --apply
