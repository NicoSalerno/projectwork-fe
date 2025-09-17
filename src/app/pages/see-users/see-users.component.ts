import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Assignment } from '../../entities/assignment.entity';
import { FormBuilder, Validators } from '@angular/forms';
import { catchError, map, Subject, takeUntil, throwError } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { ClassroomService } from '../../services/classroom.service';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '../../entities/user.entity';

@Component({
  selector: 'app-see-users',
  standalone: false,
  templateUrl: './see-users.component.html',
  styleUrl: './see-users.component.css',
})
export class SeeUsersComponent implements OnInit, OnDestroy {
  
  protected fb = inject(FormBuilder);
  protected authSrv = inject(AuthService);
  protected classroomSrv = inject(ClassroomService);
  protected router = inject(Router);
  protected activatedRoute = inject(ActivatedRoute);

  protected destroyed$ = new Subject<void>();

  users: User[] = [];

  seeForm = this.fb.group({
    role: ['', Validators.required],
    userId: ['', Validators.required],
  });

  loginError = '';
  requestedUrl: string | null = null;

  ngOnInit() {
    // Popola automaticamente il campo userId quando l'utente è disponibile
    this.authSrv.currentUser$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((user) => {
        if (user?.id) {
          this.seeForm.patchValue({ userId: user.id });
        }
      });

    // Reset errore quando il form cambia
    this.seeForm.valueChanges.pipe(takeUntil(this.destroyed$)).subscribe(() => {
      this.loginError = '';
    });

    // Recupera eventuale URL richiesto per redirect dopo la creazione
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

  seeUser(){
    const {role} = this.seeForm.value;

    if(!role){
      return;
    }
          this.classroomSrv
            .userList(role)
            .pipe(
              catchError((response) => {
                this.loginError = response.error?.message || 'Errore imprevisto.';
                return throwError(() => response);
              })
            )
            .subscribe({
              next: (response: User[]) => {
                this.users = response;
              },
              error: (err) => {
                console.error('Errore nella richiesta:', err);
              },
            });
  }
}
