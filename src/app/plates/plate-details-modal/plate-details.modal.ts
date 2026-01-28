import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, Validators} from "@angular/forms";
import {ModalController, ToastController} from "@ionic/angular";

import {PlateService} from "../services/plate.service";
import {PlateItemBo} from "../bos/plate-item.bo";
import {firstValueFrom} from "rxjs";
import {AuthService} from "../services/auth.service";

@Component({
  selector: 'plate-details-modal',
  templateUrl: './plate-details.modal.html',
  styleUrls: ['./plate-details.modal.scss'],
})

export class PlateDetailsModal implements OnInit {
  @Input() plateForEdit: PlateItemBo;
  @Output() saveEvent = new EventEmitter<void>();
  selectedCategory: string = '';
  public plateForm = this.formBuilder.group({
    label: ['', Validators.required],
    description: ['', Validators.required],
    category: ['']
  });


  constructor(private formBuilder: FormBuilder,
              private plateService: PlateService,
              private modalController: ModalController,
              private toastController: ToastController,
              private authService: AuthService
  ) {
  }

  ngOnInit() {
    if (!this.plateForEdit) {
      return;
    }
    this.plateForm.patchValue({
      label: this.plateForEdit.label,
      description: this.plateForEdit.description,
      category: this.plateForEdit.category
    });
    this.selectedCategory = this.plateForEdit.category;
  }

  public async savePlate() {
    // Check if user is authenticated before making API calls
    const isAuthenticated = this.authService.isAuthenticated();
    console.log('User is authenticated:', isAuthenticated);

    if (!isAuthenticated) {
      console.error('User is not authenticated. Cannot save plate.');
      // Show an error message to the user
      const toast = await this.toastController.create({
        message: 'Authentication required. Please log in.',
        duration: 3000
      });
      await toast.present();
      return;
    }

    if (this.plateService.editable) {
      await firstValueFrom(this.plateService.updatePlateDetails(this.plateForEdit.id, this.plateForm.value));
    } else {
      await firstValueFrom(this.plateService.createPlate(this.plateForm.value));
      console.log(this.plateForm.value);
    }

    await this.presentToast();
    await this.closeModal();
    window.location.reload();
    console.log(this.selectedCategory);
  }

  public async presentToast() {
    if (this.plateService.editable) {
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
