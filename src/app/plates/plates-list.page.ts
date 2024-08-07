import {Component, OnInit} from '@angular/core';
import {PlateItemBo} from "./bos/plate-item.bo";
import {PlateService} from "./services/plate.service";
import {firstValueFrom, Subscription} from "rxjs";
import {ModalController, ToastController} from "@ionic/angular";
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
              private toastController: ToastController
  ) {
  }

  ngOnInit() {
    this.getPlateSubscription();
  }

  public presentDetailEditPlateModal(plate: PlateItemBo) {
    this.plateService.editable = true;

    this.modalController.create({
      component: PlateDetailsModal,
      componentProps: {
        plateForEdit: plate
      }
    }).then(modal => {
      modal.present().then(r => {
      });
    })
  }

  public async presentDetailAddPlateModal() {
    this.plateService.editable = false;

    await this.modalController.create({
      component: PlateDetailsModal
    }).then(modal => {
      modal.present();
    })
  }

  public async deletePlate(plate: PLateModel) {
    try {
      await firstValueFrom(this.plateService.deletePlate(plate.id));
      await this.toastController.create({
        message: "Delete successful"
      });
    } catch (err: any) {
      await this.toastController.create({
        message: "Delete unsuccessful"
      });
    }
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
