import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FamilyService } from '../services/family.service';
import { FamilyModel } from '../../_clients/models/FamilyModel';
import { CreateFamilyDto } from '../../_clients/models/CreateFamilyDto';
import { InviteFamilyMemberDto } from '../../_clients/models/InviteFamilyMemberDto';
import { ToastController, AlertController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';
import { TranslateService } from '@ngx-translate/core';

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
    private authService: AuthService,
    private router: Router,
    private translate: TranslateService
  ) { }

  viewFamilyWeekPlates(familyId: string): void {
    this.router.navigate(['/family-week-plates', familyId]).then();
  }

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
        this.showErrorToast(this.translate.instant('FAMILY.LOAD_FAILED'));
      }
    });
  }

  createFamily() {
    if (!this.newFamilyName.trim()) {
      this.showErrorToast(this.translate.instant('FAMILY.NAME_REQUIRED'));
      return;
    }

    const createFamilyDto: CreateFamilyDto = {
      name: this.newFamilyName.trim()
    };

    this.familyService.createFamily(createFamilyDto).subscribe({
      next: (family) => {
        this.showSuccessToast(this.translate.instant('FAMILY.CREATE_SUCCESS'));
        this.newFamilyName = '';
        this.loadFamilies(); // Recharger la liste des familles
      },
      error: (error) => {
        console.error('Erreur lors de la création de la famille:', error);
        const backendMessage = error?.error?.message || this.translate.instant('FAMILY.CREATE_FAILED');
        this.showErrorToast(backendMessage);
      }
    });
  }

  inviteToFamily() {
    if (!this.selectedFamilyId) {
      this.showErrorToast(this.translate.instant('FAMILY.SELECT_FAMILY_FIRST'));
      return;
    }

    if (!this.inviteEmail.trim()) {
      this.showErrorToast(this.translate.instant('FAMILY.EMAIL_REQUIRED'));
      return;
    }

    const inviteFamilyMemberDto: InviteFamilyMemberDto = {
      email: this.inviteEmail.trim()
    };

    this.familyService.inviteToFamily(this.selectedFamilyId, inviteFamilyMemberDto).subscribe({
      next: (result) => {
        this.showSuccessToast(this.translate.instant('FAMILY.INVITE_SUCCESS'));
        this.inviteEmail = '';
      },
      error: (error) => {
        console.error('Erreur lors de l\'invitation:', error);
        const backendMessage = error?.error?.message || this.translate.instant('FAMILY.INVITE_FAILED');
        this.showErrorToast(backendMessage);
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
      header: this.translate.instant('FAMILY.CONFIRM_DELETION'),
      subHeader: this.translate.instant('FAMILY.DELETE_FAMILY'),
      message: this.translate.instant('FAMILY.DELETE_FAMILY_MESSAGE', { name: familyName }),
      buttons: [
        {
          text: this.translate.instant('FAMILY.CANCEL'),
          role: 'cancel'
        },
        {
          text: this.translate.instant('FAMILY.DELETE'),
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
      header: this.translate.instant('FAMILY.CONFIRM_REMOVAL'),
      subHeader: this.translate.instant('FAMILY.REMOVE_MEMBER'),
      message: this.translate.instant('FAMILY.REMOVE_MEMBER_MESSAGE', { name: memberName }),
      buttons: [
        {
          text: this.translate.instant('FAMILY.CANCEL'),
          role: 'cancel'
        },
        {
          text: this.translate.instant('FAMILY.REMOVE'),
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
        this.showSuccessToast(this.translate.instant('FAMILY.DELETE_SUCCESS'));
        this.loadFamilies(); // Refresh the list
      },
      error: (error) => {
        console.error('Error deleting family:', error);
        const backendMessage = error?.error?.message || this.translate.instant('FAMILY.DELETE_FAILED');
        this.showErrorToast(backendMessage);
      }
    });
  }

  removeMember(familyId: string, memberId: string) {
    this.familyService.removeMember(familyId, memberId).subscribe({
      next: () => {
        this.showSuccessToast(this.translate.instant('FAMILY.MEMBER_REMOVED'));
        this.loadFamilies(); // Refresh the list
      },
      error: (error) => {
        console.error('Error removing member:', error);
        const backendMessage = error?.error?.message || this.translate.instant('FAMILY.REMOVE_FAILED');
        this.showErrorToast(backendMessage);
      }
    });
  }
}
