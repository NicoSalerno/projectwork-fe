import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { catchError, map, Subject, takeUntil, throwError } from 'rxjs';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit, OnDestroy{
  protected fb = inject(FormBuilder);
  protected authSrv = inject(AuthService);
  protected router = inject(Router);
  protected activatedRoute = inject(ActivatedRoute);

  protected destroyed$ = new Subject<void>();

  loginForm = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required]
  });

  loginError = '';

  requestedUrl: string | null = null;

  ngOnInit() {
    this.loginForm.valueChanges
      .pipe(takeUntil(this.destroyed$))
      .subscribe(_ => {
        this.loginError = '';
      });

    this.activatedRoute.queryParams
      .pipe(
        takeUntil(this.destroyed$),
        map(params => params['requestedUrl'])
      )
      .subscribe(url => {
        this.requestedUrl = url;
      });
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }


    login() {
        this.router.navigate(['/homepage']);
      }

/*
  login() {
    const { username, password } = this.loginForm.value;
    this.authSrv.login(username!, password!)
      .pipe(
        catchError(response => {
          this.loginError = response.error.message;
          return throwError(() => response);
        })
      )
      .subscribe(() => {
        this.router.navigate([this.requestedUrl ? this.requestedUrl : '/homepage']);
      })
  } */
  
}
