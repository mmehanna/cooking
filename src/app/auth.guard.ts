import { Injectable } from '@angular/core';
import { CanActivate, CanMatch, Route, Router, UrlSegment, UrlTree } from '@angular/router';

import { AuthService } from './plates/services/auth.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate, CanMatch {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(): boolean | UrlTree {
    return this.checkAccess();
  }

  canMatch(_route: Route, _segments: UrlSegment[]): boolean | UrlTree {
    return this.checkAccess();
  }

  private checkAccess(): boolean | UrlTree {
    if (this.authService.isAuthenticated()) {
      return true;
    }

    return this.router.createUrlTree(['/login']);
  }
}
