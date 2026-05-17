import {Component, OnInit, OnDestroy} from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import {PlateService} from "../plates/services/plate.service";
import {AuthService} from "../plates/services/auth.service";
import {UserService} from "../settings/services/user.service";
import {UserProfileModel} from "../_clients/models/UserProfileModel";
import {firstValueFrom, lastValueFrom, Subscription, take} from "rxjs";
import {PLateForWeekModel, PlateForWeekEntry} from "../_clients/models/PLateForWeekModel";
import {AlertController, ToastController} from "@ionic/angular";
import {Router} from "@angular/router";
import {TranslateService} from "@ngx-translate/core";
import {SubscriptionService} from "../plates/services/subscription.service";

@Component({
  selector: 'app-landing',
  templateUrl: './landing.page.html',
  styleUrls: ['./landing.page.scss'],
})
export class LandingPage implements OnInit, OnDestroy {
  plateForWeek: PLateForWeekModel[] = [];
  mode: 'view' | 'edit' = 'view';
  weekStartDate = '';
  private touchStartX: number | null = null;
  private readonly swipeThreshold = 50;
  private refreshSubscription?: Subscription;
  userEmail: string | null = null;
  userProfile: UserProfileModel | null = null;
  public canGenerateWeek = false;
  private readonly mealTypeOrder: Record<string, number> = {
    breakfast: 0,
    lunch: 1,
    dinner: 2
  };

  constructor(private plateService: PlateService,
              private authService: AuthService,
              private userService: UserService,
              private alertController: AlertController,
              private toastController: ToastController,
              private router: Router,
              private translate: TranslateService,
              private subscriptionService: SubscriptionService) {
  }


  async ngOnInit() {
    this.userEmail = this.authService.getUserEmail();
    this.userService.profile$.subscribe(profile => {
      this.userProfile = profile;
    });
    try {
      const profile = await lastValueFrom(this.userService.loadProfile().pipe(take(1)));
      this.userProfile = profile;
    } catch (error) {
      // Profile not available (e.g. not authenticated)
    }
    await this.subscriptionService.loadTier();
    this.subscriptionService.tier$.subscribe(tier => {
      this.canGenerateWeek = this.subscriptionService.isAtLeast('family');
    });
    this.weekStartDate = this.getMonday(new Date());
    await this.loadPlatesForWeek();

    // Écouter les changements de liste de plats pour rafraîchir automatiquement
    this.refreshSubscription = this.plateService.plateListTrigger$.subscribe(async () => {
      await this.loadPlatesForWeek();
    });
  }

  async loadPlatesForWeek() {
    try {
      const platesForWeek = await lastValueFrom(await this.plateService.getPlatesForWeek(this.weekStartDate));
      this.plateForWeek = platesForWeek.map((day) => ({
        ...day,
        plates: [...day.plates].sort((a, b) => this.getMealTypeOrder(a.mealType) - this.getMealTypeOrder(b.mealType))
      }));
    } catch (error) {
      if (error instanceof HttpErrorResponse && error.status === 401) {
        this.authService.logout();
        return;
      }
      console.error('Error fetching plates:', error);
    }
  }

  async refreshPlates(event?: any) {
    await this.loadPlatesForWeek();
    if (event) {
      event.target.complete();
    }
  }

  public async autoGenerateWeek() {
    const alert = await this.alertController.create({
      header: this.translate.instant('LANDING.CONFIRM_GENERATE_TITLE'),
      message: this.translate.instant('LANDING.CONFIRM_GENERATE_MESSAGE'),
      buttons: [
        {
          text: this.translate.instant('LANDING.CANCEL'),
          role: 'cancel'
        },
        {
          text: this.translate.instant('LANDING.CONFIRM'),
          handler: async () => {
            try {
              await firstValueFrom(this.plateService.generateWeekPlates(this.weekStartDate));
              await this.loadPlatesForWeek();

              const toast = await this.toastController.create({
                message: this.translateOrFallback(
                  'LANDING.GENERATE_SUCCESS',
                  'Les plats de la semaine ont ete generes avec succes',
                  'Weekly plates generated successfully'
                ),
                duration: 2000,
                color: 'success'
              });
              await toast.present();
            } catch (error) {
              const toast = await this.toastController.create({
                message: this.translateOrFallback(
                  'LANDING.GENERATE_FAILED',
                  'Echec de la generation des plats de la semaine',
                  'Failed to generate weekly plates'
                ),
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

  public goToPricing() {
    this.router.navigate(['/pricing']);
  }

  public async editDayMenu(date: string) {
    this.plateService.date = date;
    await this.router.navigate(['/choose-plate']);
  }

  public async openPlateDetails(plateId: string) {
    await this.router.navigate(['/choose-plate/plate-details-page', plateId]);
  }

  public onTouchStart(event: TouchEvent) {
    this.touchStartX = event.changedTouches[0]?.clientX ?? null;
  }

  public async onTouchEnd(event: TouchEvent) {
    if (this.touchStartX === null) {
      return;
    }

    const touchEndX = event.changedTouches[0]?.clientX ?? this.touchStartX;
    const deltaX = touchEndX - this.touchStartX;
    this.touchStartX = null;

    if (Math.abs(deltaX) < this.swipeThreshold) {
      return;
    }

    if (deltaX < 0) {
      await this.changeWeek(7);
      return;
    }

    await this.changeWeek(-7);
  }

  private getMonday(date: Date): string {
    const result = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const day = result.getDay();
    const diff = day === 0 ? -6 : 1 - day;
    result.setDate(result.getDate() + diff);
    const year = result.getFullYear();
    const month = String(result.getMonth() + 1).padStart(2, '0');
    const dayOfMonth = String(result.getDate()).padStart(2, '0');
    return `${year}-${month}-${dayOfMonth}`;
  }

  ngOnDestroy() {
    if (this.refreshSubscription) {
      this.refreshSubscription.unsubscribe();
    }
  }

  private getMealTypeOrder(mealType: string): number {
    const normalizedMealType = mealType?.trim()?.toLowerCase();
    return this.mealTypeOrder[normalizedMealType] ?? Number.MAX_SAFE_INTEGER;
  }

  private parseDate(date: string): Date | null {
    if (!date) {
      return null;
    }

    const parsedDate = new Date(`${date}T00:00:00`);
    return Number.isNaN(parsedDate.getTime()) ? null : parsedDate;
  }

  public getWeekdayLabel(date: string): string {
    const lang = this.translate.currentLang || this.translate.defaultLang || 'en';
    const parsedDate = this.parseDate(date);
    if (!parsedDate) {
      return '';
    }

    return new Intl.DateTimeFormat(lang, {weekday: 'long'}).format(parsedDate);
  }

  public getWeekRangeLabel(): string {
    const lang = this.translate.currentLang || this.translate.defaultLang || 'en';
    const start = this.parseDate(this.weekStartDate);
    if (!start) {
      return '';
    }

    const end = new Date(start);
    end.setDate(end.getDate() + 6);
    const formatter = new Intl.DateTimeFormat(lang, {month: 'short', day: 'numeric'});
    return `${formatter.format(start)} - ${formatter.format(end)}`;
  }

  public getMealTypeLabel(plate: PlateForWeekEntry): string {
    const key = plate.mealType?.trim()?.toLowerCase();
    if (key === 'breakfast') {
      return this.translate.instant('CHOOSE_PLATE.BREAKFAST');
    }
    if (key === 'lunch') {
      return this.translate.instant('CHOOSE_PLATE.LUNCH');
    }
    if (key === 'dinner') {
      return this.translate.instant('CHOOSE_PLATE.DINNER');
    }
    return plate.mealType;
  }

  private translateOrFallback(key: string, frFallback: string, enFallback: string): string {
    const translated = this.translate.instant(key);
    if (translated && translated !== key) {
      return translated;
    }
    const lang = (this.translate.currentLang || this.translate.defaultLang || 'en').toLowerCase();
    return lang.startsWith('fr') ? frFallback : enFallback;
  }

  private async changeWeek(dayOffset: number) {
    const nextWeek = this.parseDate(this.weekStartDate) ?? new Date();
    nextWeek.setDate(nextWeek.getDate() + dayOffset);
    const proposedWeekStart = this.getMonday(nextWeek);

    const minWeekStart = this.getPreviousMonday(new Date());
    if (proposedWeekStart < minWeekStart) {
      const toast = await this.toastController.create({
        message: this.translate.instant('LANDING.NO_PAST_WEEKS'),
        duration: 2000,
        position: 'top',
        color: 'warning'
      });
      await toast.present();
      return;
    }

    const maxWeekStart = this.getMaxWeekStart(new Date());
    if (proposedWeekStart > maxWeekStart) {
      const toast = await this.toastController.create({
        message: this.translate.instant('LANDING.NO_FUTURE_WEEKS'),
        duration: 2000,
        position: 'top',
        color: 'warning'
      });
      await toast.present();
      return;
    }

    this.weekStartDate = proposedWeekStart;
    await this.loadPlatesForWeek();
  }

  private getPreviousMonday(date: Date): string {
    const currentMonday = this.getMonday(date);
    const mondayDate = this.parseDate(currentMonday) ?? new Date();
    mondayDate.setDate(mondayDate.getDate() - 7);
    return this.getMonday(mondayDate);
  }

  private getMaxWeekStart(date: Date): string {
    const futureDate = new Date(date.getFullYear(), date.getMonth() + 3, date.getDate());
    return this.getMonday(futureDate);
  }

}
