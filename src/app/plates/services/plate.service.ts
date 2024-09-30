import {map, Observable, startWith, Subject, switchMap, tap} from "rxjs";
import {Injectable} from "@angular/core";

import {PlateItemBo} from "../bos/plate-item.bo";
import {PlateClient} from "../../_clients/plate.client";
import {PLateModel} from "../../_clients/models/PLateModel";
import {listPlatesForTargetedDateModel} from "../../_clients/models/list-plates-for-targeted-date.model";
import {LinkPlateListIdToSelectedDateDto} from "../choose-plate-page/dtos/link-plate-list-id-to-selected-date.dto";
import {PlateForCreationDto} from "../choose-plate-page/dtos/plate-for-creation.dto";
import {PlateForUpdateDto} from "../choose-plate-page/dtos/plate-for-update.dto";
import {PLateForWeekModel} from "../../_clients/models/PLateForWeekModel";


@Injectable({providedIn: 'root'})
export class PlateService {
  public editable: boolean;
  private plateListTrigger$ = new Subject();
  date: string;


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
              map((plateModelList: PLateModel[]) => {
                return plateModelList.map(plateModel => {
                  return new PlateItemBo(plateModel);
                })
              })
            )
        })
      )
  }

  public getPlateDetails(plateId: string): Observable<any> {
    return this.plateClient.getPlateDetails(plateId);
  }

  public linkPlateListToDate(date: string, plateListIdToSelectedDateDto: LinkPlateListIdToSelectedDateDto): Observable<string> {
    return this.plateClient.linkPlateListToDate(date, plateListIdToSelectedDateDto);
  }

  public listPlatesForTargetedDate(targetedDate: string): Observable<listPlatesForTargetedDateModel[]> {
    return this.plateClient.listPlatesForTargetedDate(targetedDate);
  }

  public Plate(plateFormValue: any): Observable<any> {
    const plateForCreationDto = new PlateForCreationDto(plateFormValue.label, plateFormValue.description);
    return this.plateClient
      .createPlate(plateForCreationDto)
      .pipe(
        tap(() => {
          this.refreshPlateList();
        })
      )
  }

  public updatePlateDetails(plateId: string, plateFormValue: any): Observable<any> {
    const plateForUpdateDto = new PlateForUpdateDto(plateFormValue.label, plateFormValue.description);
    return this.plateClient.updatePlateDetails(plateId, plateForUpdateDto);
  }

  public deletePlate(plateId: string): Observable<any> {
    return this.plateClient.deletePlate(plateId).pipe(
      tap(() => {
        this.refreshPlateList();
      })
    )
  }

  public getPlatesForWeek(startDate: string): Observable<PLateForWeekModel[]> {
    return this.plateClient.getPlatesForWeek(startDate);
  }

}


