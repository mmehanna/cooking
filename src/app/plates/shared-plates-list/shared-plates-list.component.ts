import { Component, OnInit } from '@angular/core';
import { PlateService } from '../services/plate.service';
import { SharedPlateModel } from '../../_clients/models/SharedPlateModel';
import { AlertController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-shared-plates-list',
  templateUrl: './shared-plates-list.component.html',
  styleUrls: ['./shared-plates-list.component.scss'],
})
export class SharedPlatesListComponent implements OnInit {
  sharedPlatesWithMe: SharedPlateModel[] = [];
  sharedPlatesByMe: SharedPlateModel[] = [];
  activeSegment = 'received';
  isLoadingReceived = false;
  isLoadingSent = false;
  isSelectionMode = false;
  selectedPlateIds: string[] = [];

  constructor(
    private plateService: PlateService,
    private alertController: AlertController,
    private toastController: ToastController
  ) { }

  ngOnInit() {
    this.loadSharedPlates();
  }

  loadSharedPlates() {
    this.isLoadingReceived = true;
    this.plateService.getSharedPlatesWithUser().subscribe({
      next: (sharedPlates) => {
        console.log('Plats partagés avec moi:', sharedPlates);
        this.sharedPlatesWithMe = sharedPlates;
        this.isLoadingReceived = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des plats partagés avec moi:', error);
        if (error.status === 401) {
          console.error('Erreur d\'authentification - token peut-être expiré');
        }
        this.isLoadingReceived = false;
      }
    });

    this.isLoadingSent = true;
    this.plateService.getSharedPlatesByUser().subscribe({
      next: (sharedPlates) => {
        console.log('Plats partagés par moi:', sharedPlates);
        this.sharedPlatesByMe = sharedPlates;
        this.isLoadingSent = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des plats partagés par moi:', error);
        if (error.status === 401) {
          console.error('Erreur d\'authentification - token peut-être expiré');
        }
        this.isLoadingSent = false;
      }
    });
  }

  segmentChanged(event: any) {
    this.activeSegment = event.detail.value;
  }

  refreshData(refresher?: any) {
    console.log('Refreshing shared plates data...');
    this.loadSharedPlates();
    if (refresher) {
      setTimeout(() => {
        refresher.target.complete();
      }, 1000);
    }
  }

  async confirmUnshare(sharedPlate: SharedPlateModel) {
    const alert = await this.alertController.create({
      header: 'Confirm Unshare',
      message: `Are you sure you want to unshare "${sharedPlate.plate.label}"?`,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'Unshare',
          handler: () => {
            this.unsharePlate(sharedPlate);
          },
        },
      ],
    });

    await alert.present();
  }

  unsharePlate(sharedPlate: SharedPlateModel) {
    this.plateService.unsharePlate(sharedPlate.id).subscribe({
      next: async () => {
        const toast = await this.toastController.create({
          message: 'Plate unshared successfully',
          duration: 2000,
          color: 'success',
        });
        await toast.present();
        this.loadSharedPlates();
      },
      error: async (error) => {
        console.error('Error unsharing plate:', error);
        const toast = await this.toastController.create({
          message: 'Error unsharing plate: ' + (error.error?.message || error.message),
          duration: 3000,
          color: 'danger',
        });
        await toast.present();
      },
    });
  }

  toggleSelectionMode() {
    this.isSelectionMode = !this.isSelectionMode;
    if (!this.isSelectionMode) {
      this.selectedPlateIds = [];
    }
  }

  togglePlateSelection(shareAccessId: string) {
    const index = this.selectedPlateIds.indexOf(shareAccessId);
    if (index > -1) {
      this.selectedPlateIds.splice(index, 1);
    } else {
      this.selectedPlateIds.push(shareAccessId);
    }
  }

  isPlateSelected(shareAccessId: string): boolean {
    return this.selectedPlateIds.includes(shareAccessId);
  }

  selectAll() {
    if (this.selectedPlateIds.length === this.sharedPlatesByMe.length) {
      this.selectedPlateIds = [];
    } else {
      this.selectedPlateIds = this.sharedPlatesByMe.map(p => p.id);
    }
  }

  async confirmBatchUnshare() {
    if (this.selectedPlateIds.length === 0) {
      const toast = await this.toastController.create({
        message: 'Please select at least one plate',
        duration: 2000,
        color: 'warning',
      });
      await toast.present();
      return;
    }

    const count = this.selectedPlateIds.length;
    const alert = await this.alertController.create({
      header: 'Confirm Unshare',
      message: `Are you sure you want to unshare ${count} plate(s)?`,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: `Unshare ${count}`,
          handler: () => {
            this.batchUnsharePlates();
          },
        },
      ],
    });

    await alert.present();
  }

  batchUnsharePlates() {
    this.plateService.batchUnsharePlates(this.selectedPlateIds).subscribe({
      next: async (response) => {
        const successCount = response.success?.length || 0;
        const errorCount = response.errors?.length || 0;

        if (successCount > 0) {
          const toast = await this.toastController.create({
            message: `${successCount} plate(s) unshared successfully`,
            duration: 2000,
            color: 'success',
          });
          await toast.present();
        }

        if (errorCount > 0) {
          const errorMsg = response.errors.map((e: any) => e.error).join(', ');
          const toast = await this.toastController.create({
            message: `${errorCount} plate(s) failed: ${errorMsg}`,
            duration: 3000,
            color: 'danger',
          });
          await toast.present();
        }

        this.selectedPlateIds = [];
        this.isSelectionMode = false;
        this.loadSharedPlates();
      },
      error: async (error) => {
        console.error('Error batch unsharing plates:', error);
        const toast = await this.toastController.create({
          message: 'Error unsharing plates: ' + (error.error?.message || error.message),
          duration: 3000,
          color: 'danger',
        });
        await toast.present();
      },
    });
  }
}
