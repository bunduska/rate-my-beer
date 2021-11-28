import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { RegisterService } from '../services/register.service';
import { User } from '../models/user.model';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  loading = false;
  submitted = false;
  connectionStatus = false;
  wrongInputStatus = false;
  message = '';
  hide = true;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private registerService: RegisterService,
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit(): void {
    this.registerForm = this.formBuilder.group({
      email: [
        '',
        [
          Validators.required,
          Validators.email,
          Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'),
        ],
      ],
      username: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(8)]],
      isLegalAgeConfirmed: ['', Validators.requiredTrue],
    });
  }

  get f() {
    return this.registerForm.controls;
  }

  onSubmit(): void {
    this.submitted = true;

    if (this.registerForm.invalid) {
      return;
    }

    this.loading = true;
    this.registerService
      .register(this.registerForm.value)
      .pipe(first())
      .subscribe(
        (data: User) => {
          if (data.message !== undefined) {
            this.loading = false;
            this.wrongInputStatus = true;
            this.message = data.message;
            this.openSnackBar(this.message);
          } else {
            this.openSnackBar('Registration is done, please check your e-mail!');
            this.router.navigate(['/login']);
          }
        },
        () => {
          this.loading = false;
          this.connectionStatus = true;
        },
      );
  }

  openSnackBar(message: string) {
    this.snackBar.open(message, 'OK');
  }
}
