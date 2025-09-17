import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ClassroomService } from '../../services/classroom.service';
import { AuthService } from '../../services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Classroom } from '../../entities/classroom.entity';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-show-class',
  standalone: false,
  templateUrl: './show-class.component.html',
  styleUrl: './show-class.component.css'
})
export class ShowClassComponent implements OnInit, OnDestroy{

  protected authSrv = inject(AuthService);
  protected classroomSrv = inject(ClassroomService);
  protected router = inject(Router);
  protected activatedRoute = inject(ActivatedRoute);

  protected destroyed$ = new Subject<void>();

  classrooms: Classroom[] = []; // o any[] se non hai ancora il tipo

  ngOnInit(): void {
    this.classroomSrv.showClassrooms()
      .pipe(takeUntil(this.destroyed$))
      .subscribe({
        next: (res) => {
          this.classrooms = res;
        },
        error: (err) => {
          console.error('Errore nel caricamento delle classi:', err);
        }
      });
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
