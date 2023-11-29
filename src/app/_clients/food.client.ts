import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

import { FoodModel } from "./models/food.model";
import { UUID } from "angular2-uuid";
import { FoodItemBo } from "../food-list/bos/food-item.bo";

@Injectable({providedIn: 'root'})
export class FoodClient {
    private apiUrl = 'http://localhost:3000';

    constructor(private httpClient: HttpClient) {}

    public getFoods(): Observable<FoodModel[]> {
        return this.httpClient.get<FoodModel[]>(`${this.apiUrl}/foods`);
    }

    public getFoodDetails(foodId: UUID): Observable<FoodModel> {
        return this.httpClient.get<FoodModel>(`${this.apiUrl}/foods/${foodId}`);
    }

  public createFood(food: FoodModel): Observable<FoodModel> {
    return this.httpClient.post<FoodModel>(`${this.apiUrl}/foods`, food);
  }


}
