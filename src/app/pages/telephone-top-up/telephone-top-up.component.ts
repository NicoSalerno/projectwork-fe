import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { User } from '../../entities/user.entity';
import { BankService } from '../../services/bank.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-telephone-top-up',
  standalone: false,
  templateUrl: './telephone-top-up.component.html',
  styleUrls: ['./telephone-top-up.component.css'],
  providers: [DatePipe] // ✅ iniettiamo il DatePipe
})
export class TelephoneTopUpComponent implements OnInit {
  protected fb = inject(FormBuilder);
  protected authSrv = inject(AuthService);
  protected router = inject(Router);
  protected bankSrv = inject(BankService);
  protected datePipe = inject(DatePipe);

  success = false; 

  telephoneForm = this.fb.group({
    operatoreTelefonico: ['', Validators.required],
    importo: ['', Validators.required],
  number: [
    '',
    [
      Validators.required,
      Validators.pattern(/^3\d{8,9}$/) // cellulare italiano valido
    ]
  ]
  });

  currentUser$ = this.authSrv.currentUser$;
  currentUser?: User;

  contoCorrenteId?: string;

  ngOnInit(): void {
    this.currentUser$.subscribe(user => {
      this.currentUser = user ?? undefined;

      if (this.currentUser?.contoCorrenteId) {
        this.bankSrv.getContoCorrenteById(this.currentUser.contoCorrenteId)
          .subscribe({
            next: (res) => {
              console.log("conto corrente utente: ", res.id);
              this.contoCorrenteId = res.id;

              const userId = res.User.id;
              console.log("ID conto:", this.contoCorrenteId);
              console.log("ID utente:", userId);
            },
            error: (err) => console.error('Errore durante il recupero del conto:', err)
          });
      }
    });
  }

  topUp() {
    const { importo, operatoreTelefonico, number } = this.telephoneForm.value;

    if (!this.contoCorrenteId) {
      console.error("Nessun contoCorrenteId trovato");
      return;
    }

    const formattedDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd');

    this.bankSrv.addPhone(
      this.contoCorrenteId,
      formattedDate!,
      Number(importo),
      '68d4e8af80001e0763c34888', // TODO: gestire dinamicamente la categoria
      operatoreTelefonico ?? '',
      number ?? ''
    ).subscribe({
      next: (res) => {
        console.log('Ricarica effettuata con successo', res);
        this.success = true;
        this.telephoneForm.reset();
      },
      error: (err) => console.error('Errore durante la ricarica:', err)
    });
  }
}
