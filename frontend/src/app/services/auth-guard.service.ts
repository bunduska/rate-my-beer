import { AuthenticationService } from './authentication.service';
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private authenticationService: AuthenticationService
  ) {}

  canActivate(): boolean {
    if (this.authenticationService.currentUser !== null && this.authenticationService.currentUser !== undefined ) {
      return true;
    }

    this.router.navigate(['/login']);
    return false;
  }
}