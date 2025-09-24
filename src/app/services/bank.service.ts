import { HttpClient, HttpErrorResponse, HttpParams } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { catchError, map, Observable, throwError } from "rxjs";
import { ContoCorrente } from "../entities/user.entity";
import { MovimentiResponse, Movimento } from "../utils/models";

@Injectable({
  providedIn: "root",
})
export class BankService {
  protected http = inject(HttpClient);

  getContoCorrenteById(id?: string): Observable<ContoCorrente> {
    return this.http.get<ContoCorrente>(
      `/api/ContoCorrente/getContoCorrenteById/${id}`
    );
  }

  getMovimentiConto(contoCorrenteId: string): Observable<any> {
    const params = new HttpParams().set('ContoCorrenteID', contoCorrenteId);
    return this.http.get(`/api/Movimenti/getMovimentiConto`, { params });
  }

  addPhone(
    contoId: string,
    Data: string,
    Importo: number,
    CategoriaMovimentoID: string,
    OperatoreTelefonico: string,
    NumeroTelefono: string
  ) {
    const payload = {
      Data,
      Importo,
      CategoriaMovimentoID,
      OperatoreTelefonico,
      NumeroTelefono,
    };

    return this.http.post(
      `/api/Movimenti/addRicarica/${contoId}`,
      payload
    );
  }

  addWire(contoId: string, Importo: number, DestinatarioIBAN: string, CategoriaMovimentoID: string){
    const payload = {
      Importo,
      DestinatarioIBAN,
      CategoriaMovimentoID
    }
      return this.http.post(
      `/api/Movimenti/addBonifico/${contoId}`,
      payload
    );
  }

  getMovementById(contoId: string, movimentoId: string){
    return this.http.get(`/api/Movimenti/getMovimentoById/${contoId}/${movimentoId}`);
  }

  


  getLatestMovements(contoCorrenteId: string, n: number) {
    return this.http.get<MovimentiResponse>(
      `/api/Movimenti/getMovimentiConto?ContoCorrenteID=${contoCorrenteId}&n=${n}`
    );
  }

  getMovementsByCategoryAndAccount(contoCorrenteId: string, categoriaId: string, n: number): Observable<{ movimenti: Movimento[] }> {
    const url = `/api/Movimenti/getMovimentiByCategoriaEConto?ContoCorrenteID=${contoCorrenteId}&CategoriaMovimentoID=${categoriaId}&n=${n}`;
    return this.http.get<{ movimenti: Movimento[] }>(url);
  }

getMovementsByDateRange(
  contoCorrenteId: string,
  startDate: string,
  endDate: string,
  n: number
): Observable<{ movimenti: Movimento[] }> {
  const url = `/api/Movimenti/getMovimentiByContoEIntervalloDate?ContoCorrenteID=${contoCorrenteId}&startDate=${startDate}&endDate=${endDate}&n=${n}`;
  return this.http.get<{ movimenti: Movimento[] }>(url);
}


  // Funzione di esportazione CSV
  exportToCsv(movements: Movimento[]): void {
    const header = ['Data', 'Importo', 'NomeCategoria'];
    const csv = [
      header.join(','),
      ...movements.map(m => [m.Data, m.Saldo, m.CategoriaMovimentoID].join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'movimenti.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  // Gestione degli errori HTTP
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Errore sconosciuto';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Errore: ${error.error.message}`;
    } else {
      errorMessage = `Codice errore: ${error.status}\nMessaggio: ${error.message}`;
    }
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
