import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastController } from '@ionic/angular';
import { lastValueFrom, take } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-profile-section',
  templateUrl: './profile-section.component.html',
  styleUrls: ['./profile-section.component.scss']
})
export class ProfileSectionComponent implements OnInit {
  profileForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private toastController: ToastController,
    private translate: TranslateService
  ) {}

  ngOnInit() {
    this.profileForm = this.fb.group({
      name: [''],
      email: ['', [Validators.email]],
      avatar: ['']
    });

    this.userService.profile$.pipe(take(1)).subscribe(profile => {
      if (profile) {
        this.profileForm.patchValue({
          name: profile.name || '',
          email: profile.email,
          avatar: profile.avatar || ''
        });
      }
    });
  }

  async onSubmit() {
    if (this.profileForm.valid) {
      try {
        await lastValueFrom(this.userService.updateProfile(this.profileForm.value));
        const toast = await this.toastController.create({
          message: this.translate.instant('SETTINGS.PROFILE_UPDATED'),
          duration: 2000
        });
        await toast.present();
      } catch (error) {
        const toast = await this.toastController.create({
          message: this.translate.instant('SETTINGS.PROFILE_UPDATE_FAILED'),
          duration: 3000
        });
        await toast.present();
      }
    }
  }
}