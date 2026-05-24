import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {SubscriptionPlanModel, UserSubscriptionModel} from '../../_clients/models/SubscriptionPlanModel';

@Injectable({providedIn: 'root'})
export class SubscriptionService {
  private plansSubject = new BehaviorSubject<SubscriptionPlanModel[]>([]);
  public plans$ = this.plansSubject.asObservable();

  private subscriptionSubject = new BehaviorSubject<UserSubscriptionModel | null>(null);
  public subscription$ = this.subscriptionSubject.asObservable();

  constructor() {
    this.loadMockPlans();
  }

  private loadMockPlans(): void {
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

  public subscribeToPlan(planId: string): Observable<{ success: boolean; message: string }> {
    // TODO: Connecter au backend pour le vrai paiement
    console.log('Subscription requested for plan:', planId);
    return of({ success: true, message: 'Subscription initiated' });
  }

  public cancelSubscription(): Observable<{ success: boolean; message: string }> {
    // TODO: Connecter au backend
    return of({ success: true, message: 'Subscription canceled' });
  }
}
