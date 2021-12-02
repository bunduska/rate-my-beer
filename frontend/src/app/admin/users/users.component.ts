import { ManageUsersService } from '../../services/manage-users.service';
import { User } from '../../models/user.model';
import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css'],
})
export class UsersComponent implements OnInit {
  displayedColumns: string[] = ['id', 'name', 'email', 'admin', 'delete'];
  users: User[] = [];
  dataSource!: MatTableDataSource<User>;

  constructor(private manageUserService: ManageUsersService) {}

  ngOnInit(): void {
    this.updateUserlist();
  }

  updateUserlist() {
    this.manageUserService.getAllUsers().subscribe((users) => {
      this.users = users as User[];
      this.dataSource = new MatTableDataSource(this.users);
    });
  }

  toggleAdminRight(user: User): void {
    if (
      confirm(
        `Are you sure to change the admin right for ${user.username} with id: ${user.id}?`,
      )
    ) {
      user.isAdmin = !user.isAdmin;
      this.manageUserService.saveuser(user).subscribe(() => {
        this.updateUserlist();
      });
    }
  }

  delete(user: User): void {
    if (
      confirm(
        `Are you sure to delete ${user.username} user with id: ${user.id}?`,
      )
    ) {
      this.manageUserService.deleteuser(user).subscribe(() => {
        this.updateUserlist();
      });
    }
  }
}
