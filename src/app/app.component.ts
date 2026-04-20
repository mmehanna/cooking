import { Component } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { AuthService } from './plates/services/auth.service';
import { UserService } from './settings/services/user.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  styleUrls: ['app.component.scss'],
  templateUrl: 'app.component.html',
})
export class AppComponent {
  constructor(
    private menuController: MenuController,
    private authService: AuthService,
    private userService: UserService,
    private translate: TranslateService
  ) {
    this.loadUserLanguage();
  }

  closeMenu() {
    this.menuController.close();
  }

  logout() {
    this.authService.logout();
    this.menuController.close();
  }

  private loadUserLanguage() {
    if (this.authService.isAuthenticated()) {
      this.userService.loadProfile().subscribe({
        next: (profile) => {
          if (profile?.language) {
            this.translate.use(profile.language);
          }
          if (profile?.theme === 'dark') {
            document.body.classList.add('dark');
          }
        },
        error: () => {
          // Not authenticated or profile not available, use default language
        }
      });
    }
  }
}