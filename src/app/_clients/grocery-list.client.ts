import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { IngredientModel } from "./models/IngredientModel";
import { GroceryListModel } from "./models/GroceryListModel";
import { API_BASE_URL } from "./api-url";

@Injectable({ providedIn: 'root' })
export class GroceryListClient {
  private apiUrl = API_BASE_URL;

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

  public getManualItems(weekStartDate: string): Observable<any[]> {
    return this.httpClient.get<any[]>(`${this.apiUrl}/grocery-list/manual/${weekStartDate}`);
  }

  public createManualItem(dto: { name: string; quantity?: string; unit?: string; weekStartDate: string }): Observable<any> {
    return this.httpClient.post(`${this.apiUrl}/grocery-list/manual`, dto);
  }

  public createManualItemsBulk(dtos: { name: string; quantity?: string; unit?: string; weekStartDate: string }[]): Observable<any> {
    return this.httpClient.post(`${this.apiUrl}/grocery-list/manual/bulk`, { items: dtos });
  }

  public updateManualItem(itemId: string, dto: { name?: string; quantity?: string; unit?: string; checked?: boolean }): Observable<any> {
    return this.httpClient.patch(`${this.apiUrl}/grocery-list/manual/${itemId}`, dto);
  }

  public deleteManualItem(itemId: string): Observable<any> {
    return this.httpClient.delete(`${this.apiUrl}/grocery-list/manual/${itemId}`);
  }
}