import {Component, OnInit} from '@angular/core';
import {PlateItemBo} from "./bos/plate-item.bo";
import {PlateService} from "./services/plate.service";
import {firstValueFrom, Subscription} from "rxjs";
import {AlertController, ModalController} from "@ionic/angular";
import {PLateModel} from "../_clients/models/PLateModel";
import {PlateDetailsModal} from "./plate-details-modal/plate-details.modal";

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

  public async presentDetailAddPlateModal() {
    this.plateService.editable = false;

    await this.modalController.create({
      component: PlateDetailsModal
    }).then(modal => {
      modal.present();
    })
  }

  public async confirmDeletePlate(plate: PLateModel) {
    const alert = await this.alertController.create({
      header: 'Confirm Delete',
      message: 'Are you sure you want to delete this plate?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Delete cancelled');
          }
        },
        {
          text: 'Delete',
          handler: () => {
            firstValueFrom(this.plateService.deletePlate(plate.id));
          }
        }
      ]
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
