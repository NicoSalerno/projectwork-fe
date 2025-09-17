import { Component, inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-nav-bar',
  standalone: false,
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.css'
})
export class NavBarComponent {
  protected authSrv = inject(AuthService);

  currentUser$ = this.authSrv.currentUser$;

  logout() {
    this.authSrv.logout();
  }
}
