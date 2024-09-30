import {Component, OnInit} from '@angular/core';
import {PlateService} from "../plates/services/plate.service";
import {lastValueFrom,} from "rxjs";
import {PLateForWeekModel} from "../_clients/models/PLateForWeekModel";

@Component({
  selector: 'app-landing',
  templateUrl: './landing.page.html',
  styleUrls: ['./landing.page.scss'],
})
export class LandingPage implements OnInit {
  plateForWeek: PLateForWeekModel[] = [];

  constructor(private plateService: PlateService) {
  }


  async ngOnInit() {
    const startDate = new Date().toISOString().split('T')[0];

    try {
      this.plateForWeek = await lastValueFrom(await this.plateService.getPlatesForWeek(startDate));
    } catch (error) {
      console.error('Error fetching plates:', error);
    }
  }
}


