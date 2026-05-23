import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { AuthService } from './plates/services/auth.service';
import { UserService } from './settings/services/user.service';
import { TranslateService } from '@ngx-translate/core';
import { UserProfileModel } from './_clients/models/UserProfileModel';

@Component({
  selector: 'app-root',
  styleUrls: ['app.component.scss'],
  templateUrl: 'app.component.html',
})
export class AppComponent implements OnInit {
  userProfile: UserProfileModel | null = null;

  constructor(
    private menuController: MenuController,
    private authService: AuthService,
    private userService: UserService,
    private translate: TranslateService
  ) {
    this.loadUserLanguage();
  }

  ngOnInit() {
    this.userService.profile$.subscribe(profile => {
      this.userProfile = profile;
    });
    if (this.authService.isAuthenticated()) {
      this.userService.loadProfile().subscribe();
    }
  }

  closeMenu() {
    this.menuController.close();
  }

  logout() {
    this.authService.logout();
    this.menuController.close();
  }

  private loadUserLanguage() {
    const fallback = 'en';
    if (this.authService.isAuthenticated()) {
      this.userService.loadProfile().subscribe({
        next: (profile) => {
          const lang = profile?.language || fallback;
          if (lang !== this.translate.currentLang) {
            this.translate.use(lang);
          }
          if (profile?.theme === 'dark') {
            document.body.classList.add('dark');
          }
        },
        error: () => {
          if (!this.translate.currentLang) {
            this.translate.use(fallback);
          }
        }
      });
    } else if (!this.translate.currentLang) {
      this.translate.use(fallback);
    }
  }
}