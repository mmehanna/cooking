import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {UUID} from "angular2-uuid";
import {FoodModel} from "./models/food.model";
import {listFoodsForTargetedDateModel} from "./models/list-foods-for-targeted-date.model";
import {FoodForCreationDto} from "../foods/choose-food-page/dtos/food-for-creation.dto";
import {LinkFoodListIdToSelectedDateDto} from "../foods/choose-food-page/dtos/link-food-list-id-to-selected-date.dto";

@Injectable({providedIn: 'root'})
export class FoodClient {
  private apiUrl = 'http://localhost:3000';

  constructor(private httpClient: HttpClient) {
  }

  public getFoods(): Observable<FoodModel[]> {
    return this.httpClient.get<FoodModel[]>(`${this.apiUrl}/foods`);
  }

  public getFoodDetails(foodId: UUID): Observable<FoodModel> {
    return this.httpClient.get<FoodModel>(`${this.apiUrl}/foods/${foodId}`);
  }

  public createFood(foodForCreationDto: FoodForCreationDto): Observable<FoodModel> {
    return this.httpClient.post<FoodModel>(`${this.apiUrl}/foods`, foodForCreationDto);
  }

  public linkFoodListToDate(date: string, foodListIdToSelectedDateDto: LinkFoodListIdToSelectedDateDto): Observable<string> {
    return this.httpClient.put<string>(`${this.apiUrl}/foods-for-day/${date}`, foodListIdToSelectedDateDto);
  }

  public listFoodsForTargetedDate(date: string): Observable<listFoodsForTargetedDateModel[]> {
    return this.httpClient.get<listFoodsForTargetedDateModel[]>(`${this.apiUrl}/foods-for-day/${date}`);
  }
}
