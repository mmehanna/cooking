import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { FamilyService } from '../services/family.service';
import { PlateService } from '../services/plate.service';
import { FamilyModel } from '../../_clients/models/FamilyModel';
import { SharePlateDto } from '../../_clients/models/SharePlateDto';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-share-plate-modal',
  templateUrl: './share-plate-modal.component.html',
  styleUrls: ['./share-plate-modal.component.scss'],
})
export class SharePlateModalComponent implements OnInit {
  @Input() plateId: string;
  @Input() plateLabel: string;

  families: FamilyModel[] = [];
  selectedFamilyId: string | null = null;
  selectedUserId: string | null = null;
  showUsersList = false;
  usersInFamily: any[] = [];

  constructor(
    private modalController: ModalController,
    private familyService: FamilyService,
    private plateService: PlateService,
    private toastController: ToastController
  ) { }

  ngOnInit() {
    this.loadFamilies();
  }

  loadFamilies() {
    this.familyService.getUserFamilies().subscribe({
      next: (families) => {
        this.families = families;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des familles:', error);
      }
    });
  }

  onFamilyChange() {
    if (this.selectedFamilyId) {
      const family = this.families.find(f => f.id === this.selectedFamilyId);
      if (family && family.users) {
        this.usersInFamily = family.users.map(user => user.user);
        this.showUsersList = true;
      }
    } else {
      this.showUsersList = false;
      this.selectedUserId = null;
    }
  }

  sharePlate() {
    if (!this.plateId) {
      this.showErrorToast('Plate ID is required');
      return;
    }

    let sharePlateDto: SharePlateDto;

    if (this.selectedFamilyId && this.selectedUserId) {
      // Partage avec un utilisateur spécifique dans une famille
      sharePlateDto = {
        plateId: this.plateId,
        sharedWithUserId: this.selectedUserId,
        familyId: this.selectedFamilyId
      };
    } else if (this.selectedFamilyId) {
      // Partage avec une famille entière (à implémenter côté backend)
      this.showErrorToast('Sharing with entire family is not implemented yet');
      return;
    } else if (this.selectedUserId) {
      // Partage avec un utilisateur spécifique en dehors d'une famille
      sharePlateDto = {
        plateId: this.plateId,
        sharedWithUserId: this.selectedUserId
      };
    } else {
      this.showErrorToast('Please select a family or a user');
      return;
    }

    this.plateService.sharePlate(sharePlateDto).subscribe({
      next: (response) => {
        this.showSuccessToast('Plate shared successfully!');
        // Fermer la modale après un court délai pour permettre l'affichage du message
        setTimeout(() => {
          this.dismiss();
        }, 1000);
      },
      error: (error) => {
        console.error('Erreur lors du partage du plat:', error);
        this.showErrorToast('Failed to share plate: ' + error.message);
      }
    });
  }

  async showSuccessToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      color: 'success'
    });
    toast.present();
  }

  async showErrorToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      color: 'danger'
    });
    toast.present();
  }

  dismiss() {
    this.modalController.dismiss();
  }
}
