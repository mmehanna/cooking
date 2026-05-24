import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {SubscriptionService} from './services/subscription.service';
import {SubscriptionPlanModel, UserSubscriptionModel} from '../_clients/models/SubscriptionPlanModel';
import {AlertController, ToastController} from '@ionic/angular';
import {TranslateService} from '@ngx-translate/core';
import {firstValueFrom} from 'rxjs';

@Component({
  selector: 'app-subscription',
  templateUrl: './subscription.page.html',
  styleUrls: ['./subscription.page.scss'],
})
export class SubscriptionPage implements OnInit {
  plans: SubscriptionPlanModel[] = [];
  userSubscription: UserSubscriptionModel | null = null;
  selectedPlanId: string | null = null;
  isLoading = false;

  constructor(
    private subscriptionService: SubscriptionService,
    private router: Router,
    private alertController: AlertController,
    private toastController: ToastController,
    private translate: TranslateService
  ) {}

  ngOnInit() {
    this.subscriptionService.getPlans().subscribe(plans => {
      this.plans = plans;
    });
    this.subscriptionService.getUserSubscription().subscribe(sub => {
      this.userSubscription = sub;
    });

    // Charger le statut de l'abonnement au démarrage
    this.subscriptionService.loadSubscriptionStatus().subscribe();
  }

  public selectPlan(planId: string) {
    this.selectedPlanId = planId;
  }

  public async subscribeToPlan(plan: SubscriptionPlanModel) {
    this.isLoading = true;

    try {
      const result = await firstValueFrom(this.subscriptionService.createCheckoutSession(plan.id));

      if (result.url) {
        // Rediriger vers Stripe Checkout
        window.location.href = result.url;
      } else {
        throw new Error('No checkout URL received');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      const toast = await this.toastController.create({
        message: this.translate.instant('SUBSCRIPTION.ERROR'),
        duration: 3000,
        color: 'danger'
      });
      await toast.present();
    } finally {
      this.isLoading = false;
    }
  }

  public async cancelSubscription() {
    const alert = await this.alertController.create({
      header: this.translate.instant('SUBSCRIPTION.CANCEL_CONFIRM_TITLE'),
      message: this.translate.instant('SUBSCRIPTION.CANCEL_CONFIRM_MESSAGE'),
      buttons: [
        {
          text: this.translate.instant('SUBSCRIPTION.CANCEL'),
          role: 'cancel'
        },
        {
          text: this.translate.instant('SUBSCRIPTION.CONFIRM'),
          handler: async () => {
            try {
              const result = await firstValueFrom(this.subscriptionService.cancelSubscription());
              const toast = await this.toastController.create({
                message: result.message,
                duration: 3000,
                color: result.success ? 'success' : 'danger'
              });
              await toast.present();
            } catch (error) {
              const toast = await this.toastController.create({
                message: this.translate.instant('SUBSCRIPTION.ERROR'),
                duration: 3000,
                color: 'danger'
              });
              await toast.present();
            }
          }
        }
      ]
    });
    await alert.present();
  }

  public get isSubscribed(): boolean {
    return this.userSubscription?.status === 'active' || this.userSubscription?.status === 'trialing';
  }

  public goBack() {
    this.router.navigate(['/landing']);
  }
}
