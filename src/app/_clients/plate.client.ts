import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {catchError, Observable, of} from "rxjs";
import {PLateModel} from "./models/PLateModel";
import {listPlatesForTargetedDateModel} from "./models/list-plates-for-targeted-date.model";
import {PlateForCreationDto} from "../plates/choose-plate-page/dtos/plate-for-creation.dto";
import {
  LinkPlateListIdToSelectedDateDto
} from "../plates/choose-plate-page/dtos/link-plate-list-id-to-selected-date.dto";
import {PlateForUpdateDto} from "../plates/choose-plate-page/dtos/plate-for-update.dto";
import {PLateForWeekModel} from "./models/PLateForWeekModel";

@Injectable({providedIn: 'root'})
export class PlateClient {
  private apiUrl = 'http://localhost:3000';

  constructor(private httpClient: HttpClient) {
  }


  public getPlates(): Observable<PLateModel[]> {
    return this.httpClient.get<PLateModel[]>(`${this.apiUrl}/plates`);
  }

  public getPlatesForWeek(startDate: string): Observable<PLateForWeekModel[]> {
    return this.httpClient.get<PLateForWeekModel[]>(`${this.apiUrl}/plates-for-day/plate-list/${startDate}`);
  }

  public getPlateDetails(plateId: string): Observable<PLateModel> {
    return this.httpClient.get<PLateModel>(`${this.apiUrl}/plates/${plateId}`);
  }

  public createPlate(plateForCreationDto: PlateForCreationDto): Observable<PLateModel> {
    return this.httpClient.post<PLateModel>(`${this.apiUrl}/plates`, plateForCreationDto);
  }

  public linkPlateListToDate(date: string, plateListIdToSelectedDateDto: LinkPlateListIdToSelectedDateDto): Observable<string> {
    return this.httpClient.put<string>(`${this.apiUrl}/plates-for-day/${date}`, plateListIdToSelectedDateDto);
  }

  public updatePlateDetails(plateId: string, plateForUpdateDto: PlateForUpdateDto): Observable<PLateModel> {
    return this.httpClient.patch<PLateModel>(`${this.apiUrl}/plates/${plateId}`, plateForUpdateDto);
  }

  public listPlatesForTargetedDate(date: string): Observable<listPlatesForTargetedDateModel[]> {
    return this.httpClient.get<listPlatesForTargetedDateModel[]>(`${this.apiUrl}/plates-for-day/${date}`);
  }


  public deletePlate(plateId: string): Observable<PLateModel> {
    if (!plateId) {
      throw new Error('FoodId must not be null or undefined');
    }
    return this.httpClient.delete<PLateModel>(`${this.apiUrl}/plates/${plateId}`).pipe(
      catchError((error: any) => {
        console.error('Error deleting food', error);
        return of(error);
      })
    );
  }
}
