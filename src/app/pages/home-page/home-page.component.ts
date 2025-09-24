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

  movimenti$: Movimento[] = []
  saldo: number = 0;
  
  contoCorrenteID$ = this.authSrv.currentUser$.pipe(
    map(user => user?.contoCorrenteId)
  );

  contoCorrente$ = this.contoCorrenteID$.pipe(
    filter((id): id is string => !!id),
    switchMap(id => this.bankSrv.getContoCorrenteById(id))
  );

  ngOnInit(): void {
    // Recupera currentUser e movimenti solo quando contoCorrenteId è disponibile
    this.authSrv.currentUser$
      .pipe(
        filter((user): user is User => !!user?.contoCorrenteId),
        switchMap(user => {
          this.currentUser = user; // aggiorna currentUser
          return this.bankSrv.getMovimentiConto(user.contoCorrenteId!);
        })
      )
      .subscribe({
        next: (res) => {
          this.saldo = res.saldoFinale;
          console.log(res.saldoFinale)
          this.movimenti$ = res.movimenti.slice(0, 5);
          console.log(this.movimenti$);
        },
        error: (err) => console.error('Errore nel recupero movimenti:', err)
      });
  }

}
