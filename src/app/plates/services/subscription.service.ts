import { Injectable } from '@angular/core';
import { SubscriptionClient } from '../../_clients/subscription.client';
import { BehaviorSubject, lastValueFrom } from 'rxjs';

export type SubscriptionTier = 'free' | 'family' | 'chef';

const tierPriority: Record<SubscriptionTier, number> = {
  free: 0,
  family: 1,
  chef: 2,
};

@Injectable({ providedIn: 'root' })
export class SubscriptionService {
  private tierSubject = new BehaviorSubject<SubscriptionTier>('free');
  public tier$ = this.tierSubject.asObservable();

  constructor(private subscriptionClient: SubscriptionClient) {}

  public async loadTier() {
    try {
      const response = await lastValueFrom(this.subscriptionClient.getTier());
      this.tierSubject.next((response.tier || 'free') as SubscriptionTier);
    } catch (err) {
      console.error('Failed to load subscription tier', err);
    }
  }

  public getTier(): SubscriptionTier {
    return this.tierSubject.getValue();
  }

  public isAtLeast(tier: SubscriptionTier): boolean {
    return tierPriority[this.getTier()] >= tierPriority[tier];
  }

  public async upgrade(tier: SubscriptionTier) {
    const response = await lastValueFrom(this.subscriptionClient.upgradeTier(tier));
    this.tierSubject.next(tier);
    return response;
  }
}
