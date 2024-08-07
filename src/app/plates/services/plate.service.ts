import {map, Observable, startWith, Subject, switchMap, tap} from "rxjs";
import {Injectable} from "@angular/core";

import {PlateItemBo} from "../bos/plate-item.bo";
import {PlateClient} from "../../_clients/plate.client";
import {PLateModel} from "../../_clients/models/PLateModel";
import {listPlatesForTargetedDateModel} from "../../_clients/models/list-plates-for-targeted-date.model";
import {LinkPlateListIdToSelectedDateDto} from "../choose-plate-page/dtos/link-plate-list-id-to-selected-date.dto";
import {PlateForCreationDto} from "../choose-plate-page/dtos/plate-for-creation.dto";
import {PlateForUpdateDto} from "../choose-plate-page/dtos/plate-for-update.dto";


@Injectable({providedIn: 'root'})
export class PlateService {
  public plate: any;
  public date: string;
  public editable: boolean;
  private plateListTrigger$ = new Subject();

  constructor(private plateClient: PlateClient) {
  }

  public refreshPlateList() {
    this.plateListTrigger$.next(null);
  }

  public getPlates(): Observable<PlateItemBo[]> {
    return this.plateListTrigger$
      .pipe(
        startWith(null),
        switchMap(() => {
          return this.plateClient
            .getPlates()
            .pipe(
              map((foodModelList: PLateModel[]) => {
                return foodModelList.map(foodModel => {
                  return new PlateItemBo(foodModel);
                })
              })
            )
        })
      )
  }

  public getPlateDetails(foodId: string): Observable<any> {
    return this.plateClient.getPlateDetails(foodId);
  }

  public linkPlateListToDate(date: string, foodListIdToSelectedDateDto: LinkPlateListIdToSelectedDateDto): Observable<string> {
    return this.plateClient.linkPlateListToDate(date, foodListIdToSelectedDateDto);
  }

  public listPlatesForTargetedDate(targetedDate: string): Observable<listPlatesForTargetedDateModel[]> {
    return this.plateClient.listPlatesForTargetedDate(targetedDate);
  }

  public Plate(foodFormValue: any): Observable<any> {
    const foodForCreationDto = new PlateForCreationDto(foodFormValue.label, foodFormValue.description);
    return this.plateClient
      .createPlate(foodForCreationDto)
      .pipe(
        tap(() => {
          this.refreshPlateList();
        })
      )
  }

  public updatePlateDetails(foodId: string, foodFormValue: any): Observable<any> {
    const foodForUpdateDto = new PlateForUpdateDto(foodFormValue.label, foodFormValue.description);
    return this.plateClient.updatePlateDetails(foodId, foodForUpdateDto);
  }

  public deletePlate(foodId: string): Observable<any> {
    return this.plateClient.deletePlate(foodId).pipe(
      tap(() => {
        this.refreshPlateList();
      })
    )
  }
}


