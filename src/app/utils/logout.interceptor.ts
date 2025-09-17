import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';

export const logoutInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    catchError((response: any) => {
      if (response instanceof HttpErrorResponse && response.status === 401) {
        inject(AuthService).logout();
      }
      return throwError(() => response);
    })
  );
};
