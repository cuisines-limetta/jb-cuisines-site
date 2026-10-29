# Suivi des campagnes et consentement Meta — 29 octobre 2026

Cette release installe le suivi UTM privé, le bandeau à deux finalités, la charte et le Pixel 1472369584750454. Elle conserve les contenus de l'accueil et les réglages de réservation et de messagerie. Aucun fichier .env ni état client n'est transféré.

Depuis la racine du site :

```sh
git pull --ff-only origin main
node releases/meta-consent-20261029/Installer-meta.mjs --apply
```

Redémarrer ensuite Node.js dans Infomaniak. Sans `--apply`, seul le contrôle de compatibilité est exécuté. Les sauvegardes des sources et de dist sont créées dans `.booking-state/meta-consent-<date>`. La compilation précède le remplacement de dist ; un échec restaure les sources. Les médias déjà publiés sont conservés. Ne pas utiliser un ancien installateur RDV pour cette release.

Le Pixel est désactivé par défaut : ne pas définir META_PIXEL_ENABLED=true avant validation. Le bandeau, la charte et le suivi interne fonctionnent indépendamment de cette activation. Le reçu de consentement attend l'origine BOOKING(S)_SITE_ORIGIN : le nom exact est `BOOKINGS_SITE_ORIGIN`, par défaut `https://cuisines-limetta.com`.

Après redémarrage : vérifier `/api/privacy/config` (metaEnabled:false), le bandeau et son refus persistant, `/rdv`, la charte et `/suivi-campagnes.html` protégé par la connexion administrateur pour ses données.

Validation préalable : compilation Vite réussie, 125/126 tests réussis. Échec préexistant de l'installateur historique rdv-update-core, confirmé avant les changements Meta. Installateur de cette release testé : contrôle sans écriture, idempotence, refus des fichiers modifiés, restauration sur compilation échouée, préservation de dist et .env.

SDK réel testé localement : PageView et Schedule observés après accord et confirmation fictive, sans coordonnées du formulaire. La réception dans Events Manager et Pixel Helper reste à vérifier sur un environnement HTTPS de test avant activation publique. Aucun rendez-vous Microsoft réel créé. L'intégration utilise une page technique invisible `/meta-pixel.html?page=...` ; les rapports Meta voient cette URL et le paramètre page_name, pas l'URL habituelle de navigation.

Dans Meta, vérifier les événements de test, Diagnostics, l'absence de rapprochement avancé et d'événements automatiques. Aucun changement de compte ou de campagne n'est effectué par cette release. CAPI reste inactive. Les durées de conservation propres à Meta et les garanties contractuelles applicables nécessitent encore une vérification ; cette release n'est pas une certification juridique.
