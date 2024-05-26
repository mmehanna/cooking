import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {catchError, Observable, of} from "rxjs";
import {FoodModel} from "./models/food.model";
import {listFoodsForTargetedDateModel} from "./models/list-foods-for-targeted-date.model";
import {FoodForCreationDto} from "../foods/choose-food-page/dtos/food-for-creation.dto";
import {LinkFoodListIdToSelectedDateDto} from "../foods/choose-food-page/dtos/link-food-list-id-to-selected-date.dto";
import {FoodForUpdateDto} from "../foods/choose-food-page/dtos/food-for-update.dto";

@Injectable({providedIn: 'root'})
export class FoodClient {
  private apiUrl = 'http://localhost:3000';

  constructor(private httpClient: HttpClient) {
  }

  public getFoods(): Observable<FoodModel[]> {
    return this.httpClient.get<FoodModel[]>(`${this.apiUrl}/foods`);
  }

  public getFoodDetails(foodId: string): Observable<FoodModel> {
    return this.httpClient.get<FoodModel>(`${this.apiUrl}/foods/${foodId}`);
  }

  public createFood(foodForCreationDto: FoodForCreationDto): Observable<FoodModel> {
    return this.httpClient.post<FoodModel>(`${this.apiUrl}/foods`, foodForCreationDto);
  }

  public linkFoodListToDate(date: string, foodListIdToSelectedDateDto: LinkFoodListIdToSelectedDateDto): Observable<string> {
    return this.httpClient.put<string>(`${this.apiUrl}/foods-for-day/${date}`, foodListIdToSelectedDateDto);
  }

  public updateFoodDetails(foodId: string, foodForUpdateDto: FoodForUpdateDto): Observable<FoodModel> {
    return this.httpClient.put<FoodModel>(`${this.apiUrl}/foods/${foodId}`, foodForUpdateDto);
  }

  public listFoodsForTargetedDate(date: string): Observable<listFoodsForTargetedDateModel[]> {
    return this.httpClient.get<listFoodsForTargetedDateModel[]>(`${this.apiUrl}/foods-for-day/${date}`);
  }

  public deleteFood(foodId: string): Observable<FoodModel> {
    if (!foodId) {
      throw new Error('FoodId must not be null or undefined');
    }
    return this.httpClient.delete<FoodModel>(`${this.apiUrl}/foods/${foodId}`).pipe(
      catchError((error: any) => {
        console.error('Error deleting food', error);
        return of(error);
      })
    );
  }
}
