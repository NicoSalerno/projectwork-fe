import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { User } from '../../entities/user.entity';
import { TMovimentiContoCorrente } from '../../utils/data';
import { Movimento, ContoCorrente } from '../../utils/models';
import { BankService } from '../../services/bank.service';
import { filter, map, switchMap } from 'rxjs';

@Component({
  selector: 'app-home-page',
  standalone: false,
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit {
  protected authSrv = inject(AuthService);
  protected bankSrv = inject(BankService);

  currentUser$ = this.authSrv.currentUser$;
  currentUser?: User;

  movimenti$: Movimento[] = TMovimentiContoCorrente.slice(-3);
  
  contoCorrenteID$ = this.authSrv.currentUser$.pipe(
    map(user => user?.contoCorrenteId)
  );

  contoCorrente$ = this.contoCorrenteID$.pipe(
    filter((id): id is string => !!id),
    switchMap(id => this.bankSrv.getContoCorrenteById(id))
  );

  movimenti: Movimento[] = TMovimentiContoCorrente.slice(-3);

  constructor() {
    this.currentUser$.subscribe(user => {
      this.currentUser = user ?? undefined;
    });
  }

  ngOnInit(): void {}
}
