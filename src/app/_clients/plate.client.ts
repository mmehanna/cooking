import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {catchError, Observable, of} from "rxjs";
import {FoodModel} from "./models/food.model";
import {listFoodsForTargetedDateModel} from "./models/list-foods-for-targeted-date.model";
import {PlateForCreationDto} from "../plates/choose-plate-page/dtos/plate-for-creation.dto";
import {
  LinkPlateListIdToSelectedDateDto
} from "../plates/choose-plate-page/dtos/link-plate-list-id-to-selected-date.dto";
import {PlateForUpdateDto} from "../plates/choose-plate-page/dtos/plate-for-update.dto";

@Injectable({providedIn: 'root'})
export class AuthClient {
  private apiUrl = 'http://localhost:3000';

  constructor(private httpClient: HttpClient) {
  }

  public getFoods(): Observable<FoodModel[]> {
    return this.httpClient.get<FoodModel[]>(`${this.apiUrl}/foods`);
  }

  public getFoodDetails(foodId: string): Observable<FoodModel> {
    return this.httpClient.get<FoodModel>(`${this.apiUrl}/foods/${foodId}`);
  }

  public createFood(foodForCreationDto: PlateForCreationDto): Observable<FoodModel> {
    return this.httpClient.post<FoodModel>(`${this.apiUrl}/foods`, foodForCreationDto);
  }

  // public createUser(userForCreationDto: UserForCreationDto): Observable<FoodModel> {
  //   return this.httpClient.post<FoodModel>(`${this.apiUrl}/foods`, userForCreationDto);
  // }

  public linkFoodListToDate(date: string, foodListIdToSelectedDateDto: LinkPlateListIdToSelectedDateDto): Observable<string> {
    return this.httpClient.put<string>(`${this.apiUrl}/foods-for-day/${date}`, foodListIdToSelectedDateDto);
  }

  public updateFoodDetails(foodId: string, foodForUpdateDto: PlateForUpdateDto): Observable<FoodModel> {
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
