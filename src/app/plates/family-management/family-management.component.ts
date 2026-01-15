import { Component, OnInit } from '@angular/core';
import { FamilyService } from '../services/family.service';
import { FamilyModel } from '../../_clients/models/FamilyModel';
import { CreateFamilyDto } from '../../_clients/models/CreateFamilyDto';
import { InviteFamilyMemberDto } from '../../_clients/models/InviteFamilyMemberDto';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-family-management',
  templateUrl: './family-management.component.html',
  styleUrls: ['./family-management.component.scss'],
})
export class FamilyManagementComponent implements OnInit {
  families: FamilyModel[] = [];
  newFamilyName: string = '';
  inviteEmail: string = '';
  selectedFamilyId: string | null = null;

  constructor(
    private familyService: FamilyService,
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
        this.showErrorToast('Failed to load families');
      }
    });
  }

  createFamily() {
    if (!this.newFamilyName.trim()) {
      this.showErrorToast('Family name is required');
      return;
    }

    const createFamilyDto: CreateFamilyDto = {
      name: this.newFamilyName.trim()
    };

    this.familyService.createFamily(createFamilyDto).subscribe({
      next: (family) => {
        this.showSuccessToast('Family created successfully!');
        this.newFamilyName = '';
        this.loadFamilies(); // Recharger la liste des familles
      },
      error: (error) => {
        console.error('Erreur lors de la création de la famille:', error);
        this.showErrorToast('Failed to create family: ' + error.message);
      }
    });
  }

  inviteToFamily() {
    if (!this.selectedFamilyId) {
      this.showErrorToast('Please select a family');
      return;
    }

    if (!this.inviteEmail.trim()) {
      this.showErrorToast('Email is required');
      return;
    }

    const inviteFamilyMemberDto: InviteFamilyMemberDto = {
      email: this.inviteEmail.trim()
    };

    this.familyService.inviteToFamily(this.selectedFamilyId, inviteFamilyMemberDto).subscribe({
      next: (result) => {
        this.showSuccessToast('Invitation sent successfully!');
        this.inviteEmail = '';
      },
      error: (error) => {
        console.error('Erreur lors de l\'invitation:', error);
        this.showErrorToast('Failed to send invitation: ' + error.message);
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
}
