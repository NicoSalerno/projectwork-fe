import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { BankService } from '../../services/bank.service';
import { User } from '../../entities/user.entity';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-details',
  standalone: false,
  templateUrl: './details.component.html',
  styleUrl: './details.component.css'
})
export class DetailsComponent implements OnInit {

  protected authSrv = inject(AuthService);
  protected bankSrv = inject(BankService);
  protected route = inject(ActivatedRoute);

  currentUser$ = this.authSrv.currentUser$;
  currentUser?: User;
  contoCorrenteId: string = '';
  id!: string;

  movimento: any; // qui salvi il movimento ricevuto dal server

  ngOnInit(): void {
    // Prendo il parametro dalla route
    this.id = this.route.snapshot.paramMap.get('id') ?? '';
    console.log('Parametro ricevuto:', this.id);

    // Prendo l'utente corrente
    this.currentUser$.subscribe(user => {
      this.currentUser = user ?? undefined;

      if (this.currentUser?.contoCorrenteId) {
        // Recupero il conto corrente
        this.bankSrv.getContoCorrenteById(this.currentUser.contoCorrenteId)
          .subscribe({
            next: (res) => {
              this.contoCorrenteId = res.id;

              // Recupero il movimento
              this.bankSrv.getMovementById(this.contoCorrenteId, this.id)
                .subscribe({
                  next: (mov) => {
                    console.log('Movimento ricevuto:', mov);
                    this.movimento = mov; // salvo i dati per il template
                  },
                  error: (err) => console.error('Errore nel recupero movimento:', err)
                });
            },
            error: (err) => console.error('Errore durante il recupero del conto:', err)
          });
      }
    });
  }
}
