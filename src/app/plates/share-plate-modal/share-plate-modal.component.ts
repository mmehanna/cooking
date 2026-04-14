import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { FamilyService } from '../services/family.service';
import { PlateService } from '../services/plate.service';
import { FamilyModel } from '../../_clients/models/FamilyModel';
import { BatchSharePlateDto } from '../../_clients/models/SharePlateDto';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-share-plate-modal',
  templateUrl: './share-plate-modal.component.html',
  styleUrls: ['./share-plate-modal.component.scss'],
})
export class SharePlateModalComponent implements OnInit {
  @Input() plateId?: string;
  @Input() plateLabel?: string;
  @Input() plates?: Array<{ id: string; label: string }>;

  families: FamilyModel[] = [];
  selectedFamilyId: string | null = null;
  selectedUserId: string | null = null;
  showUsersList = false;
  usersInFamily: any[] = [];
  
  // Track selected plates for batch sharing
  selectedPlates: Array<{ id: string; label: string }> = [];
  isBatchMode = false;

  constructor(
    private modalController: ModalController,
    private familyService: FamilyService,
    private plateService: PlateService,
    private toastController: ToastController
  ) { }

  ngOnInit() {
    // If plates array is provided, we're in batch mode
    if (this.plates && this.plates.length > 0) {
      this.isBatchMode = true;
      this.selectedPlates = [...this.plates];
    } else if (this.plateId) {
      // Single plate mode
      this.selectedPlates = [{ id: this.plateId, label: this.plateLabel || '' }];
    }
    
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
      if (family) {
        // Include both the owner and all users in the family
        this.usersInFamily = [];

        // Add the family owner if they're not already in the users list
        if (family.owner) {
          const ownerExists = family.users?.some(u => u.user.id === family.owner.id);
          if (!ownerExists || family.owner.id !== family.ownerUserId) {
            this.usersInFamily.push(family.owner);
           }
        }

        // Add all family members
        if (family.users) {
          this.usersInFamily = [...this.usersInFamily, ...family.users.map(user => user.user)];
        }

        // Remove duplicates
        this.usersInFamily = this.usersInFamily.filter((user, index, self) =>
          index === self.findIndex(u => u.id === user.id)
        );

        this.showUsersList = true;
      }
    } else {
      this.showUsersList = false;
      this.selectedUserId = null;
    }
  }

  sharePlate() {
    if (!this.selectedUserId) {
      this.showErrorToast('Please select a user');
      return;
    }

    if (this.selectedPlates.length === 0) {
      this.showErrorToast('No plates selected');
      return;
    }

    const batchSharePlateDto: BatchSharePlateDto = {
      plateIds: this.selectedPlates.map(p => p.id),
      sharedWithUserId: this.selectedUserId,
      familyId: this.selectedFamilyId || undefined
    };

    this.plateService.batchSharePlate(batchSharePlateDto).subscribe({
      next: (response) => {
        const successCount = response.success?.length || 0;
        const errorCount = response.errors?.length || 0;
        
        if (successCount > 0) {
          this.showSuccessToast(`${successCount} plate(s) shared successfully!`);
        }
        
        if (errorCount > 0) {
          const errorMsg = response.errors.map(e => e.error).join(', ');
          this.showErrorToast(`${errorCount} plate(s) failed: ${errorMsg}`);
        }
        
        // Close modal after a short delay
        setTimeout(() => {
          this.dismiss();
        }, 1500);
      },
      error: (error) => {
        console.error('Error sharing plates:', error);
        this.showErrorToast('Failed to share plates: ' + error.message);
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
