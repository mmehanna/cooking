import { Component, OnInit } from '@angular/core';
import { FoodInterface } from "../../interfaces/food.interface";
import { ActivatedRoute } from "@angular/router";
import { FoodService } from "../../_services/food.service";
import { UUID } from "angular2-uuid";

@Component({
  templateUrl: './food-details.page.html',
  styleUrls: ['./food-details.page.scss'],
})
export class FoodDetailsPage implements OnInit {
  public foodDetails: FoodInterface;
  private foodDetailsId = null;

  constructor(private activatedRoute: ActivatedRoute,
              private foodService: FoodService) {
  }

  ngOnInit(): void {
    this.foodDetailsId = this.activatedRoute.snapshot.params['id'] as UUID;
    this.foodDetails = this.foodService.getFoodDetails(this.foodDetailsId);
  }
}
