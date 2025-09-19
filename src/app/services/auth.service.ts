import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {
  catchError,
  distinctUntilChanged,
  map,
  of,
  ReplaySubject,
  tap,
} from 'rxjs';
import { JwtService } from './jwt.service';
import { User } from '../entities/user.entity';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  protected http = inject(HttpClient);
  protected jwtSrv = inject(JwtService);
  protected router = inject(Router);

  protected _currentUser$ = new ReplaySubject<User | null>(1);
  currentUser$ = this._currentUser$.asObservable();

  isAuthenticated$ = this.currentUser$.pipe(
    map((user) => !!user),
    distinctUntilChanged()
  );

  getCurrentUser(): User | null {
    let currentUser: User | null = null;

    // Prendi il valore corrente in modo sincrono
    this._currentUser$
      .subscribe((user) => this._currentUser$.next(user))
      .unsubscribe();

    return currentUser;
  }

  constructor() {
    const tokenValid = this.jwtSrv.areTokensValid();
    if (!tokenValid) {
      this.logout();
    } else {
      const user = this.jwtSrv.getPayload<User>();
      this._currentUser$.next(user);
    }
  }

  login(email: string, password: string) {
    return this.http.post<any>('/api/login', { email, password }).pipe(
      tap(res => this.jwtSrv.setToken(res.token)),
      tap(res => {
        const userWithConto = {
          ...res.user,
          contoCorrenteId: res.contoCorrenteId
        };
        this._currentUser$.next(userWithConto);
      }),
      map(res => ({
        ...res.user,
        contoCorrenteId: res.contoCorrenteId
      }))
    );
  }


  register(email: string, password: string, confermaPassword: string, NomeTitolare: string, CognomeTitolare:string){
    return this.http.post<any>('/api/register', { email, password, confermaPassword, NomeTitolare, CognomeTitolare});
  }

  changePassword(oldPassword: string, newPassword: string, confirmNewPassword: string){
    return this.http.post<User>('api/changePassword', {oldPassword, newPassword, confirmNewPassword})
  }

  fetchUser() {
    return this.http.get<User>('/api/me').pipe(
      catchError((_) => {
        return of(null);
      }),
      tap((user) => this._currentUser$.next(user))
    );
  }

  logout() {
    this.jwtSrv.removeToken();
    this._currentUser$.next(null);
    this.router.navigate(['/']);
  }
}
