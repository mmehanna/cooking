import {Component, OnDestroy, OnInit} from "@angular/core";
import {ModalController, ToastController} from "@ionic/angular";
import {lastValueFrom, Subscription} from "rxjs";
import {HttpErrorResponse} from "@angular/common/http";
import {formatDate, Location} from "@angular/common";
import {TranslateService} from "@ngx-translate/core";
import {PlateService} from "../services/plate.service";
import {PlateItemBo} from "../bos/plate-item.bo";
import {LinkPlateListIdToSelectedDateDto} from "./dtos/link-plate-list-id-to-selected-date.dto";
import {PlateWithMealTypeDto} from "./dtos/plate-with-meal-type.dto";
import {PlateDetailsModal} from "../plate-details-modal/plate-details.modal";
import {Router} from "@angular/router";

@Component({
  templateUrl: "choose-plate.page.html",
  styleUrls: ["choose-plate.page.scss"],
})

export class ChoosePlatePage implements OnInit, OnDestroy {
  public plateList: PlateItemBo[] = [];
  public filteredPlateList: PlateItemBo[] = [];
  public selectedMealType: "breakfast" | "lunch" | "dinner" = "dinner";
  public selectedSegment: "all" | "breakfast" | "lunch" | "dinner" = "all";
  public maxPlates = 3;

  private subscription$ = new Subscription();
  private plateListWithMealType: LinkPlateListIdToSelectedDateDto = new LinkPlateListIdToSelectedDateDto([]);

  constructor(private plateService: PlateService,
              private modalController: ModalController,
              private toastController: ToastController,
              private router: Router,
              private location: Location,
              private translate: TranslateService,
  ) {
  }

  public get selectedPlateCount(): number {
    return this.plateListWithMealType.plateList.length;
  }

  ngOnInit() {
    this.getPlateSubscription();
  }

  public onSegmentChange(event: any) {
    const selectedSegment = event.detail.value as "all" | "breakfast" | "lunch" | "dinner";
    this.applySegmentFilter(selectedSegment);
  }

  public setSegment(value: "all" | "breakfast" | "lunch" | "dinner") {
    this.applySegmentFilter(value);
  }

  private applySegmentFilter(selectedSegment: "all" | "breakfast" | "lunch" | "dinner") {
    this.selectedSegment = selectedSegment;

    if (selectedSegment === "all") {
      this.filteredPlateList = this.plateList;
    } else {
      this.selectedMealType = selectedSegment;
      this.filteredPlateList = this.plateList.filter(plate => plate.category === selectedSegment);
    }
  }

  private getPlateSubscription() {
    const plateListSubscription$ = this.plateService
      .getPlates()
      .subscribe((plateList: PlateItemBo[]) => {
        this.plateList = plateList;
        this.filteredPlateList = [...this.plateList];

        this.plateList.forEach(plate => {
          if (!plate.selectedMealType) {
            plate.selectedMealType = this.selectedMealType;
          }
        });

        this.restoreSelectionForCurrentDate();
      });
    this.subscription$.add(plateListSubscription$);
  }

  private async restoreSelectionForCurrentDate() {
    if (!this.plateService.date) {
      return;
    }

    try {
      const formattedDate = formatDate(this.plateService.date, "yyyy-MM-dd", "en-US");
      const selectedPlates = await lastValueFrom(this.plateService.listPlatesForTargetedDate(formattedDate));
      const mealTypeByPlateId = new Map<string, "breakfast" | "lunch" | "dinner">();

      selectedPlates.forEach((plate) => {
        const mealType = (plate.mealType || "dinner") as "breakfast" | "lunch" | "dinner";
        mealTypeByPlateId.set(plate.id, mealType);
      });

      this.plateListWithMealType = new LinkPlateListIdToSelectedDateDto([]);
      this.plateList.forEach((plate) => {
        const mealType = mealTypeByPlateId.get(plate.id);
        plate.isSelected = !!mealType;
        if (mealType) {
          plate.selectedMealType = mealType;
          this.plateListWithMealType.plateList.push({
            plateId: plate.id,
            mealType
          });
        }
      });
    } catch (err) {
      console.error("Error restoring selected plates for date:", err);
    }
  }

  public async togglePlateSelection(plate: PlateItemBo) {
    const wasSelected = plate.isSelected;
    plate.isSelected = !wasSelected;

    if (plate.isSelected) {
      if (this.plateListWithMealType.plateList.length >= this.maxPlates) {
        await this.quantityErrorMessage();
        plate.isSelected = false;
        return;
      }

      const plateWithMealType: PlateWithMealTypeDto = {
        plateId: plate.id,
        mealType: plate.selectedMealType || this.selectedMealType
      };
      this.plateListWithMealType.plateList.push(plateWithMealType);
    } else {
      const index = this.plateListWithMealType.plateList.findIndex(item => item.plateId === plate.id);
      if (index > -1) {
        this.plateListWithMealType.plateList.splice(index, 1);
      }
    }
  }

  public updatePlateMealType(plate: PlateItemBo) {
    const existingIndex = this.plateListWithMealType.plateList.findIndex(item => item.plateId === plate.id);
    if (existingIndex > -1) {
      this.plateListWithMealType.plateList[existingIndex].mealType = plate.selectedMealType;
    }
  }

  public async linkPlateListToDate() {
    try {
      this.plateService.date = formatDate(this.plateService.date, "yyyy-MM-dd", "en-US");
      await lastValueFrom(this.plateService.linkPlateListToDate(this.plateService.date, this.plateListWithMealType));

      const toast = await this.toastController.create({
        message: this.translate.instant("CHOOSE_PLATE.SAVE_SUCCESS"),
        duration: 2000,
        color: "success"
      });
      await toast.present();

      setTimeout(() => {
        this.router.navigate(["/landing"]);
      }, 2000);

    } catch (err) {
      console.error("Error on the service:", err);
      if (err instanceof HttpErrorResponse) {
        console.error("Response body:", err.error);

        if (err.status === 400 && err.error && err.error.message) {
          console.error("Validation Errors:", err.error.message);
        }
      }

      const errorToast = await this.toastController.create({
        message: this.translate.instant("CHOOSE_PLATE.SAVE_FAILED"),
        duration: 2000,
        color: "danger"
      });
      await errorToast.present();
    }
  }

  public presentCreatePlateModal() {
    this.modalController.create({
      component: PlateDetailsModal
    }).then(modal => {
      modal.present();
    });
  }
  private async quantityErrorMessage() {
    const toast = await this.toastController.create({
      message: this.translate.instant("CHOOSE_PLATE.MAX_PLATES_EXCEEDED"),
      duration: 3000,
      position: "top"
    });
    await toast.present();
  }

  public goBack() {
    this.location.back();
  }

  public cancelAndClose() {
    this.router.navigate(["/landing"]);
  }

  ngOnDestroy() {
    this.subscription$.unsubscribe();
  }
}
