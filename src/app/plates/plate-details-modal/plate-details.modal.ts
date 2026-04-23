import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, Validators} from "@angular/forms";
import {ModalController, ToastController} from "@ionic/angular";

import {PlateService} from "../services/plate.service";
import {PlateItemBo} from "../bos/plate-item.bo";
import {firstValueFrom} from "rxjs";
import {AuthService} from "../services/auth.service";
import {IngredientService} from "../services/ingredient.service";

@Component({
  selector: 'plate-details-modal',
  templateUrl: './plate-details.modal.html',
  styleUrls: ['./plate-details.modal.scss'],
})

export class PlateDetailsModal implements OnInit {
  @Input() plateForEdit: PlateItemBo;
  @Output() saveEvent = new EventEmitter<void>();
  selectedCategory: string = '';
  ingredients: { name: string; quantity: string; unit: string }[] = [];
  public plateForm = this.formBuilder.group({
    label: ['', Validators.required],
    description: ['', Validators.required],
    category: ['']
  });


  constructor(private formBuilder: FormBuilder,
              private plateService: PlateService,
              private modalController: ModalController,
              private toastController: ToastController,
              private authService: AuthService,
              private ingredientService: IngredientService
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

    this.ingredientService.getIngredientsForPlate(this.plateForEdit.id).subscribe({
      next: (data) => {
        this.ingredients = data.map(i => ({ name: i.name, quantity: i.quantity, unit: i.unit }));
      },
      error: () => {
        this.ingredients = [];
      }
    });
  }

  public addIngredientRow() {
    this.ingredients.push({ name: '', quantity: '', unit: '' });
  }

  public removeIngredientRow(index: number) {
    this.ingredients.splice(index, 1);
  }

  public async savePlate() {
    const isAuthenticated = this.authService.isAuthenticated();
    console.log('User is authenticated:', isAuthenticated);

    if (!isAuthenticated) {
      console.error('User is not authenticated. Cannot save plate.');
      const toast = await this.toastController.create({
        message: 'Authentication required. Please log in.',
        duration: 3000
      });
      await toast.present();
      return;
    }

    if (this.plateService.editable) {
      await firstValueFrom(this.plateService.updatePlateDetails(this.plateForEdit.id, this.plateForm.value));

      const validIngredients = this.ingredients.filter(i => i.name.trim() !== '');
      if (validIngredients.length > 0) {
        await firstValueFrom(this.ingredientService.addIngredientsBulk(this.plateForEdit.id, validIngredients));
      } else {
        await firstValueFrom(this.ingredientService.addIngredientsBulk(this.plateForEdit.id, []));
      }
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
