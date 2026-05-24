const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// Map des plans internes vers les Price IDs Stripe
const PLAN_PRICE_IDS = {
  basic: process.env.STRIPE_PRICE_BASIC,
  pro: process.env.STRIPE_PRICE_PRO,
  premium: process.env.STRIPE_PRICE_PREMIUM
};

/**
 * POST /stripe/create-checkout-session
 * Crée une session Stripe Checkout pour un abonnement
 */
router.post('/create-checkout-session', async (req, res) => {
  try {
    const { priceId, successUrl, cancelUrl } = req.body;

    if (!priceId || !successUrl || !cancelUrl) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Récupérer le vrai Price ID Stripe depuis le plan interne
    const stripePriceId = PLAN_PRICE_IDS[priceId] || priceId;

    // Créer la session Stripe Checkout
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: stripePriceId,
          quantity: 1,
        },
      ],
      success_url: successUrl,
      cancel_url: cancelUrl,
      // Metadata pour retrouver l'utilisateur après le webhook
      metadata: {
        planId: priceId,
        // userId: req.user?.id // Décommenter quand auth est en place
      },
      // Configuration de l'essai gratuit si applicable
      subscription_data: {
        trial_period_days: priceId === 'pro' || priceId === 'premium' ? 14 : 0,
      },
    });

    res.json({
      id: session.id,
      url: session.url,
      status: session.status
    });
  } catch (error) {
    console.error('Stripe checkout error:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /stripe/subscription-status
 * Vérifie le statut de l'abonnement d'un utilisateur
 */
router.get('/subscription-status', async (req, res) => {
  try {
    // TODO: Récupérer l'ID utilisateur depuis le token JWT
    // const userId = req.user?.id;
    const userId = req.query.userId || 'demo-user';

    // Récupérer l'abonnement depuis la base de données
    // Ici on simule - en production, tu stockes l'abonnement en DB
    const subscription = await getUserSubscription(userId);

    if (!subscription) {
      return res.json({ status: 'inactive', planId: null });
    }

    // Vérifier le statut réel chez Stripe
    const stripeSubscription = await stripe.subscriptions.retrieve(subscription.stripeSubscriptionId);

    res.json({
      status: stripeSubscription.status,
      planId: subscription.planId,
      currentPeriodEnd: stripeSubscription.current_period_end,
      cancelAtPeriodEnd: stripeSubscription.cancel_at_period_end
    });
  } catch (error) {
    console.error('Stripe status error:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /stripe/cancel-subscription
 * Annule l'abonnement à la fin de la période en cours
 */
router.post('/cancel-subscription', async (req, res) => {
  try {
    // TODO: Récupérer l'ID utilisateur depuis le token JWT
    // const userId = req.user?.id;
    const userId = req.body.userId || 'demo-user';

    const subscription = await getUserSubscription(userId);

    if (!subscription) {
      return res.status(404).json({ error: 'No active subscription found' });
    }

    // Annuler chez Stripe (à la fin de la période)
    await stripe.subscriptions.update(subscription.stripeSubscriptionId, {
      cancel_at_period_end: true,
    });

    // Mettre à jour en base de données
    await updateSubscriptionCancelStatus(userId, true);

    res.json({
      success: true,
      message: 'Subscription will be canceled at the end of the current period'
    });
  } catch (error) {
    console.error('Stripe cancel error:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /stripe/webhook
 * Webhook Stripe pour écouter les événements
 */
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Gérer les événements
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object;
      console.log('Checkout completed:', session.id);
      // TODO: Activer l'abonnement en base de données
      // await activateSubscription(session.metadata.userId, session.subscription);
      break;

    case 'invoice.payment_succeeded':
      const invoice = event.data.object;
      console.log('Payment succeeded:', invoice.id);
      break;

    case 'invoice.payment_failed':
      const failedInvoice = event.data.object;
      console.log('Payment failed:', failedInvoice.id);
      // TODO: Notifier l'utilisateur et suspendre l'accès
      break;

    case 'customer.subscription.deleted':
      const subscription = event.data.object;
      console.log('Subscription canceled:', subscription.id);
      // TODO: Désactiver l'abonnement en base de données
      break;

    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  res.json({ received: true });
});

// Fonctions helpers (à remplacer par des appels DB réels)
async function getUserSubscription(userId) {
  // TODO: Implémenter la récupération depuis la base de données
  // Exemple avec Prisma ou Mongoose :
  // return await db.subscription.findFirst({ where: { userId, status: 'active' } });
  return null;
}

async function updateSubscriptionCancelStatus(userId, cancelAtPeriodEnd) {
  // TODO: Implémenter la mise à jour en base de données
  console.log(`Updated subscription for user ${userId}: cancelAtPeriodEnd=${cancelAtPeriodEnd}`);
}

module.exports = router;
