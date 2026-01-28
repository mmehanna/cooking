import {Component, OnInit, OnDestroy} from '@angular/core';
import {PlateService} from "../plates/services/plate.service";
import {lastValueFrom, interval, Subscription} from "rxjs";
import {PLateForWeekModel} from "../_clients/models/PLateForWeekModel";

@Component({
  selector: 'app-landing',
  templateUrl: './landing.page.html',
  styleUrls: ['./landing.page.scss'],
})
export class LandingPage implements OnInit, OnDestroy {
  plateForWeek: PLateForWeekModel[] = [];
  private refreshSubscription?: Subscription;

  constructor(private plateService: PlateService) {
  }


  async ngOnInit() {
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


