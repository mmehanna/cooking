import { Component, OnDestroy, OnInit } from '@angular/core';
import { FoodInterface } from "../../interfaces/food.interface";
import { ActivatedRoute } from "@angular/router";
import { FoodService } from "../../_services/food.service";
import { UUID } from "angular2-uuid";
import { Observable, Subscription } from "rxjs";

@Component({
  templateUrl: './food-details.page.html',
  styleUrls: ['./food-details.page.scss'],
})
export class FoodDetailsPage implements OnInit, OnDestroy {
  public foodDetails: FoodInterface;
  private foodId : UUID;
  private subscription = new Subscription();

  constructor(private activatedRoute: ActivatedRoute,
              private foodService: FoodService) {
  }

  ngOnInit(): void {
    this.foodId = this.activatedRoute.snapshot.params['id'] as UUID;

    const foodSubscription$ = this.foodService
        .getFoodDetails(this.foodId)
        .subscribe( (food: FoodInterface) => this.foodDetails = food);
    this.subscription.add(foodSubscription$);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
