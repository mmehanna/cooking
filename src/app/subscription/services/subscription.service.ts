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

  constructor(private stripeClient: StripeClient) {
    this.loadPlansFromApi();
  }

  private loadPlansFromApi(): void {
    this.stripeClient.getPlans().pipe(
      map(apiPlans => apiPlans.map(plan => ({
        id: plan.id,
        name: plan.name,
        description: plan.description,
        price: plan.price,
        currency: plan.currency,
        interval: plan.interval as 'month' | 'year',
        features: plan.features,
        isPopular: plan.isPopular,
        trialDays: plan.trialDays
      }))),
      catchError(error => {
        console.error('Error loading plans from API:', error);
        return of([]);
      })
    ).subscribe(plans => {
      this.plansSubject.next(plans);
    });
  }

  public getPlans(): Observable<SubscriptionPlanModel[]> {
    return this.plans$;
  }

  public getUserSubscription(): Observable<UserSubscriptionModel | null> {
    return this.subscription$;
  }

  public createCheckoutSession(planId: string): Observable<{ url: string }> {
    const successUrl = `${window.location.origin}/subscription`;
    const cancelUrl = `${window.location.origin}/subscription`;

    return this.stripeClient.createCheckoutSession({
      priceId: planId,
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
