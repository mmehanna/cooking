import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { IngredientModel } from "./models/IngredientModel";
import { GroceryListModel } from "./models/GroceryListModel";

@Injectable({ providedIn: 'root' })
export class GroceryListClient {
  private apiUrl = 'http://localhost:3000';

  constructor(private httpClient: HttpClient) {}

  public getIngredientsForPlate(plateId: string): Observable<IngredientModel[]> {
    return this.httpClient.get<IngredientModel[]>(`${this.apiUrl}/plates/${plateId}/ingredients`);
  }

  public addIngredient(plateId: string, dto: { name: string; quantity: string; unit: string }): Observable<IngredientModel> {
    return this.httpClient.post<IngredientModel>(`${this.apiUrl}/plates/${plateId}/ingredients`, dto);
  }

  public addIngredientsBulk(plateId: string, dtos: { name: string; quantity: string; unit: string }[]): Observable<any> {
    return this.httpClient.post(`${this.apiUrl}/plates/${plateId}/ingredients/bulk`, dtos);
  }

  public updateIngredient(ingredientId: string, dto: { name?: string; quantity?: string; unit?: string }): Observable<IngredientModel> {
    return this.httpClient.patch<IngredientModel>(`${this.apiUrl}/plates/ingredients/${ingredientId}`, dto);
  }

  public deleteIngredient(ingredientId: string): Observable<any> {
    return this.httpClient.delete(`${this.apiUrl}/plates/ingredients/${ingredientId}`);
  }

  public getGroceryList(weekStartDate: string): Observable<GroceryListModel> {
    return this.httpClient.get<GroceryListModel>(`${this.apiUrl}/grocery-list/${weekStartDate}`);
  }

  public regenerateGroceryList(weekStartDate: string): Observable<GroceryListModel> {
    return this.httpClient.post<GroceryListModel>(`${this.apiUrl}/grocery-list/${weekStartDate}/regenerate`, {});
  }

  public toggleGroceryItem(itemId: string, checked: boolean): Observable<any> {
    return this.httpClient.patch(`${this.apiUrl}/grocery-list/items/${itemId}/toggle`, { itemId, checked });
  }
}