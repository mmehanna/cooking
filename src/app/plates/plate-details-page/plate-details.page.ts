import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {Subscription} from "rxjs";

import {PlateService} from "../services/plate.service";
import {FoodModel} from "../../_clients/models/food.model";

@Component({
  templateUrl: './plate-details.page.html',
  styleUrls: ['./plate-details.page.scss'],
})
export class PlateDetailsPage implements OnInit, OnDestroy {
  public foodDetails: FoodModel;
  private subscription = new Subscription();
  private foodId: string;

  constructor(private activatedRoute: ActivatedRoute,
              private foodService: PlateService
  ) {
  }

  ngOnInit(): void {
    this.foodId = this.activatedRoute.snapshot.params['id'] as string;

    const foodSubscription$ = this.foodService
      .getFoodDetails(this.foodId)
      .subscribe((food: FoodModel) => this.foodDetails = food);
    this.subscription.add(foodSubscription$);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
