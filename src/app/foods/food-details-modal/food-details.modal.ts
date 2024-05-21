import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, Validators} from "@angular/forms";
import {ModalController, ToastController} from "@ionic/angular";

import {FoodService} from "../services/food.service";
import {FoodItemBo} from "../bos/food-item.bo";
import {firstValueFrom} from "rxjs";

@Component({
  selector: 'food-details-modal',
  templateUrl: './food-details.modal.html',
  styleUrls: ['./food-details.modal.scss'],
})

export class FoodDetailsModal implements OnInit {
  @Input() foodForEdit: FoodItemBo;

  public foodForm = this.formBuilder.group({
    label: ['', Validators.required],
    description: ['', Validators.required]
  });

  constructor(private formBuilder: FormBuilder,
              private foodService: FoodService,
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
    this.closeModal();
  }

  public async presentToast() {
    if (this.foodService.editable == true) {
      const toast = await this.toastController.create({
        message: 'Your food is up to date!',
        duration: 2000
      });
      toast.present();
    } else {
      const toast = await this.toastController.create({
        message: 'Your food is added!',
        duration: 2000
      });
      toast.present();
    }
  }

  public closeModal() {
    this.modalController.dismiss().then(r => {
    });
  }
}
