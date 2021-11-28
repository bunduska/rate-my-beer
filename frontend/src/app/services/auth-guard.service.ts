import { AuthService } from './auth.service';
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  currentUser: any;

  constructor(private router: Router, private authService: AuthService) {}

  canActivate(): boolean {
    this.currentUser = this.authService.getCurrentUser();
    if (this.currentUser !== null) {
      return true;
    }
    this.router.navigate(['/login']);
    return false;
  }
}
