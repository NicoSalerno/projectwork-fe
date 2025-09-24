import { Directive, inject, OnDestroy, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { User } from '../entities/user.entity';
import { AuthService } from '../services/auth.service';
import { Subject, takeUntil } from 'rxjs';

@Directive({
  selector: '[appIfStudent]',
  standalone: false
})
export class IfStudentDirective implements OnInit,OnDestroy {

  protected authSrv = inject(AuthService);
  protected viewContainer = inject(ViewContainerRef);
  protected templatedRef = inject<TemplateRef<User>>(TemplateRef)

  protected destroyed$ = new Subject<void>();
  ngOnInit(): void {
    this.authSrv.currentUser$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((user: User | null) => {
        this.viewContainer.clear();
        if (user?.role === 'student') {
          this.viewContainer.createEmbeddedView(this.templatedRef);
        }
      });
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

}
