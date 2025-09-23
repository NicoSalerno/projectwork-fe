import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { catchError, map, Subject, switchMap, takeUntil, throwError, timer } from 'rxjs';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit, OnDestroy {
  protected fb = inject(FormBuilder);
  protected authSrv = inject(AuthService);
  protected router = inject(Router);
  protected activatedRoute = inject(ActivatedRoute);

  protected destroyed$ = new Subject<void>();

  loginForm = this.fb.group({
    email: ['', Validators.required],
    password: ['', Validators.required]
  });

  loginError = '';
  inactivityMessage = '';   // messaggio che mostriamo

  requestedUrl: string | null = null;

  ngOnInit() {
    // Reset error quando cambia il form
    this.loginForm.valueChanges
      .pipe(
        takeUntil(this.destroyed$),
        switchMap(() => {
          this.loginError = '';
          this.inactivityMessage = '';
          return timer(30000);
        })
      )
      .subscribe(() => {
        this.loginForm.reset();
        this.inactivityMessage = 'Sessione scaduta per inattività (30 secondi).';
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
    const { email, password } = this.loginForm.value;

    this.authSrv.login(email!, password!)
      .pipe(
        catchError((response) => {
          this.loginError = response.error?.message || 'Email o password non corretti';
          return throwError(() => response);
        })
      )
      .subscribe(() => {
        this.router.navigate([this.requestedUrl ? this.requestedUrl : '/homepage']);
      });
  }
}
