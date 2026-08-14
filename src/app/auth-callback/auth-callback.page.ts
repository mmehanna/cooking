import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../plates/services/auth.service';
import { UserService } from '../settings/services/user.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-auth-callback',
  templateUrl: './auth-callback.page.html',
  styleUrls: ['./auth-callback.page.scss']
})
export class AuthCallbackPage implements OnInit {
  public hasError = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private userService: UserService,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    const token = this.route.snapshot.queryParamMap.get('token');

    if (!token) {
      this.hasError = true;
      return;
    }

    this.authService.completeGoogleLogin(token);

    this.userService.loadProfile().subscribe({
      next: (profile) => {
        const lang = profile?.language || 'en';
        this.translate.use(lang);

        if (profile?.theme === 'dark') {
          document.body.classList.add('dark');
        } else {
          document.body.classList.remove('dark');
        }

        this.router.navigate(['/landing'], { replaceUrl: true });
      },
      error: () => {
        this.router.navigate(['/landing'], { replaceUrl: true });
      }
    });
  }
}
