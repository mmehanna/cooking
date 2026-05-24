-- ============================================
-- Schéma MySQL pour la gestion des abonnements Stripe
-- ============================================

-- Table des plans d'abonnement (synchronisés avec Stripe)
CREATE TABLE IF NOT EXISTS subscription_plans (
  id VARCHAR(50) PRIMARY KEY,               -- 'basic', 'pro', 'premium'
  stripe_price_id VARCHAR(255) NOT NULL,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  currency VARCHAR(10) DEFAULT 'EUR',
  interval_type VARCHAR(20) DEFAULT 'month',  -- 'month', 'year'
  features JSON,                            -- ['feature1', 'feature2']
  is_popular BOOLEAN DEFAULT FALSE,
  trial_days INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Table des abonnements utilisateurs
CREATE TABLE IF NOT EXISTS user_subscriptions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  plan_id VARCHAR(50) NOT NULL,
  stripe_customer_id VARCHAR(255),
  stripe_subscription_id VARCHAR(255) NOT NULL,
  status ENUM('active', 'trialing', 'canceled', 'past_due', 'unpaid', 'inactive') DEFAULT 'inactive',
  current_period_start TIMESTAMP NULL,
  current_period_end TIMESTAMP NULL,
  cancel_at_period_end BOOLEAN DEFAULT FALSE,
  canceled_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (plan_id) REFERENCES subscription_plans(id),
  INDEX idx_user_id (user_id),
  INDEX idx_stripe_subscription (stripe_subscription_id)
);

-- Table de l'historique des paiements (pour les factures)
CREATE TABLE IF NOT EXISTS subscription_payments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  subscription_id INT NOT NULL,
  stripe_invoice_id VARCHAR(255),
  amount DECIMAL(10, 2) NOT NULL,
  currency VARCHAR(10) DEFAULT 'EUR',
  status ENUM('succeeded', 'failed', 'pending') DEFAULT 'pending',
  paid_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (subscription_id) REFERENCES user_subscriptions(id) ON DELETE CASCADE,
  INDEX idx_user_id (user_id)
);

-- ============================================
-- Données initiales (plans Stripe)
-- ============================================
-- NOTE: Remplace les stripe_price_id par tes vrais Price IDs Stripe

INSERT INTO subscription_plans (id, stripe_price_id, name, description, price, currency, interval_type, features, is_popular, trial_days)
VALUES
('basic', 'price_basic_placeholder', 'Basic', 'Pour les utilisateurs occasionnels', 4.99, 'EUR', 'month', '["Jusqu\'à 20 plats personnalisés", "Planification sur 2 semaines", "Liste de courses basique", "1 famille"]', FALSE, 0)
ON DUPLICATE KEY UPDATE
  stripe_price_id = VALUES(stripe_price_id),
  name = VALUES(name),
  description = VALUES(description),
  price = VALUES(price),
  features = VALUES(features);

INSERT INTO subscription_plans (id, stripe_price_id, name, description, price, currency, interval_type, features, is_popular, trial_days)
VALUES
('pro', 'price_pro_placeholder', 'Pro', 'Pour les passionnés de cuisine', 9.99, 'EUR', 'month', '["Plats illimités", "Planification sur 3 mois", "Liste de courses avancée", "Familles illimitées", "Partage de plats", "Statistiques nutritionnelles"]', TRUE, 14)
ON DUPLICATE KEY UPDATE
  stripe_price_id = VALUES(stripe_price_id),
  name = VALUES(name),
  description = VALUES(description),
  price = VALUES(price),
  features = VALUES(features);

INSERT INTO subscription_plans (id, stripe_price_id, name, description, price, currency, interval_type, features, is_popular, trial_days)
VALUES
('premium', 'price_premium_placeholder', 'Premium', 'Pour les chefs en herbe', 14.99, 'EUR', 'month', '["Tout du forfait Pro", "Recettes IA générées", "Import de recettes web", "Mode collaboratif temps réel", "Export PDF menus", "Support prioritaire"]', FALSE, 14)
ON DUPLICATE KEY UPDATE
  stripe_price_id = VALUES(stripe_price_id),
  name = VALUES(name),
  description = VALUES(description),
  price = VALUES(price),
  features = VALUES(features);
