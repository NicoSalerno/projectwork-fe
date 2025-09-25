import { Component, inject, OnInit } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { BankService } from "../../services/bank.service";
import { AuthService } from "../../services/auth.service";
import { User } from "../../entities/user.entity";
import { map } from "rxjs";

@Component({
  selector: "app-wire-transfer",
  standalone: false,
  templateUrl: "./wire-transfer.component.html",
  styleUrl: "./wire-transfer.component.css",
})
export class WireTransferComponent implements OnInit {
  protected fb = inject(FormBuilder);
  protected bankSrv = inject(BankService);
  protected authSrv = inject(AuthService);

  currentUser$ = this.authSrv.currentUser$;
  currentUser?: User;
  success = false;
  error: string = "";
  wireForm = this.fb.group({
    iban: [
      "",
      [
        Validators.required,
        Validators.pattern(/IT[0-9]{2}[A-Z]{1}[0-9]{10}[A-z0-9]{12}$/), // IBAN italiano valido
      ],
    ],
    importo: ["", Validators.required],
  });
  contoCorrenteId: string = "";

  ngOnInit(): void {
    this.currentUser$.subscribe((user) => {
      this.currentUser = user ?? undefined;

      if (this.currentUser?.contoCorrenteId) {
        this.bankSrv
          .getContoCorrenteById(this.currentUser.contoCorrenteId)
          .subscribe({
            next: (res) => {
              console.log("conto corrente utente: ", res.id);
              this.contoCorrenteId = res.id;

              const userId = res.User.id;
              console.log("ID conto:", this.contoCorrenteId);
              console.log("ID utente:", userId);
            },
            error: (err) =>
              console.error("Errore durante il recupero del conto:", err),
          });
      }
    });
  }

  wire() {
    const { iban, importo } = this.wireForm.value;
    const importoNumber = Number(importo);

    if (!iban || isNaN(importoNumber)) {
      this.error = "IBAN o importo non valido";
      return;
    }

    this.bankSrv
      .addWire(
        this.contoCorrenteId,
        importoNumber,
        iban,
        "68d50455ed3abeb54bc039c2"
      )
      .subscribe({
        next: (res) => {
          console.log("Bonifico effettuato con successo!", res);
          this.wireForm.reset();
          this.success = true;
          this.error = "";

          // Nascondi messaggio dopo 3 secondi
          setTimeout(() => (this.success = false), 3000);
        },
        error: (err) => {
          console.error("Errore durante il bonifico:", err);
          this.error =
            err?.error?.message ||
            err?.error || 
            "Errore imprevisto durante il bonifico";
        },
      });
  }
}
