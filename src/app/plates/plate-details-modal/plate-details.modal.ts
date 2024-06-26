import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, Validators} from "@angular/forms";
import {ModalController, ToastController} from "@ionic/angular";

import {PlateService} from "../services/plate.service";
import {PlateItemBo} from "../bos/plate-item.bo";
import {firstValueFrom} from "rxjs";

@Component({
  selector: 'food-details-modal',
  templateUrl: './plate-details.modal.html',
  styleUrls: ['./plate-details.modal.scss'],
})

export class PlateDetailsModal implements OnInit {
  @Input() foodForEdit: PlateItemBo;

  public foodForm = this.formBuilder.group({
    label: ['', Validators.required],
    description: ['', Validators.required]
  });

  constructor(private formBuilder: FormBuilder,
              private foodService: PlateService,
              private modalController: ModalController,
              private toastController: ToastController
  ) {
  }

  ngOnInit() {
    if (!this.foodForEdit) {
      return;
    }
    this.foodForm.patchValue({
      label: this.foodForEdit.label,
      description: this.foodForEdit.description
    })
  }

  public async saveFood() {
    if (this.foodService.editable) {
      await firstValueFrom(this.foodService.updateFoodDetails(this.foodForEdit.id, this.foodForm.value));
    } else {
      await firstValueFrom(this.foodService.createFood(this.foodForm.value));
    }
    await this.presentToast();
    await this.closeModal();
  }

  public async presentToast() {
    if (this.foodService.editable) {
      const toast = await this.toastController.create({
        message: 'Your food is up to date!',
        duration: 2000
      });
      await toast.present();
    } else {
      const toast = await this.toastController.create({
        message: 'Your food is added!',
        duration: 2000
      });
      await toast.present();
    }
  }

  public async closeModal() {
    await this.modalController.dismiss();
  }
}
