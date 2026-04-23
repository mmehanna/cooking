import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { IngredientModel } from "../../_clients/models/IngredientModel";
import { GroceryListClient } from "../../_clients/grocery-list.client";

@Injectable({ providedIn: 'root' })
export class IngredientService {
  constructor(private groceryListClient: GroceryListClient) {}

  public getIngredientsForPlate(plateId: string): Observable<IngredientModel[]> {
    return this.groceryListClient.getIngredientsForPlate(plateId);
  }

  public addIngredient(plateId: string, dto: { name: string; quantity: string; unit: string }): Observable<IngredientModel> {
    return this.groceryListClient.addIngredient(plateId, dto);
  }

  public addIngredientsBulk(plateId: string, dtos: { name: string; quantity: string; unit: string }[]): Observable<any> {
    return this.groceryListClient.addIngredientsBulk(plateId, dtos);
  }

  public updateIngredient(ingredientId: string, dto: { name?: string; quantity?: string; unit?: string }): Observable<IngredientModel> {
    return this.groceryListClient.updateIngredient(ingredientId, dto);
  }

  public deleteIngredient(ingredientId: string): Observable<any> {
    return this.groceryListClient.deleteIngredient(ingredientId);
  }
}