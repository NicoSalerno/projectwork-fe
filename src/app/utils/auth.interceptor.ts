import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { JwtService } from '../services/jwt.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // Inject the current `JwtService` and use it to get an authentication token:
  const authTokens = inject(JwtService).getToken();
  // Clone the request to add the authentication header.
  if (authTokens) {
    const newReq = req.clone({
      headers: req.headers.append('Authorization', `Bearer ${authTokens}`),
    });
    return next(newReq);
  } else {
    return next(req);
  }
};
