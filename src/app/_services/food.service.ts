import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

import { FoodInterface } from "../interfaces/food.interface";
import { UUID } from "angular2-uuid";

@Injectable({providedIn: 'root'})
export class FoodService {
    private apiUrl = 'http://localhost:3000';

    constructor(private http: HttpClient) {
        this.getFoods();
    }

    getFoods(): Observable<FoodInterface[]> {
        return this.http.get<FoodInterface[]>(`${this.apiUrl}/foods`);
    }

    // public getFoodDetails(id: UUID): Observable<FoodInterface> {
    //     const url = `${this.apiUrl}/foods/${id}`;
    //     return this.http.get<FoodInterface>(url);
    // }

    public getFoodDetails(foodId: UUID): Observable<FoodInterface> {
        return this.http.get<FoodInterface>(`${this.apiUrl}/foods/${foodId}`);
    }

    public toggleFoodSelection(foodId: UUID) {
        const currentFood = this.getFoodDetails(foodId);
        if (!currentFood) {
            return;
        }
        //currentFood.isSelected = !currentFood.isSelected;
    }

}
