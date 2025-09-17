import { Component, inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, map, Subject, takeUntil, throwError } from 'rxjs';

@Component({
  selector: 'app-register',
  standalone: false,
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  protected fb = inject(FormBuilder);
  protected authSrv = inject(AuthService);
  protected router = inject(Router);
  protected activatedRoute = inject(ActivatedRoute);

  protected destroyed$ = new Subject<void>();

  registerForm = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    role: ['', Validators.required],
    picture: ['', Validators.required],
    username: ['', Validators.required],
    password: ['', Validators.required],
  });

  loginError = '';

  requestedUrl: string | null = null;

  ngOnInit() {
    this.registerForm.valueChanges
      .pipe(takeUntil(this.destroyed$))
      .subscribe((_) => {
        this.loginError = '';
      });

    this.activatedRoute.queryParams
      .pipe(
        takeUntil(this.destroyed$),
        map((params) => params['requestedUrl'])
      )
      .subscribe((url) => {
        this.requestedUrl = url;
      });
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  login() {
    const { username, password } = this.registerForm.value;
    this.authSrv
      .login(username!, password!)
      .pipe(
        catchError((response) => {
          this.loginError = response.error.message;
          return throwError(() => response);
        })
      )
      .subscribe(() => {
        this.router.navigate([
          this.requestedUrl ? this.requestedUrl : '/homepage',
        ]);
      });
  }

  register() {
    const { firstName, lastName, role, picture, username, password } =
      this.registerForm.value;
    this.authSrv
      .register(firstName!, lastName!, role!, picture!, username!, password!)
      .pipe(
        catchError((response) => {
          this.loginError = response.error.message;
          return throwError(() => response);
        })
      )
      .subscribe(() => {
        this.router.navigate([
          this.requestedUrl ? this.requestedUrl : '/',
        ]);
      });
  }
}
