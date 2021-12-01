import { ManageUsersService } from './../core/services/manageusers.service';
import { User } from './../core/models/user.model';
import { Component, OnInit } from '@angular/core';

import { AuthenticationService } from '../core';

@Component({
  selector: 'manageusers',
  templateUrl: './manageusers.component.html',
  styleUrls: ['./manageusers.component.sass'],
})
export class UsersComponent implements OnInit {
  displayedColumns: string[] = [
    'id',
    'admin',
    'name',
    'email',
    'newsletter',
    'delete',
  ];
  dataSource: User[] = [];

  constructor(
    private manageUserService: ManageUsersService,
    private authenticationService: AuthenticationService,
  ) {}

  ngOnInit(): void {
    this.manageUserService.getAllUsers().subscribe((users: User[]) => {
      this.dataSource = users;
      const { userId } = this.authenticationService.jwtDecode();
      for (let currentUser of this.dataSource) {
        if (userId === currentUser.id)
          this.dataSource.splice(this.dataSource.indexOf(currentUser), 1);
      }
    });
  }

  toggleAdminRight(user: User): void {
    if (
      confirm(
        `Are you sure to change the admin right for ${user.name} with id: ${user.id}?`,
      )
    ) {
      this.manageUserService.setRight(user).subscribe((response) => {
        this.ngOnInit();
        alert(response.message);
      });
    }
  }

  delete(user: User): void {
    if (
      confirm(`Are you sure to delete ${user.name} user with id: ${user.id}?`)
    ) {
      this.manageUserService.deleteUser(user).subscribe((response) => {
        this.ngOnInit();
        alert(response.message);
      });
    }
  }

  updateNewsletter(user: User): void {
    this.manageUserService.updateUserNewsletter(user).subscribe((response) => {
      this.ngOnInit();
      alert(response.message);
    });
  }
}
