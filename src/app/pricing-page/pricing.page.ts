import { Component, OnInit } from '@angular/core';
import { SubscriptionService, SubscriptionTier } from '../plates/services/subscription.service';
import { ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-pricing-page',
  templateUrl: './pricing.page.html',
  styleUrls: ['./pricing.page.scss'],
})
export class PricingPage implements OnInit {
  currentTier: SubscriptionTier = 'free';
  tiers = [
    {
      key: 'free' as SubscriptionTier,
      price: '0 €',
      period: '/mo',
      features: [
        'PRICING.FREE_FEATURE_1',
        'PRICING.FREE_FEATURE_2',
        'PRICING.FREE_FEATURE_3',
      ],
    },
    {
      key: 'family' as SubscriptionTier,
      price: '3,99 €',
      period: '/mo',
      features: [
        'PRICING.FAMILY_FEATURE_1',
        'PRICING.FAMILY_FEATURE_2',
        'PRICING.FAMILY_FEATURE_3',
        'PRICING.FAMILY_FEATURE_4',
      ],
    },
  ];

  constructor(
    private subscriptionService: SubscriptionService,
    private toastController: ToastController,
    private router: Router,
    private translate: TranslateService
  ) {}

  async ngOnInit() {
    await this.subscriptionService.loadTier();
    this.subscriptionService.tier$.subscribe((tier) => {
      this.currentTier = tier;
    });
  }

  public async selectTier(tier: SubscriptionTier) {
    if (tier === this.currentTier) {
      const toast = await this.toastController.create({
        message: this.translate.instant('PRICING.ALREADY_SUBSCRIBED'),
        duration: 2000,
        color: 'success',
      });
      await toast.present();
      return;
    }

    try {
      await this.subscriptionService.upgrade(tier);
      const toast = await this.toastController.create({
        message: this.translate.instant('PRICING.UPGRADE_SUCCESS'),
        duration: 2000,
        color: 'success',
      });
      await toast.present();
      await this.router.navigate(['/landing']);
    } catch (err) {
      const toast = await this.toastController.create({
        message: this.translate.instant('PRICING.UPGRADE_FAILED'),
        duration: 2000,
        color: 'danger',
      });
      await toast.present();
    }
  }

  public goBack() {
    this.router.navigate(['/landing']);
  }
}
