# Publication avec page d’attente

Le compte à rebours vise le **19 octobre 2026 à 00:00, heure de Paris**. À zéro, la page affiche un message d’ouverture en préparation. Le site complet reste privé jusqu’à votre décision de l’ouvrir.

## Hébergement existant Node.js / Infomaniak

Cette protection nécessite le serveur Node.js `server.js`. **Ne publiez pas uniquement `dist` sur un hébergement statique** : les visiteurs auraient accès au site complet.

1. Envoyer le projet actualisé sur l’hébergement existant, y compris `launch/`, `server.js`, `content.json`, `package.json`, `package-lock.json` et le dossier `dist/` actuel. Garder les variables SMTP et les identifiants de l’hébergement existants. Ne jamais ajouter `.env` à Git ni le placer dans `dist/`.
2. La racine publique et toutes les URL du domaine doivent être servies par `server.js` : aucun alias statique vers `dist/`, `src/`, `Médias/` ou `content.json` ne doit contourner Node.js.
3. Dans le terminal de l’hébergement, à la racine du projet : `node launch/configure.mjs`. Choisir un mot de passe personnel d’au moins 16 caractères. Le mot de passe n’est pas affiché ni enregistré en clair. Cette opération invalide les anciennes sessions privées.
4. Démarrer/redémarrer le processus Node.js avec `npm start` (ou la commande du gestionnaire déjà configurée). Le domaine doit utiliser HTTPS.
5. En navigation privée, contrôler que `/`, `/index.html`, `/api/content` et une URL réelle d’un fichier `dist/assets/` ne donnent pas accès au site complet. `/` présente le compte à rebours, les URL privées sont refusées.
6. Ouvrir `https://cuisines-limetta.com/acces-prive`, se connecter, puis vérifier que le site complet s’affiche. La session dure sept jours. Ne pas communiquer le mot de passe.

Si l’hébergeur utilise un gestionnaire de variables d’environnement au lieu du fichier `.env`, reporter **uniquement dans ce gestionnaire privé** les cinq paramètres `SITE_PRELAUNCH`, `LAUNCH_AT`, `PREVIEW_PASSWORD_HASH`, `PREVIEW_SESSION_SECRET` et `PREVIEW_COOKIE_SECURE` créés par le programme. Les paramètres déjà fournis par le gestionnaire ont priorité sur `.env`.

## Essai local

Arrêter le serveur. Depuis le dossier du site, lancer `node launch/configure.mjs --local`, puis `npm start`. Se connecter à `/acces-prive`. Le mode local permet le cookie de session sur l’adresse HTTP du réseau domestique ; la configuration de production doit être refaite sans `--local`.

## Ouverture publique

Le jour choisi, remplacer `SITE_PRELAUNCH=true` par `SITE_PRELAUNCH=false` dans l’environnement de production, puis redémarrer le processus. Vérifier la page depuis une fenêtre privée. Le serveur ne sert plus la page d’attente et retire les directives temporaires de non-indexation.

## Modifier la date

Changer `LAUNCH_AT` puis redémarrer. Exemple : `2026-10-19T09:00:00+02:00` pour 9 heures, heure de Paris. Le compte à rebours utilise la date du serveur pour éviter le décalage d’horloge du téléphone.
