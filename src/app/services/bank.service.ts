import { HttpClient, HttpParams } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { map, Observable } from "rxjs";
import { ContoCorrente } from "../entities/user.entity";

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
}
