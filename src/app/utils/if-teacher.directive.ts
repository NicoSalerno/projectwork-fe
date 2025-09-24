import { Directive, inject, OnDestroy, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Subject, takeUntil } from 'rxjs';
import { User } from '../entities/user.entity';

@Directive({
  selector: '[appIfTeacher]',
  standalone: false
})
export class IfTeacherDirective implements OnInit,OnDestroy{

  protected authSrv = inject(AuthService);
  protected viewContainer = inject(ViewContainerRef);
  protected templatedRef = inject<TemplateRef<User>>(TemplateRef)

  protected destroyed$ = new Subject<void>();
  ngOnInit(): void {
    this.authSrv.currentUser$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((user: User | null) => {
        this.viewContainer.clear();
        if (user?.role === 'teacher') {
          this.viewContainer.createEmbeddedView(this.templatedRef);
        }
      });
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }


}
