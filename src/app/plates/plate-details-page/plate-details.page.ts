import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {Subscription} from "rxjs";

import {PlateService} from "../services/plate.service";
import {PLateModel} from "../../_clients/models/PLateModel";

@Component({
  templateUrl: './plate-details.page.html',
  styleUrls: ['./plate-details.page.scss'],
})
export class PlateDetailsPage implements OnInit, OnDestroy {
  public plateDetails: PLateModel;
  private subscription = new Subscription();
  private plateId: string;

  constructor(private activatedRoute: ActivatedRoute,
              private plateService: PlateService
  ) {
  }

  ngOnInit(): void {
    this.plateId = this.activatedRoute.snapshot.params['id'] as string;

    const plateSubscription$ = this.plateService
      .getPlateDetails(this.plateId)
      .subscribe((food: PLateModel) => this.plateDetails = food);
    this.subscription.add(plateSubscription$);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
