import { Component, OnInit } from '@angular/core';
import { FamilyService } from '../services/family.service';
import { FamilyModel } from '../../_clients/models/FamilyModel';
import { CreateFamilyDto } from '../../_clients/models/CreateFamilyDto';
import { InviteFamilyMemberDto } from '../../_clients/models/InviteFamilyMemberDto';
import { ToastController, AlertController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';

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
    private toastController: ToastController,
    private alertController: AlertController,
    private authService: AuthService
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

  isFamilyOwner(family: FamilyModel): boolean {
    const currentUserId = this.authService.getUserId();
    return family.ownerUserId === currentUserId || family.owner?.id === currentUserId;
  }

  canRemoveMember(family: FamilyModel, memberId: string): boolean {
    // A user can remove a member if they are the owner or an admin
    const currentUserId = this.authService.getUserId();

    // Owner can remove anyone except themselves
    if (family.ownerUserId === currentUserId || family.owner?.id === currentUserId) {
      return memberId !== currentUserId; // Owner can't remove themselves
    }

    // Check if current user is an admin in this family
    const currentUserFamily = family.users?.find(uf => uf.user?.id === currentUserId);
    if (currentUserFamily?.role === 'admin') {
      return true;
    }

    return false;
  }

  async confirmDeleteFamily(familyId: string, familyName: string) {
    const alert = await this.alertController.create({
      header: 'Confirm Deletion',
      subHeader: 'Delete Family',
      message: `Are you sure you want to delete the family "${familyName}"? This action cannot be undone and will remove all members.`,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Delete',
          cssClass: 'alert-danger',
          handler: () => {
            this.deleteFamily(familyId);
          }
        }
      ]
    });

    await alert.present();
  }

  async confirmRemoveMember(familyId: string, memberId: string, memberName: string) {
    const alert = await this.alertController.create({
      header: 'Confirm Removal',
      subHeader: 'Remove Member',
      message: `Are you sure you want to remove "${memberName}" from the family?`,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Remove',
          cssClass: 'alert-warning',
          handler: () => {
            this.removeMember(familyId, memberId);
          }
        }
      ]
    });

    await alert.present();
  }

  deleteFamily(familyId: string) {
    this.familyService.deleteFamily(familyId).subscribe({
      next: () => {
        this.showSuccessToast('Family deleted successfully!');
        this.loadFamilies(); // Refresh the list
      },
      error: (error) => {
        console.error('Error deleting family:', error);
        this.showErrorToast('Failed to delete family: ' + error.message);
      }
    });
  }

  removeMember(familyId: string, memberId: string) {
    this.familyService.removeMember(familyId, memberId).subscribe({
      next: () => {
        this.showSuccessToast('Member removed successfully!');
        this.loadFamilies(); // Refresh the list
      },
      error: (error) => {
        console.error('Error removing member:', error);
        this.showErrorToast('Failed to remove member: ' + error.message);
      }
    });
  }
}
