import { Component, inject, OnInit, signal } from "@angular/core";
import { BankService } from "../../services/bank.service";
import { Movimento } from "../../utils/models";
import { AuthService } from "../../services/auth.service";
import { User } from "../../entities/user.entity";
import { filter, switchMap } from "rxjs";

@Component({
  selector: "app-functionality",
  standalone: false,
  templateUrl: "./functionality.component.html",
  styleUrl: "./functionality.component.css",
})
export class FunctionalityComponent implements OnInit {
  activeSection: "funzione1" | "funzione2" | "funzione3" | null = null;

  private movementsService = inject(BankService);
  protected authSrv = inject(AuthService);
  protected bankSrv = inject(BankService);

  currentUser$ = this.authSrv.currentUser$;
  currentUser?: User;
  movimenti$: Movimento[] = [];
  saldo: number = 0;
  selectedCategoryId = signal<string | undefined>(undefined);
  n = signal<number | undefined>(undefined);
  movements = signal<Movimento[]>([]);
  finalBalance = signal<number | undefined>(undefined);
  nError = false;
  contoCorrenteId: string = "";
  startDate = signal<string | undefined>(undefined);
  endDate = signal<string | undefined>(undefined);

  categories = signal([
    { id: '68d50455ed3abeb54bc039c3', name: 'Bonifico Entrata' },
    { id: '68d50455ed3abeb54bc039c2', name: 'Bonifico Uscita' },
    { id: '68d50455ed3abeb54bc039c1', name: 'Ricarica' },
  ]);

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
  showSection(section: "funzione1" | "funzione2" | "funzione3") {
    this.activeSection = section;
  }

  clearError(): void {
    this.nError = false;
  }

  validateNumber(num: number | undefined): boolean {
    if (num === undefined || num <= 0 || isNaN(num)) {
      this.nError = true;
      return false;
    }
    this.nError = false;
    return true;
  }

  searchMovements(): void {
    const num = this.n();
    if (!this.validateNumber(num)) {
      console.error("Inserire un numero valido di movimenti.");
      return;
    }

    if (num !== undefined) {
      this.movementsService
        .getLatestMovements(this.contoCorrenteId, num)
        .subscribe({
          next: (response) => {
            console.log("Dati ricevuti:", response);

            this.movements.set(response.movimenti);
            this.finalBalance.set(response.saldoFinale);
          },
          error: (error) => {
            console.error("Errore nella ricerca dei movimenti", error);
          },
        });
    }
  }

  searchMovementsByCategory(): void {
    const num = this.n();
    const categoryId = this.selectedCategoryId();

    if (num === undefined || num <= 0 || !categoryId) {
      console.error('Inserire un numero e una categoria validi.');
      return;
    }

    this.movementsService
      .getMovementsByCategoryAndAccount(this.contoCorrenteId, categoryId, num)
      .subscribe({
        next: (response) => {
          // Assegna direttamente i movimenti, già ordinati dal backend
          this.movements.set(response.movimenti);
        },
        error: (error) => {
          console.error('Errore nella ricerca dei movimenti per categoria', error);
        },
      });
  }

  searchMovementsByDate(): void {
    const num = this.n();
    const start = this.startDate();
    const end = this.endDate();
    if (num === undefined || num <= 0 || !start || !end) {
      console.error('Inserire un numero, una data di inizio e una data di fine validi.');
      return;
    }
    this.movementsService.getMovementsByDateRange(this.contoCorrenteId, start, end, num).subscribe({
      next: (response) => {
        this.movements.set(response.movimenti);
      },
      error: (error) => {
        console.error('Errore nella ricerca dei movimenti per data', error);
      }
    });
  }

  exportMovements(): void {
    if (this.movements().length === 0) {
      console.warn("Nessun movimento da esportare.");
      return;
    }
    this.bankSrv.exportToCsv(this.movements());
  }
  
}
