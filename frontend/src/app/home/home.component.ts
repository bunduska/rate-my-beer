import { Component } from '@angular/core';
import { User } from '../models/user.model';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent {
  currentUser: User | any;
  displayNewBeerComponent: boolean = false;
  displayBeerListComponent: boolean = true;

  constructor(private authService: AuthService) {}

  getCurrentUserName(): string {
    return this.authService.getCurrentUser()!.username;
  }

  isCurrentUserAdmin(): boolean {
    return !this.authService.getCurrentUser()!.isAdmin;
  }

  addnewbeer(): void {
    this.displayNewBeerComponent = true;
    this.displayBeerListComponent = false;
  }

  logout() {
    this.authService.logout();
  }
}
