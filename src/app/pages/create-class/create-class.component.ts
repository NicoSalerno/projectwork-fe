import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, map, Subject, takeUntil, throwError } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { ClassroomService } from '../../services/classroom.service';

@Component({
  selector: 'app-create-class',
  standalone: false,
  templateUrl: './create-class.component.html',
  styleUrls: ['./create-class.component.css'],
})
export class CreateClassComponent implements OnInit, OnDestroy {
  protected fb = inject(FormBuilder);
  protected authSrv = inject(AuthService);
  protected classroomSrv = inject(ClassroomService);
  protected router = inject(Router);
  protected activatedRoute = inject(ActivatedRoute);

  protected destroyed$ = new Subject<void>();

  createForm = this.fb.group({
    name: ['', Validators.required],
    students: ['', Validators.required],
    userId: ['', Validators.required],
  });

  loginError = '';
  requestedUrl: string | null = null;
  class: any;
  successMessage: string | null = null;

  ngOnInit() {
    // Popola automaticamente il campo userId quando l'utente è disponibile
    this.authSrv.currentUser$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((user) => {
        if (user?.id) {
          this.createForm.patchValue({ userId: user.id });
        }
      });

    // Reset errore quando il form cambia
    this.createForm.valueChanges
      .pipe(takeUntil(this.destroyed$))
      .subscribe(() => {
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

  createClass() {
    const { name, students, userId } = this.createForm.value;

    if (!userId) {
      this.loginError = 'Utente non autenticato.';
      return;
    }

    if (name && students) {
      const rawIds = students.split(/[\n,]+/).map((s) => s.trim()); //Splitta stringhe in substrings usando spicifici separatori

      // Validazione completa: tutti devono essere ID MongoDB validi
      const isValidMongoId = (id: string) => /^[a-f\d]{24}$/i.test(id);
      const invalidIds = rawIds.filter((id) => !isValidMongoId(id));

      if (invalidIds.length > 0) {
        this.loginError = `Invalid ID: ${invalidIds.join(', ')}`;
        return;
      }

      const studentArray = rawIds; // ora sappiamo che tutti sono validi

      this.classroomSrv
        .createClassroom(name, studentArray)
        .pipe(
          catchError((response) => {
            this.loginError = response.error?.message || 'Errore imprevisto.';
            return throwError(() => response);
          })
        )
        .subscribe({
          next: (response: any) => {
            this.loginError = response.error?.message;
            this.class = response;
            this.successMessage = 'Class created';
          },
          error: (err) => {
            console.error('Errore nella richiesta:', err);
          },
        });
    } else {
      this.loginError = 'Fill in all fields';
    }
  }
}
