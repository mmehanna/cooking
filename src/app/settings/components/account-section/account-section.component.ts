import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, ToastController } from '@ionic/angular';
import { lastValueFrom } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../../plates/services/auth.service';

@Component({
  selector: 'app-account-section',
  templateUrl: './account-section.component.html',
  styleUrls: ['./account-section.component.scss']
})
export class AccountSectionComponent implements OnInit {
  passwordForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private authService: AuthService,
    private alertController: AlertController,
    private toastController: ToastController,
    private translate: TranslateService
  ) {}

  ngOnInit() {
    this.passwordForm = this.fb.group({
      currentPassword: ['', [Validators.required, Validators.minLength(6)]],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }

  private passwordMatchValidator(form: FormGroup) {
    const newPassword = form.get('newPassword')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    return newPassword === confirmPassword ? null : { mismatch: true };
  }

  async onChangePassword() {
    if (this.passwordForm.valid) {
      try {
        await lastValueFrom(this.userService.changePassword(this.passwordForm.value));
        const toast = await this.toastController.create({
          message: this.translate.instant('SETTINGS.PASSWORD_CHANGED'),
          duration: 2000
        });
        await toast.present();
        this.passwordForm.reset();
      } catch (error) {
        const toast = await this.toastController.create({
          message: error?.error?.message || this.translate.instant('SETTINGS.PASSWORD_CHANGE_FAILED'),
          duration: 3000
        });
        await toast.present();
      }
    }
  }

  async onDeleteAccount() {
    const alert = await this.alertController.create({
      header: this.translate.instant('ACCOUNT.DELETE_CONFIRM_TITLE'),
      message: this.translate.instant('ACCOUNT.DELETE_CONFIRM_MESSAGE'),
      buttons: [
        {
          text: this.translate.instant('ACCOUNT.CANCEL'),
          role: 'cancel'
        },
        {
          text: this.translate.instant('ACCOUNT.DELETE'),
          handler: () => {
            this.confirmDeleteAccount();
          }
        }
      ]
    });
    await alert.present();
  }

  private async confirmDeleteAccount() {
    const alert = await this.alertController.create({
      header: this.translate.instant('ACCOUNT.FINAL_CONFIRMATION'),
      message: this.translate.instant('ACCOUNT.TYPE_DELETE'),
      inputs: [
        {
          name: 'confirmText',
          type: 'text',
          placeholder: this.translate.instant('ACCOUNT.TYPE_DELETE_PLACEHOLDER')
        }
      ],
      buttons: [
        {
          text: this.translate.instant('ACCOUNT.CANCEL'),
          role: 'cancel'
        },
        {
          text: this.translate.instant('ACCOUNT.PERMANENTLY_DELETE'),
          handler: (data) => {
            if (data.confirmText === 'DELETE') {
              this.performDelete();
              return true;
            }
            return false;
          }
        }
      ]
    });
    await alert.present();
  }

  private async performDelete() {
    try {
      await lastValueFrom(this.userService.deleteAccount());
      this.authService.logout();
    } catch (error) {
      const toast = await this.toastController.create({
        message: this.translate.instant('ACCOUNT.DELETE_FAILED'),
        duration: 3000
      });
      await toast.present();
    }
  }
}