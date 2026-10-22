# Mise à jour de l’ouverture VR — 22 octobre 2026

Paquet ciblé pour le site déjà mis à jour sur Infomaniak : vidéo pilotée au scroll, agrandissement synchronisé avec l’entrée dans le casque, textes superposés et coins arrondis à l’accueil.

Depuis la console SSH Node.js, dans le dossier du site :

```sh
git pull --ff-only origin main
node releases/vr-20261022/Installer-VR.mjs --apply
```

L’installateur vérifie les empreintes des médias et l’état des sources avant toute modification. Il sauvegarde les fichiers remplacés et l’ancien `dist` dans `.booking-state/vr-...`, puis compile avant la bascule. Le serveur, les données de réservation, les réglages et l’accès privé ne sont pas modifiés.

Ce paquet suppose la version tunnel déjà installée le 22 octobre. En cas de `FICHIER_MODIFIE`, comparer la source concernée avant de poursuivre ; ne pas forcer ni réinitialiser le dépôt.

Validation : build local réussi, dix tests éditeur/réservation réussis, précontrôle de l’installateur et restauration après échec de compilation vérifiés. L’intégration visuelle a été vérifiée dans le navigateur local. Le déploiement serveur reste à exécuter.
