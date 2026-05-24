import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {catchError, map, tap} from 'rxjs/operators';
import {SubscriptionPlanModel, UserSubscriptionModel} from '../../_clients/models/SubscriptionPlanModel';
import {StripeClient} from '../../_clients/stripe.client';

@Injectable({providedIn: 'root'})
export class SubscriptionService {
  private plansSubject = new BehaviorSubject<SubscriptionPlanModel[]>([]);
  public plans$ = this.plansSubject.asObservable();

  private subscriptionSubject = new BehaviorSubject<UserSubscriptionModel | null>(null);
  public subscription$ = this.subscriptionSubject.asObservable();

  // Price IDs Stripe - À configurer selon ton compte Stripe
  private readonly stripePriceIds: Record<string, string> = {
    basic: 'price_basic_placeholder',
    pro: 'price_pro_placeholder',
    premium: 'price_premium_placeholder'
  };

  constructor(private stripeClient: StripeClient) {
    this.loadPlans();
  }

  private loadPlans(): void {
    const plans: SubscriptionPlanModel[] = [
      {
        id: 'basic',
        name: 'Basic',
        description: 'Pour les utilisateurs occasionnels',
        price: 4.99,
        currency: 'EUR',
        interval: 'month',
        features: [
          'Jusqu\'à 20 plats personnalisés',
          'Planification sur 2 semaines',
          'Liste de courses basique',
          '1 famille'
        ]
      },
      {
        id: 'pro',
        name: 'Pro',
        description: 'Pour les passionnés de cuisine',
        price: 9.99,
        currency: 'EUR',
        interval: 'month',
        features: [
          'Plats illimités',
          'Planification sur 3 mois',
          'Liste de courses avancée',
          'Familles illimitées',
          'Partage de plats',
          'Statistiques nutritionnelles'
        ],
        isPopular: true,
        trialDays: 14
      },
      {
        id: 'premium',
        name: 'Premium',
        description: 'Pour les chefs en herbe',
        price: 14.99,
        currency: 'EUR',
        interval: 'month',
        features: [
          'Tout du forfait Pro',
          'Recettes IA générées',
          'Import de recettes web',
          'Mode collaboratif temps réel',
          'Export PDF menus',
          'Support prioritaire'
        ],
        trialDays: 14
      }
    ];
    this.plansSubject.next(plans);
  }

  public getPlans(): Observable<SubscriptionPlanModel[]> {
    return this.plans$;
  }

  public getUserSubscription(): Observable<UserSubscriptionModel | null> {
    return this.subscription$;
  }

  public getStripePriceId(planId: string): string {
    return this.stripePriceIds[planId] || '';
  }

  public createCheckoutSession(planId: string): Observable<{ url: string }> {
    const priceId = this.getStripePriceId(planId);
    const successUrl = `${window.location.origin}/subscription/success`;
    const cancelUrl = `${window.location.origin}/subscription`;

    return this.stripeClient.createCheckoutSession({
      priceId,
      successUrl,
      cancelUrl
    }).pipe(
      map(session => ({ url: session.url })),
      catchError(error => {
        console.error('Error creating checkout session:', error);
        throw error;
      })
    );
  }

  public loadSubscriptionStatus(): Observable<UserSubscriptionModel | null> {
    return this.stripeClient.getSubscriptionStatus().pipe(
      map(status => {
        if (status.status === 'active' || status.status === 'trialing') {
          const plan = this.plansSubject.getValue().find(p => p.id === status.planId);
          return {
            id: '',
            userId: '',
            planId: status.planId || '',
            status: status.status as any,
            currentPeriodStart: '',
            currentPeriodEnd: '',
            cancelAtPeriodEnd: false,
            plan
          };
        }
        return null;
      }),
      tap(subscription => this.subscriptionSubject.next(subscription)),
      catchError(error => {
        console.error('Error loading subscription status:', error);
        this.subscriptionSubject.next(null);
        return of(null);
      })
    );
  }

  public cancelSubscription(): Observable<{ success: boolean; message: string }> {
    return this.stripeClient.cancelSubscription().pipe(
      tap(() => this.subscriptionSubject.next(null)),
      catchError(error => {
        console.error('Error canceling subscription:', error);
        return of({ success: false, message: 'Failed to cancel subscription' });
      })
    );
  }
}
