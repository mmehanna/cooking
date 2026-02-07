import { Component } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { AuthService } from './plates/services/auth.service';

@Component({
  selector: 'app-root',
  styleUrls: ['app.component.scss'],
  templateUrl: 'app.component.html',
})
export class AppComponent {
  constructor(
    private menuController: MenuController,
    private authService: AuthService
  ) {}

  closeMenu() {
    this.menuController.close();
  }

  logout() {
    this.authService.logout();
    this.menuController.close();
  }
}
