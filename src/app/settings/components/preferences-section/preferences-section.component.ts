import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ToastController } from '@ionic/angular';
import { lastValueFrom, take } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-preferences-section',
  templateUrl: './preferences-section.component.html',
  styleUrls: ['./preferences-section.component.scss']
})
export class PreferencesSectionComponent implements OnInit {
  preferencesForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private toastController: ToastController,
    private translate: TranslateService
  ) {}

  ngOnInit() {
    this.preferencesForm = this.fb.group({
      language: ['en'],
      theme: ['light'],
      notifications: [true]
    });

    this.userService.profile$.pipe(take(1)).subscribe(profile => {
      if (profile) {
        this.preferencesForm.patchValue({
          language: profile.language || 'en',
          theme: profile.theme || 'light',
          notifications: profile.notifications !== false
        });
        this.applyTheme(this.preferencesForm.get('theme')?.value);
      }
    });
  }

  onThemeChange(event: any) {
    const isDark = event.detail.checked;
    this.preferencesForm.get('theme')?.setValue(isDark ? 'dark' : 'light');
    this.applyTheme(isDark ? 'dark' : 'light');
  }

  private applyTheme(theme: string) {
    document.body.classList.toggle('dark', theme === 'dark');
  }

  async onSubmit() {
    if (this.preferencesForm.valid) {
      const language = this.preferencesForm.get('language')?.value;
      if (language) {
        this.translate.use(language);
      }
      try {
        await lastValueFrom(this.userService.updatePreferences(this.preferencesForm.value));
        const toast = await this.toastController.create({
          message: this.translate.instant('SETTINGS.PREFERENCES_UPDATED'),
          duration: 2000
        });
        await toast.present();
      } catch (error) {
        const toast = await this.toastController.create({
          message: this.translate.instant('SETTINGS.PREFERENCES_UPDATE_FAILED'),
          duration: 3000
        });
        await toast.present();
      }
    }
  }
}