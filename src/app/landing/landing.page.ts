import {Component, OnInit, OnDestroy} from '@angular/core';
import {PlateService} from "../plates/services/plate.service";
import {AuthService} from "../plates/services/auth.service";
import {UserService} from "../settings/services/user.service";
import {UserProfileModel} from "../_clients/models/UserProfileModel";
import {lastValueFrom, interval, Subscription, take} from "rxjs";
import {PLateForWeekModel} from "../_clients/models/PLateForWeekModel";

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

  constructor(private plateService: PlateService,
              private authService: AuthService,
              private userService: UserService) {
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
      this.plateForWeek = await lastValueFrom(await this.plateService.getPlatesForWeek(startDate));
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

  ngOnDestroy() {
    if (this.refreshSubscription) {
      this.refreshSubscription.unsubscribe();
    }
  }

}


