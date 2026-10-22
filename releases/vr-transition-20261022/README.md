# Transition d’entrée dans le casque

Assombrissement progressif de l’interface à l’approche du casque, puis retour à la lumière dans la cuisine. Synchronisé à la vidéo et réversible au scroll. Désactivé en mode mouvements réduits.

Depuis le dossier du site Infomaniak, après récupération de main :

```sh
node releases/vr-transition-20261022/Installer-transition.mjs --apply
```

Met à jour uniquement src/ui/vr-scroll.js et styles/vr-scroll.css. La vidéo déjà installée est conservée. Vérifie les sources, sauvegarde l’ancienne version et compile avant la bascule. En cas de conflit, ne pas forcer l’installation.
