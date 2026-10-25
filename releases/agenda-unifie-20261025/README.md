# Agenda unifié Limetta

Cette mise à jour ajoute une invitation REQUEST au mail de confirmation Limetta et une annulation CANCEL au mail Limetta, avec le même identifiant, organisateur et destinataire. Elle concerne les nouveaux rendez-vous ; les anciens restent inchangés. Les notifications natives de Bookings restent actives pendant la validation Gmail/Outlook.

Depuis la racine du site :

```sh
node releases/agenda-unifie-20261025/Installer-agenda.mjs
node releases/agenda-unifie-20261025/Installer-agenda.mjs --apply
```

Redémarrer Node.js dans Infomaniak. Aucun build frontend nécessaire.

Le programme vérifie toutes les modifications avant écriture, sauvegarde les fichiers et la configuration sous `.booking-state/agenda-unifie-*`, puis active `BOOKINGS_UNIFIED_CALENDAR=true`. Les modifications sont ciblées pour conserver les adaptations Graph du serveur.

Test : créer un nouveau rendez-vous avec une adresse Gmail puis Outlook, accepter l'invitation contenue dans le mail Limetta, annuler via le lien privé de gestion et vérifier le mail Limetta, l'événement annulé et le créneau libéré. Les doublons Bookings sont encore attendus à ce stade. Ne pas filtrer leurs notifications avant validation, notamment pour les anciennes réservations.

Désactivation pour les prochaines réservations : mettre `BOOKINGS_UNIFIED_CALENDAR=false` puis redémarrer Node.js. Conserver le code installé : les invitations déjà émises nécessitent toujours son traitement d'annulation. Ne pas restaurer une ancienne version après émission d'invitations sans examiner ces rendez-vous.

Un changement d'expéditeur, de client ou d'horaire après création exige une vérification manuelle avant annulation. Les envois incertains ne sont jamais relancés automatiquement.

Validation locale : 46 tests fonctionnels réussis, plus 3 tests d'installation (simulation, application répétée, conservation de la configuration, arrêt sans écriture sur code inconnu et préservation des champs Graph spécifiques au serveur). Aucun envoi réel ni changement de réservation pendant ces contrôles.
