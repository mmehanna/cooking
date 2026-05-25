const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const db = require('../config/database');

/**
 * GET /stripe/plans
 * Récupère tous les plans d'abonnement depuis la base de données
 */
router.get('/plans', async (req, res) => {
  try {
    const [plans] = await db.execute(
      'SELECT id, name, description, price, currency, interval_type, features, is_popular, trial_days FROM subscription_plans ORDER BY price ASC'
    );

    // Parser le JSON des features
    const formattedPlans = plans.map(plan => ({
      ...plan,
      features: typeof plan.features === 'string' ? JSON.parse(plan.features) : plan.features,
      interval: plan.interval_type,
      isPopular: plan.is_popular === 1,
      trialDays: plan.trial_days,
    }));

    res.json(formattedPlans);
  } catch (error) {
    console.error('Error fetching plans:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /stripe/create-checkout-session
 * Crée une session Stripe Checkout pour un abonnement
 */
router.post('/create-checkout-session', async (req, res) => {
  try {
    const { priceId, successUrl, cancelUrl } = req.body;
    // TODO: Récupérer userId depuis le token JWT
    const userId = req.body.userId || 1;

    if (!priceId || !successUrl || !cancelUrl) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Récupérer le plan depuis la base de données
    const [plans] = await db.execute(
      'SELECT stripe_price_id, trial_days FROM subscription_plans WHERE id = ?',
      [priceId]
    );

    if (plans.length === 0) {
      return res.status(404).json({ error: 'Plan not found' });
    }

    const plan = plans[0];
    const stripePriceId = plan.stripe_price_id;

    // Récupérer ou créer le customer Stripe
    let customerId = await getOrCreateStripeCustomer(userId);

    // Créer la session Stripe Checkout
    const sessionConfig = {
      mode: 'subscription',
      payment_method_types: ['card'],
      customer: customerId,
      line_items: [
        {
          price: stripePriceId,
          quantity: 1,
        },
      ],
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        planId: priceId,
        userId: String(userId),
      },
    };

    // Ajouter la période d'essai si applicable
    if (plan.trial_days && plan.trial_days > 0) {
      sessionConfig.subscription_data = {
        trial_period_days: plan.trial_days,
      };
    }

    const session = await stripe.checkout.sessions.create(sessionConfig);

    res.json({
      id: session.id,
      url: session.url,
      status: session.status,
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
    const userId = req.query.userId || 1;

    const [subscriptions] = await db.execute(
      `SELECT us.*, sp.name as plan_name, sp.price, sp.currency, sp.interval_type
       FROM user_subscriptions us
       JOIN subscription_plans sp ON us.plan_id = sp.id
       WHERE us.user_id = ?
       ORDER BY us.created_at DESC
       LIMIT 1`,
      [userId]
    );

    if (subscriptions.length === 0) {
      return res.json({ status: 'inactive', planId: null });
    }

    const subscription = subscriptions[0];

    // Vérifier que l'abonnement n'est pas expiré
    const now = new Date();
    const periodEnd = new Date(subscription.current_period_end);

    if (periodEnd < now && subscription.status === 'active') {
      // Mettre à jour le statut si la période est terminée
      await db.execute(
        'UPDATE user_subscriptions SET status = ? WHERE id = ?',
        ['inactive', subscription.id]
      );
      subscription.status = 'inactive';
    }

    res.json({
      status: subscription.status,
      planId: subscription.plan_id,
      planName: subscription.plan_name,
      currentPeriodEnd: subscription.current_period_end,
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
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
    const userId = req.body.userId || 1;

    // Récupérer l'abonnement actif
    const [subscriptions] = await db.execute(
      `SELECT * FROM user_subscriptions
       WHERE user_id = ? AND status IN ('active', 'trialing')
       ORDER BY created_at DESC
       LIMIT 1`,
      [userId]
    );

    if (subscriptions.length === 0) {
      return res.status(404).json({ error: 'No active subscription found' });
    }

    const subscription = subscriptions[0];

    // Annuler chez Stripe (à la fin de la période)
    await stripe.subscriptions.update(subscription.stripe_subscription_id, {
      cancel_at_period_end: true,
    });

    // Mettre à jour en base de données
    await db.execute(
      `UPDATE user_subscriptions
       SET cancel_at_period_end = TRUE, status = 'canceled', updated_at = NOW()
       WHERE id = ?`,
      [subscription.id]
    );

    res.json({
      success: true,
      message: 'Subscription will be canceled at the end of the current period',
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
    case 'checkout.session.completed': {
      const session = event.data.object;
      console.log('Checkout completed:', session.id);

      const { userId, planId } = session.metadata;
      const stripeSubscriptionId = session.subscription;

      // Récupérer les détails de l'abonnement Stripe
      const stripeSubscription = await stripe.subscriptions.retrieve(stripeSubscriptionId);

      // Insérer ou mettre à jour l'abonnement en base de données
      await db.execute(
        `INSERT INTO user_subscriptions
         (user_id, plan_id, stripe_customer_id, stripe_subscription_id, status,
          current_period_start, current_period_end, cancel_at_period_end, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, FROM_UNIXTIME(?), FROM_UNIXTIME(?), FALSE, NOW(), NOW())
         ON DUPLICATE KEY UPDATE
         status = VALUES(status),
         current_period_start = VALUES(current_period_start),
         current_period_end = VALUES(current_period_end),
         updated_at = NOW()`,
        [
          userId,
          planId,
          session.customer,
          stripeSubscriptionId,
          stripeSubscription.status,
          stripeSubscription.current_period_start,
          stripeSubscription.current_period_end,
        ]
      );
      break;
    }

    case 'invoice.payment_succeeded': {
      const invoice = event.data.object;
      console.log('Payment succeeded:', invoice.id);

      // Enregistrer le paiement
      if (invoice.subscription) {
        const [subs] = await db.execute(
          'SELECT id, user_id FROM user_subscriptions WHERE stripe_subscription_id = ?',
          [invoice.subscription]
        );

        if (subs.length > 0) {
          await db.execute(
            `INSERT INTO subscription_payments
             (user_id, subscription_id, stripe_invoice_id, amount, currency, status, paid_at, created_at)
             VALUES (?, ?, ?, ?, ?, 'succeeded', NOW(), NOW())`,
            [
              subs[0].user_id,
              subs[0].id,
              invoice.id,
              invoice.amount_paid / 100, // Stripe retourne les montants en cents
              invoice.currency.toUpperCase(),
            ]
          );
        }
      }
      break;
    }

    case 'invoice.payment_failed': {
      const failedInvoice = event.data.object;
      console.log('Payment failed:', failedInvoice.id);

      // Notifier l'utilisateur (TODO: envoyer un email)
      break;
    }

    case 'customer.subscription.updated': {
      const updatedSub = event.data.object;
      console.log('Subscription updated:', updatedSub.id);

      await db.execute(
        `UPDATE user_subscriptions
         SET status = ?, cancel_at_period_end = ?, current_period_end = FROM_UNIXTIME(?), updated_at = NOW()
         WHERE stripe_subscription_id = ?`,
        [
          updatedSub.status,
          updatedSub.cancel_at_period_end,
          updatedSub.current_period_end,
          updatedSub.id,
        ]
      );
      break;
    }

    case 'customer.subscription.deleted': {
      const deletedSub = event.data.object;
      console.log('Subscription canceled:', deletedSub.id);

      await db.execute(
        `UPDATE user_subscriptions
         SET status = 'canceled', cancel_at_period_end = TRUE, updated_at = NOW()
         WHERE stripe_subscription_id = ?`,
        [deletedSub.id]
      );
      break;
    }

    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  res.json({ received: true });
});

// ============================================
// Helpers
// ============================================

async function getOrCreateStripeCustomer(userId) {
  // Vérifier si l'utilisateur a déjà un customer Stripe
  const [subscriptions] = await db.execute(
    'SELECT stripe_customer_id FROM user_subscriptions WHERE user_id = ? LIMIT 1',
    [userId]
  );

  if (subscriptions.length > 0 && subscriptions[0].stripe_customer_id) {
    return subscriptions[0].stripe_customer_id;
  }

  // TODO: Récupérer les infos utilisateur depuis la base de données
  // const [users] = await db.execute('SELECT email, name FROM users WHERE id = ?', [userId]);

  // Créer un nouveau customer Stripe
  const customer = await stripe.customers.create({
    metadata: { userId: String(userId) },
    // email: users[0]?.email,
    // name: users[0]?.name,
  });

  return customer.id;
}

module.exports = router;
