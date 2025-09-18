import { Component, inject, Input } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { User } from '../../entities/user.entity';
import { TMovimentiContoCorrente } from '../../utils/data';
import { Movimento } from '../../utils/models';
@Component({
  selector: 'app-home-page',
  standalone: false,
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css'
})
export class HomePageComponent {

  protected authSrv = inject(AuthService);

  currentUser$ = this.authSrv.currentUser$;
  currentUser?: User;

  name = this.authSrv.currentUser$.pipe

  movimenti$: Movimento[] = TMovimentiContoCorrente.slice(-3);

  constructor() {
    this.currentUser$.subscribe(user => {
      this.currentUser = user ? user : undefined;
    });
  }

}
