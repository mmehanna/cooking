# Backend Stripe pour Atepla

## Prérequis

- Node.js 18+
- Compte Stripe (https://stripe.com)

## Installation

```bash
npm install
```

## Configuration Stripe

1. Crée un compte Stripe si ce n'est pas déjà fait
2. Dans le dashboard Stripe, crée 3 produits avec leurs prix :
   - **Basic** : 4.99 EUR / mois
   - **Pro** : 9.99 EUR / mois (avec 14 jours d'essai)
   - **Premium** : 14.99 EUR / mois (avec 14 jours d'essai)
3. Copie le fichier `.env.example` en `.env`
4. Remplis tes clés Stripe :

```bash
STRIPE_SECRET_KEY=sk_test_...          # Clé secrète (backend)
STRIPE_WEBHOOK_SECRET=whsec_...        # Pour les webhooks
STRIPE_PRICE_BASIC=price_...           # Price ID du plan Basic
STRIPE_PRICE_PRO=price_...             # Price ID du plan Pro
STRIPE_PRICE_PREMIUM=price_...       # Price ID du plan Premium
```

## Lancer le serveur

```bash
npm run dev    # Mode développement avec nodemon
npm start      # Mode production
```

## Endpoints API

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| POST | `/stripe/create-checkout-session` | Crée une session de paiement Stripe |
| GET | `/stripe/subscription-status` | Vérifie le statut de l'abonnement |
| POST | `/stripe/cancel-subscription` | Annule l'abonnement |
| POST | `/stripe/webhook` | Réception des événements Stripe |

## Webhooks Stripe (en local)

Pour tester les webhooks en local :

```bash
# Installer le CLI Stripe
npm install -g stripe

# Forwarder les webhooks vers ton serveur local
stripe listen --forward-to localhost:3000/stripe/webhook
```

## Intégration avec l'app Angular

1. Remplace `pk_test_YOUR_STRIPE_PUBLISHABLE_KEY` dans `src/app/app.module.ts` par ta clé publique
2. Mets à jour les Price IDs dans `src/app/subscription/services/subscription.service.ts`
3. Assure-toi que le backend tourne sur `http://localhost:3000`

## À implémenter en production

- [ ] Authentification JWT sur les routes
- [ ] Base de données pour stocker les abonnements (Prisma/Mongoose/Sequelize)
- [ ] Stockage du `stripeCustomerId` par utilisateur
- [ ] Gestion complète des webhooks
- [ ] Pages de succès/annulation Stripe Checkout
