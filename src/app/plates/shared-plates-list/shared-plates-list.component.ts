import { Component, OnInit } from '@angular/core';
import { PlateService } from '../services/plate.service';
import { SharedPlateModel } from '../../_clients/models/SharedPlateModel';
import { AlertController, ToastController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';

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
    private toastController: ToastController,
    private translate: TranslateService
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
      header: this.translate.instant('SHARED_PLATES.CONFIRM_UNSHARE'),
      message: this.translate.instant('SHARED_PLATES.UNSHARE_MESSAGE', { label: sharedPlate.plate.label }),
      buttons: [
        {
          text: this.translate.instant('SHARED_PLATES.CANCEL'),
          role: 'cancel',
        },
        {
          text: this.translate.instant('SHARED_PLATES.UNSHARE'),
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
          message: this.translate.instant('SHARED_PLATES.UNSHARE_SUCCESS'),
          duration: 2000,
          color: 'success',
        });
        await toast.present();
        this.loadSharedPlates();
      },
      error: async (error) => {
        console.error('Error unsharing plate:', error);
        const toast = await this.toastController.create({
          message: this.translate.instant('SHARED_PLATES.UNSHARE_FAILED') + (error.error?.message || error.message),
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
        message: this.translate.instant('SHARED_PLATES.PLEASE_SELECT'),
        duration: 2000,
        color: 'warning',
      });
      await toast.present();
      return;
    }

    const count = this.selectedPlateIds.length;
    const alert = await this.alertController.create({
      header: this.translate.instant('SHARED_PLATES.CONFIRM_UNSHARE'),
      message: this.translate.instant('SHARED_PLATES.BATCH_UNSHARE_MESSAGE', { count }),
      buttons: [
        {
          text: this.translate.instant('SHARED_PLATES.CANCEL'),
          role: 'cancel',
        },
        {
          text: this.translate.instant('SHARED_PLATES.BATCH_UNSHARE_BUTTON', { count }),
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
            message: this.translate.instant('SHARED_PLATES.BATCH_SUCCESS', { count: successCount }),
            duration: 2000,
            color: 'success',
          });
          await toast.present();
        }

        if (errorCount > 0) {
          const errorMsg = response.errors.map((e: any) => e.error).join(', ');
          const toast = await this.toastController.create({
            message: this.translate.instant('SHARED_PLATES.BATCH_FAILED', { count: errorCount, errorMsg }),
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
          message: this.translate.instant('SHARED_PLATES.BATCH_ERROR') + (error.error?.message || error.message),
          duration: 3000,
          color: 'danger',
        });
        await toast.present();
      },
    });
  }
}
