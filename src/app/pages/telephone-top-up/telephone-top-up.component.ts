import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { User } from '../../entities/user.entity';
import { filter, map, switchMap } from 'rxjs';
import { BankService } from '../../services/bank.service';

@Component({
  selector: 'app-telephone-top-up',
  standalone: false,
  templateUrl: './telephone-top-up.component.html',
  styleUrls: ['./telephone-top-up.component.css']
})
export class TelephoneTopUpComponent implements OnInit {
  protected fb = inject(FormBuilder);
  protected authSrv = inject(AuthService);
  protected router = inject(Router);
  protected bankSrv = inject(BankService);

  telephoneForm = this.fb.group({
    operatoreTelefonico: ['', Validators.required],
    importo: ['', Validators.required],
    number: ['', Validators.required]
  });

  currentUser$ = this.authSrv.currentUser$;
  currentUser?: User;

  ngOnInit(): void {
    this.currentUser$.subscribe(user => {
      this.currentUser = user ?? undefined;
      console.log('Current User:', this.currentUser);
    });
  }

  topUp() {
    const { importo, operatoreTelefonico, number } = this.telephoneForm.value;

    if (!this.currentUser?.contoCorrenteId) {
      console.error('Nessun conto corrente disponibile per il top-up');
      return;
    }

    // Usa il contoCorrenteId reale dall'utente loggato
    this.bankSrv.addPhone(
      this.currentUser.contoCorrenteId, // ID corretto
      Number(importo),
      'RicaricaTelefonica',            // CategoriaMovimento dinamica o fissa
      operatoreTelefonico ?? '',
      Number(number)
    ).subscribe({
      next: () => {
        console.log('Ricarica effettuata con successo');
        this.telephoneForm.reset();
      },
      error: (err) => console.error('Errore durante la ricarica:', err)
    });
  }
}
