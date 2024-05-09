import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {Subscription} from "rxjs";
import {UUID} from "angular2-uuid";

import {FoodService} from "../services/food.service";
import {FoodModel} from "../../_clients/models/food.model";

@Component({
  templateUrl: './food-details.page.html',
  styleUrls: ['./food-details.page.scss'],
})
export class FoodDetailsPage implements OnInit, OnDestroy {
  public foodDetails: FoodModel;
  private subscription = new Subscription();
  private foodId: UUID;

  constructor(private activatedRoute: ActivatedRoute,
              private foodService: FoodService
  ) {
  }

  ngOnInit(): void {
    this.foodId = this.activatedRoute.snapshot.params['id'] as UUID;

    const foodSubscription$ = this.foodService
      .getFoodDetails(this.foodId)
      .subscribe((food: FoodModel) => this.foodDetails = food);
    this.subscription.add(foodSubscription$);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
