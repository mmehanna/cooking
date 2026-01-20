import {Component, OnDestroy, OnInit} from '@angular/core';
import {ModalController, ToastController} from "@ionic/angular";
import {lastValueFrom, Subscription} from "rxjs";
import {HttpErrorResponse} from "@angular/common/http";
import {formatDate} from "@angular/common";
import {PlateService} from "../services/plate.service";
import {PlateItemBo} from "../bos/plate-item.bo";
import {LinkPlateListIdToSelectedDateDto} from "./dtos/link-plate-list-id-to-selected-date.dto";
import {PlateDetailsModal} from "../plate-details-modal/plate-details.modal";

@Component({
  templateUrl: 'choose-plate.page.html',
  styleUrls: ['choose-plate.page.scss'],
})

export class ChoosePlatePage implements OnInit, OnDestroy {
  public plateList: PlateItemBo[] = [];
  private subscription$ = new Subscription();
  private plateListId: LinkPlateListIdToSelectedDateDto = new LinkPlateListIdToSelectedDateDto([]);
  public filteredPlateList: PlateItemBo[] = [];

  constructor(private plateService: PlateService,
              private modalController: ModalController,
              private toastController: ToastController,
  ) {
  }

  ngOnInit() {
    this.getPlateSubscription();
  }

  public onSegmentChange(event: any) {
    const selectedSegment = event.detail.value;

    if (selectedSegment === 'all') {
      this.filteredPlateList = this.plateList;
      console.log('Tous les plats :', this.filteredPlateList);

    } else {
      this.filteredPlateList = this.plateList.filter(plate => plate.category === selectedSegment);
      console.log('Plats filtrés :', this.filteredPlateList);
    }
  }

  private getPlateSubscription() {
    const plateListSubscription$ = this.plateService
      .getPlates()
      .subscribe((plateList: PlateItemBo[]) => {
        this.plateList = plateList;
        this.filteredPlateList = [...this.plateList]; // Mettre à jour filteredPlateList avec les données récupérées
        console.log(this.plateList);
      });
    this.subscription$.add(plateListSubscription$);
  }

  public async togglePlateSelection(plate: PlateItemBo) {
    const wasSelected = plate.isSelected;
    plate.isSelected = !plate.isSelected;

    if (plate.isSelected) {
      // Vérifier la limite avant d'ajouter
      if (this.plateListId.plateListId.length >= 3) {
        await this.quantityErrorMessage();
        plate.isSelected = false; // Annuler la sélection
        return;
      }
      this.plateListId.plateListId.push(plate.id);
    } else {
      console.log("plate is not selected");
      // Retirer l'ID spécifique de la liste
      const index = this.plateListId.plateListId.indexOf(plate.id);
      if (index > -1) {
        this.plateListId.plateListId.splice(index, 1);
      }
    }

    // Vérifier la quantité après modification
    if (this.plateListId.plateListId.length > 3) {
      await this.quantityErrorMessage();
      // Réinitialiser la sélection si la limite est dépassée
      if (!wasSelected) { // Si on venait de sélectionner
        plate.isSelected = false;
        const index = this.plateListId.plateListId.indexOf(plate.id);
        if (index > -1) {
          this.plateListId.plateListId.splice(index, 1);
        }
      }
    }
  }

  public async linkPlateListToDate() {
    try {
      this.plateService.date = formatDate(this.plateService.date, 'yyyy-MM-dd', 'en-US');
      const response = await lastValueFrom(this.plateService.linkPlateListToDate(this.plateService.date, this.plateListId));

    } catch (err) {
      // Log the error details, including the response body
      console.error('Error on the service:', err);
      if (err instanceof HttpErrorResponse) {
        console.error('Response body:', err.error);

        // Handle specific validation errors
        if (err.status === 400 && err.error && err.error.message) {
          const validationMessages = err.error.message;

          // Display validation messages to the user or handle them appropriately
          console.error('Validation Errors:', validationMessages);
        }
      }
    }
  }

  public presentCreatePlateModal() {
    this.modalController.create({
      component: PlateDetailsModal
    }).then(modal => {
      modal.present();
    })
  }



  private async quantityErrorMessage() {
    const toast = await this.toastController.create({
      message: "You have exceeded the number of food per day! The number allowed is three.",
      duration: 3000,
      position: 'top'
    });
    await toast.present();
  }

  ngOnDestroy() {
    this.subscription$.unsubscribe();
  }
}
