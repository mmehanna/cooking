import {Component, OnInit} from '@angular/core';
import {PlateItemBo} from "./bos/plate-item.bo";
import {PlateService} from "./services/plate.service";
import {firstValueFrom, Subscription} from "rxjs";
import {AlertController, ModalController, ToastController} from "@ionic/angular";
import {PLateModel} from "../_clients/models/PLateModel";
import {PlateDetailsModal} from "./plate-details-modal/plate-details.modal";
import {SharePlateModalComponent} from "./share-plate-modal/share-plate-modal.component";

@Component({
  selector: 'app-add-plates-with-a-list-page',
  templateUrl: './plates-list.page.html',
  styleUrls: ['./plates-list.page.scss'],
})
export class PlatesListPage implements OnInit {
  public plateList: PlateItemBo[];
  private subscription$ = new Subscription();

  constructor(private plateService: PlateService,
              private modalController: ModalController,
              private toastController: ToastController,
              private alertController: AlertController
  ) {
  }

  ngOnInit() {
    this.getPlateSubscription();
  }

  public presentDetailEditPlateModal(plate: PlateItemBo) {
    this.plateService.editable = true;

    const modal = this.modalController.create({
      component: PlateDetailsModal,
      componentProps: {
        plateForEdit: plate,
        'saveEvent': () => this.refreshPage()
      }
    }).then(modal => {
      modal.present().then(r => {
      });
    })
  }

  refreshPage() {
    // Logique pour actualiser les données de la page
    console.log('Données actualisées');
  }

  public async presentSharePlateModal(plate: PlateItemBo) {
    const modal = await this.modalController.create({
      component: SharePlateModalComponent,
      componentProps: {
        plateId: plate.id,
        plateLabel: plate.label
      }
    });

    modal.present();
  }

  // public presentDetailEditPlateModal(plate: PlateItemBo) {
  //   this.plateService.editable = true;
  //
  //   this.modalController.create({
  //     component: PlateDetailsModal,
  //     componentProps: {
  //       plateForEdit: plate
  //     }
  //   }).then(modal => {
  //     modal.present().then(r => {
  //     });
  //   })
  // }

  public async presentDetailAddPlateModal() {
    this.plateService.editable = false;

    await this.modalController.create({
      component: PlateDetailsModal
    }).then(modal => {
      modal.present();
    })
  }

  public async deletePlate(plate: PLateModel) {
    const alert = await this.alertController.create({
      header: 'Confirm Delete',
      message: `Are you sure you want to delete the plate "${plate.label}"?`,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'Delete',
          handler: () => {
            console.log('Attempting to delete plate with ID:', plate.id);

            // Supprimer immédiatement de l'interface utilisateur pour une meilleure UX
            const plateIndex = this.plateList.findIndex(p => p.id === plate.id);
            if (plateIndex !== -1) {
              this.plateList.splice(plateIndex, 1);
              this.plateList = [...this.plateList]; // Créer un nouvel objet tableau pour forcer la mise à jour
            }

            this.plateService.deletePlate(plate.id).subscribe({
              next: async () => {
                console.log('Plate deleted successfully from server');
                const toast = await this.toastController.create({
                  message: "Delete successful",
                  duration: 2000
                });
                await toast.present();
              },
              error: async (err: any) => {
                console.error('Error deleting plate:', err);
                console.error('Error details:', err.error);
                console.error('Status:', err.status);
                console.error('URL:', err.url);

                let errorMessage = 'Delete unsuccessful';
                if (err.error && typeof err.error === 'object' && err.error.message) {
                  errorMessage += `: ${err.error.message}`;
                } else if (err.message) {
                  errorMessage += `: ${err.message}`;
                } else {
                  errorMessage += ': Unknown server error';
                }

                const toast = await this.toastController.create({
                  message: errorMessage,
                  duration: 3000
                });
                await toast.present();

                // Réactualiser la liste pour restaurer le plat en cas d'erreur
                this.getPlateSubscription();
              }
            });
          },
        },
      ],
    });

    await alert.present();
  }

  private getPlateSubscription() {
    const foodListSubscription$ = this.plateService
      .getPlates()
      .subscribe((foodList: PlateItemBo[]) => {
        this.plateList = foodList;
        console.log(foodList);
      });
    this.subscription$.add(foodListSubscription$);
  }
}
