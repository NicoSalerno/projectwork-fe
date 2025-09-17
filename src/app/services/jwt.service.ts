import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class JwtService {

  protected tokenStorageKey = 'authToken';

  getPayload<T>() {
    const authTokens = this.getToken();
    if (!authTokens) {
      return null;
    }
    return jwtDecode<T>(authTokens);
  }

  areTokensValid() {
    const authTokens = this.getToken();
    if (!authTokens) {
      return false;
    }
    const decoded = jwtDecode(authTokens);
    return !decoded.exp || decoded.exp * 1000 > Date.now();
  }

  getToken(): string | null {
    const token =  localStorage.getItem(this.tokenStorageKey);

    if (!(token)){
      this.removeToken();
      return null;
    }

    return token;
  }

  setToken(token: string) {
    localStorage.setItem(this.tokenStorageKey, token);
  }

  removeToken() {
    localStorage.removeItem(this.tokenStorageKey);
  }
}
