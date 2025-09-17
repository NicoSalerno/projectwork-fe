import { Component, inject } from '@angular/core';
import { ClassroomService } from '../../services/classroom.service';
import { AuthService } from '../../services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Assignment } from '../../entities/assignment.entity';
import { catchError, map, Subject, takeUntil, throwError } from 'rxjs';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-see-assignment',
  standalone: false,
  templateUrl: './see-assignment.component.html',
  styleUrl: './see-assignment.component.css',
})
export class SeeAssignmentComponent {
  protected fb = inject(FormBuilder);
  protected authSrv = inject(AuthService);
  protected classroomSrv = inject(ClassroomService);
  protected router = inject(Router);
  protected activatedRoute = inject(ActivatedRoute);

  protected destroyed$ = new Subject<void>();

  ass: Assignment[] = [];
  assi: Assignment | true | undefined;

  seeForm = this.fb.group({
    classId: ['', Validators.required],
    assignmetId: ['', Validators.required],
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

  seeAssignment() {
    const { classId, userId } = this.seeForm.value;

    if (!userId) {
      this.loginError = 'Utente non autenticato.';
      return;
    }

    if (classId) {
      const rawIds = classId.split(/[\n,]+/).map((s) => s.trim()); //Splitta stringhe in substrings usando spicifici separatori

      // Validazione completa: tutti devono essere ID MongoDB validi
      const isValidMongoId = (id: string) => /^[a-f\d]{24}$/i.test(id);
      const invalidIds = rawIds.filter((id) => !isValidMongoId(id));

      if (invalidIds.length > 0) {
        this.loginError = `Invalid ID: ${invalidIds.join(', ')}`;
        return;
      }
      this.classroomSrv
        .seeAssignment(classId)
        .pipe(
          catchError((response) => {
            this.loginError = response.error?.message || 'Errore imprevisto.';
            return throwError(() => response);
          })
        )
        .subscribe({
          next: (response: Assignment[]) => {
            this.ass = response;
          },
          error: (err) => {
            console.error('Errore nella richiesta:', err);
          },
        });
    } else {
      this.loginError = 'Classe o utente non selezionato.';
    }
  }

  setDone() {
    const { classId, assignmetId, userId } = this.seeForm.value;

    if (!userId) {
      this.loginError = 'Utente non autenticato.';
      return;
    }

    if (!classId) {
      this.loginError = 'Classe non inserita.';
      return;
    }

    if (!assignmetId) {
      this.loginError = 'Assignment ID mancante.';
      return;
    }

    const rawIds = classId.split(/[\n,]+/).map((s) => s.trim()); //Splitta stringhe in substrings usando spicifici separatori

    // Validazione completa: tutti devono essere ID MongoDB validi
    const isValidMongoId = (id: string) => /^[a-f\d]{24}$/i.test(id);
    const invalidIds = rawIds.filter((id) => !isValidMongoId(id));

    if (invalidIds.length > 0) {
      this.loginError = `Invalid ID: ${invalidIds.join(', ')}`;
      return;
    }

    this.classroomSrv
      .setCompleted(classId, assignmetId)
      .pipe(
        catchError((response) => {
          this.loginError = response.error?.error || 'Errore imprevisto.';
          return throwError(() => response);
        })
      )
      .subscribe({
        next: (response: Assignment | true) => {
          this.loginError = '';
          this.assi = response;
        },
        error: (err) => {
          console.error('Errore nella richiesta:', err);
        },
      });
  }
}
