import {Component, OnInit, OnDestroy} from '@angular/core';
import {PlateService} from "../plates/services/plate.service";
import {AuthService} from "../plates/services/auth.service";
import {UserService} from "../settings/services/user.service";
import {UserProfileModel} from "../_clients/models/UserProfileModel";
import {firstValueFrom, lastValueFrom, Subscription, take} from "rxjs";
import {PLateForWeekModel} from "../_clients/models/PLateForWeekModel";
import {AlertController, ToastController} from "@ionic/angular";
import {Router} from "@angular/router";
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'app-landing',
  templateUrl: './landing.page.html',
  styleUrls: ['./landing.page.scss'],
})
export class LandingPage implements OnInit, OnDestroy {
  plateForWeek: PLateForWeekModel[] = [];
  private refreshSubscription?: Subscription;
  userEmail: string | null = null;
  userProfile: UserProfileModel | null = null;
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
              private translate: TranslateService) {
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
    await this.loadPlatesForWeek();

    // Écouter les changements de liste de plats pour rafraîchir automatiquement
    this.refreshSubscription = this.plateService.plateListTrigger$.subscribe(async () => {
      await this.loadPlatesForWeek();
    });
  }

  async loadPlatesForWeek() {
    const startDate = new Date().toISOString().split('T')[0];

    try {
      const platesForWeek = await lastValueFrom(await this.plateService.getPlatesForWeek(startDate));
      this.plateForWeek = platesForWeek.map((day) => ({
        ...day,
        plates: [...day.plates].sort((a, b) => this.getMealTypeOrder(a) - this.getMealTypeOrder(b))
      }));
    } catch (error) {
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
            const weekStartDate = this.getMonday(new Date());

            try {
              await firstValueFrom(this.plateService.generateWeekPlates(weekStartDate));
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

  public async editDayMenu(date: string) {
    this.plateService.date = date;
    await this.router.navigate(['/choose-plate']);
  }

  private getMonday(date: Date): string {
    const result = new Date(date);
    const day = result.getDay();
    const diff = day === 0 ? -6 : 1 - day;
    result.setDate(result.getDate() + diff);
    return result.toISOString().split('T')[0];
  }

  ngOnDestroy() {
    if (this.refreshSubscription) {
      this.refreshSubscription.unsubscribe();
    }
  }

  private getMealTypeOrder(plate: string): number {
    const mealType = plate.split(':')[0]?.trim()?.toLowerCase();
    return this.mealTypeOrder[mealType] ?? Number.MAX_SAFE_INTEGER;
  }

  public getWeekdayLabel(date: string): string {
    const lang = this.translate.currentLang || this.translate.defaultLang || 'en';
    const parsedDate = new Date(`${date}T00:00:00`);
    return new Intl.DateTimeFormat(lang, {weekday: 'long'}).format(parsedDate);
  }

  public getMealTypeLabel(plate: string): string {
    return plate.split(':')[0]?.trim() || '';
  }

  public getMealPlateLabel(plate: string): string {
    return plate.split(':').slice(1).join(':').trim();
  }

  private translateOrFallback(key: string, frFallback: string, enFallback: string): string {
    const translated = this.translate.instant(key);
    if (translated && translated !== key) {
      return translated;
    }
    const lang = (this.translate.currentLang || this.translate.defaultLang || 'en').toLowerCase();
    return lang.startsWith('fr') ? frFallback : enFallback;
  }

}
