# Backend Stripe + MySQL pour Atepla

## Prérequis

- Node.js 18+
- Compte Stripe (https://stripe.com)
- MySQL 8+

## Installation

```bash
npm install
```

## Configuration de la base de données

1. Crée une base de données MySQL (par exemple `atepla`)
2. Importe le schéma :

```bash
mysql -u root -p atepla < database/schema.sql
```

3. Mets à jour les Price IDs Stripe dans le fichier `database/schema.sql` (remplace les placeholders par tes vrais Price IDs)
4. Réimporte si nécessaire :

```bash
mysql -u root -p atepla < database/schema.sql
```

## Configuration Stripe

1. Crée un compte Stripe si ce n'est pas déjà fait
2. Dans le dashboard Stripe, crée 3 produits avec leurs prix :
   - **Basic** : 4.99 EUR / mois
   - **Pro** : 9.99 EUR / mois (avec 14 jours d'essai)
   - **Premium** : 14.99 EUR / mois (avec 14 jours d'essai)
3. Copie le fichier `.env.example` en `.env`
4. Remplis tes clés Stripe et la connexion MySQL :

```bash
# Base de données
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=ton_password
DB_NAME=atepla

# Stripe
STRIPE_SECRET_KEY=sk_test_...          # Clé secrète (backend)
STRIPE_WEBHOOK_SECRET=whsec_...        # Pour les webhooks
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

## Architecture des tables

### subscription_plans
Stocke les plans disponibles (synchronisés avec Stripe).

| Colonne | Description |
|---------|-------------|
| `id` | Identifiant interne (basic, pro, premium) |
| `stripe_price_id` | Price ID Stripe |
| `name` | Nom affiché |
| `price` | Prix mensuel |
| `features` | JSON avec la liste des fonctionnalités |
| `trial_days` | Jours d'essai gratuit |

### user_subscriptions
Stocke les abonnements actifs des utilisateurs.

| Colonne | Description |
|---------|-------------|
| `user_id` | ID utilisateur (ta table users) |
| `plan_id` | Référence vers subscription_plans |
| `stripe_customer_id` | ID client Stripe |
| `stripe_subscription_id` | ID abonnement Stripe |
| `status` | active, trialing, canceled, past_due, unpaid, inactive |
| `current_period_end` | Date de fin de période |
| `cancel_at_period_end` | Si l'abonnement est en cours d'annulation |

### subscription_payments
Historique des paiements.

| Colonne | Description |
|---------|-------------|
| `user_id` | ID utilisateur |
| `subscription_id` | Référence vers user_subscriptions |
| `stripe_invoice_id` | ID facture Stripe |
| `amount` | Montant payé |
| `status` | succeeded, failed, pending |

## Webhooks Stripe (en local)

Pour tester les webhooks en local :

```bash
# Installer le CLI Stripe
npm install -g stripe

# Forwarder les webhooks vers ton serveur local
stripe listen --forward-to localhost:3000/stripe/webhook
```

Copie la variable `STRIPE_WEBHOOK_SECRET` affichée dans ton `.env`.

## Intégration avec l'app Angular

1. Remplace `pk_test_YOUR_STRIPE_PUBLISHABLE_KEY` dans `src/app/app.module.ts` par ta clé publique Stripe
2. Mets à jour les Price IDs dans `src/app/subscription/services/subscription.service.ts` pour qu'ils correspondent aux IDs de ta table `subscription_plans`
3. Assure-toi que le backend tourne sur `http://localhost:3000` (ou met à jour l'URL dans le frontend)

## À implémenter en production

- [ ] Authentification JWT sur toutes les routes
- [ ] Middleware pour extraire le userId du token JWT (remplacer `req.body.userId`)
- [ ] Envoi d'emails lors des paiements échoués
- [ ] Page de succès et d'annulation Stripe Checkout
- [ ] Webhook sécurisé en production
