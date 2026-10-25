# Orbe de recherche des disponibilités

Depuis la racine du site :

```sh
node releases/orbe-disponibilites-20261025/Installer-orbe.mjs --apply
```

Modifications ciblées sur quatre fichiers frontend. Sauvegarde des sources et du dist sous .booking-state, compilation en dossier temporaire, conservation des médias et anciens assets, restauration en cas d’échec. Aucun changement des mails, de la configuration ou des réservations. Aucun redémarrage requis.

L’orbe existante est réutilisée avec le texte « recherche des disponibilités ». Elle reste présente pendant la recherche des sept jours, respecte la réduction des animations et s’arrête en cas de succès ou d’erreur. Les réponses périmées n’interrompent pas la recherche en cours.
