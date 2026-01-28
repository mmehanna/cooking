import {Component, OnDestroy, OnInit} from '@angular/core';
import {ModalController, ToastController} from "@ionic/angular";
import {lastValueFrom, Subscription} from "rxjs";
import {HttpErrorResponse} from "@angular/common/http";
import {formatDate} from "@angular/common";
import {PlateService} from "../services/plate.service";
import {PlateItemBo} from "../bos/plate-item.bo";
import {LinkPlateListIdToSelectedDateDto} from "./dtos/link-plate-list-id-to-selected-date.dto";
import {PlateWithMealTypeDto} from "./dtos/plate-with-meal-type.dto";
import {PlateDetailsModal} from "../plate-details-modal/plate-details.modal";
import {Router} from "@angular/router";

@Component({
  templateUrl: 'choose-plate.page.html',
  styleUrls: ['choose-plate.page.scss'],
})

export class ChoosePlatePage implements OnInit, OnDestroy {
  public plateList: PlateItemBo[] = [];
  private subscription$ = new Subscription();
  private plateListWithMealType: LinkPlateListIdToSelectedDateDto = new LinkPlateListIdToSelectedDateDto([]);
  public filteredPlateList: PlateItemBo[] = [];
  public selectedMealType: 'breakfast' | 'lunch' | 'dinner' = 'dinner'; // Valeur par défaut

  constructor(private plateService: PlateService,
              private modalController: ModalController,
              private toastController: ToastController,
              private router: Router,
  ) {
  }

  ngOnInit() {
    this.getPlateSubscription();
  }

  public onSegmentChange(event: any) {
    const selectedSegment = event.detail.value;
    this.selectedMealType = selectedSegment;

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

        // Initialize selectedMealType for each plate
        this.plateList.forEach(plate => {
          if (!plate.selectedMealType) {
            plate.selectedMealType = this.selectedMealType;
          }
        });

        console.log(this.plateList);
      });
    this.subscription$.add(plateListSubscription$);
  }

  public async togglePlateSelection(plate: PlateItemBo) {
    // Créer une copie de l'état avant modification
    const wasSelected = plate.isSelected;

    // Inverser l'état de sélection
    plate.isSelected = !wasSelected;

    if (plate.isSelected) {
      // Vérifier la limite avant d'ajouter
      if (this.plateListWithMealType.plateList.length >= 3) {
        await this.quantityErrorMessage();
        // Annuler la sélection si la limite est atteinte
        plate.isSelected = false;
        return;
      }

      // Ajouter le plat avec son type de repas
      const plateWithMealType: PlateWithMealTypeDto = {
        plateId: plate.id,
        mealType: plate.selectedMealType || this.selectedMealType
      };
      this.plateListWithMealType.plateList.push(plateWithMealType);
    } else {
      // Retirer l'entrée spécifique de la liste
      const index = this.plateListWithMealType.plateList.findIndex(item => item.plateId === plate.id);
      if (index > -1) {
        this.plateListWithMealType.plateList.splice(index, 1);
      }
    }

    console.log(`Plate ${plate.label} selected: ${plate.isSelected}, Total selected: ${this.plateListWithMealType.plateList.length}`);
  }

  public updatePlateMealType(plate: PlateItemBo) {
    // Find and update the meal type for this plate in the list
    const existingIndex = this.plateListWithMealType.plateList.findIndex(item => item.plateId === plate.id);
    if (existingIndex > -1) {
      this.plateListWithMealType.plateList[existingIndex].mealType = plate.selectedMealType;
    }
  }

  public async linkPlateListToDate() {
    try {
      this.plateService.date = formatDate(this.plateService.date, 'yyyy-MM-dd', 'en-US');
      const response = await lastValueFrom(this.plateService.linkPlateListToDate(this.plateService.date, this.plateListWithMealType));

      // Afficher un message de succès et rediriger
      const toast = await this.toastController.create({
        message: 'Plates saved successfully!',
        duration: 2000,
        color: 'success'
      });
      await toast.present();

      // Rediriger vers la page landing après un court délai
      setTimeout(() => {
        this.router.navigate(['/landing']);
      }, 2000);

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

      // Afficher un message d'erreur
      const errorToast = await this.toastController.create({
        message: 'Failed to save plates. Please try again.',
        duration: 2000,
        color: 'danger'
      });
      await errorToast.present();
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
