import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, Validators} from "@angular/forms";
import {ModalController, ToastController} from "@ionic/angular";

import {PlateService} from "../services/plate.service";
import {PlateItemBo} from "../bos/plate-item.bo";
import {firstValueFrom} from "rxjs";
import {AuthService} from "../services/auth.service";
import {IngredientService} from "../services/ingredient.service";
import {TranslateService} from "@ngx-translate/core";

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
  steps: string = '';
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
              private ingredientService: IngredientService,
              private translate: TranslateService
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
    this.steps = this.plateForEdit.steps || '';

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
        message: this.translate.instant('PLATE_DETAILS.AUTH_REQUIRED'),
        duration: 3000
      });
      await toast.present();
      return;
    }

    const plateData = { ...this.plateForm.value, steps: this.steps };

    if (this.plateService.editable) {
      await firstValueFrom(this.plateService.updatePlateDetails(this.plateForEdit.id, plateData));

      const validIngredients = this.ingredients.filter(i => i.name.trim() !== '');
      if (validIngredients.length > 0) {
        await firstValueFrom(this.ingredientService.addIngredientsBulk(this.plateForEdit.id, validIngredients));
      } else {
        await firstValueFrom(this.ingredientService.addIngredientsBulk(this.plateForEdit.id, []));
      }
    } else {
      await firstValueFrom(this.plateService.createPlate(plateData));
      console.log(plateData);
    }

    await this.presentToast();
    await this.closeModal();

    // Prefer event emission over full reload
    if (this.saveEvent) {
      this.saveEvent.emit();
    } else {
      window.location.reload();
    }
    console.log(this.selectedCategory);
  }

  public async presentToast() {
    if (this.plateService.editable) {
      const toast = await this.toastController.create({
        message: this.translate.instant('PLATE_DETAILS.UPDATED'),
        duration: 2000
      });
      await toast.present();
    } else {
      const toast = await this.toastController.create({
        message: this.translate.instant('PLATE_DETAILS.ADDED'),
        duration: 2000
      });
      await toast.present();
    }
  }

  public async closeModal() {
    await this.modalController.dismiss();
  }

  public get categories() {
    return [
      { value: 'breakfast', label: this.translate.instant('PLATE_DETAILS.BREAKFAST'), icon: 'sunny-outline', desc: this.translate.instant('PLATE_DETAILS.CATEGORY_BREAKFAST_DESC') },
      { value: 'lunch', label: this.translate.instant('PLATE_DETAILS.LUNCH'), icon: 'restaurant-outline', desc: this.translate.instant('PLATE_DETAILS.CATEGORY_LUNCH_DESC') },
      { value: 'dinner', label: this.translate.instant('PLATE_DETAILS.DINNER'), icon: 'moon-outline', desc: this.translate.instant('PLATE_DETAILS.CATEGORY_DINNER_DESC') }
    ];
  }

  public get modalTitle(): string {
    return this.plateService.editable
      ? this.translate.instant('PLATE_DETAILS.EDIT_TITLE')
      : this.translate.instant('PLATE_DETAILS.CREATE_TITLE');
  }

  public get modalSubtitle(): string {
    return this.plateService.editable
      ? this.translate.instant('PLATE_DETAILS.EDIT_SUBTITLE')
      : this.translate.instant('PLATE_DETAILS.CREATE_SUBTITLE');
  }

  public get saveLabel(): string {
    return this.plateService.editable
      ? this.translate.instant('PLATE_DETAILS.SAVE_CHANGES')
      : this.translate.instant('PLATES.CREATE_PLATE');
  }
}
