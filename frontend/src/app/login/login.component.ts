import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  submitted: boolean = false;
  wrongInputMessage: string = '';
  currentUser: any;
  hide: boolean = true;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private snackBar: MatSnackBar,
  ) {
    this.currentUser = this.authService.getCurrentUser();
    if (this.currentUser !== null) {
      this.router.navigate(['/']);
    }
  }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  get f() {
    return this.loginForm.controls;
  }

  onSubmit(): void {
    this.submitted = true;

    if (this.loginForm.invalid) {
      return;
    }

    this.authService
      .login(this.f.email.value, this.f.password.value)
      .pipe(first())
      .subscribe((data) => {
        if (data.message !== undefined) {
          this.wrongInputMessage = data.message;
          this.openSnackBar(this.wrongInputMessage);
        } else {
          this.router.navigate(['/']);
        }
      });
  }

  openSnackBar(message: string) {
    this.snackBar.open(this.wrongInputMessage, 'OK', { duration: 4000 });
  }
}
