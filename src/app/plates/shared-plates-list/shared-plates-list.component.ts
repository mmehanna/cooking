import { Component, OnInit } from '@angular/core';
import { PlateService } from '../services/plate.service';
import { SharedPlateModel } from '../../_clients/models/SharedPlateModel';

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

  constructor(private plateService: PlateService) { }

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
}
