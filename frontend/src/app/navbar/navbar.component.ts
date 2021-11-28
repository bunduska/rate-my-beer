import { Component } from '@angular/core';
import { User } from '../models/user.model';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent {
  currentUser: User | any;

  constructor(private authService: AuthService) {}

  getCurrentUserName(): string {
    return this.authService.getCurrentUser()!.username;
  }

  logout() {
    this.authService.logout();
  }
}
