import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { map, Observable } from "rxjs";
import { ContoCorrente } from "../entities/user.entity";

@Injectable({
  providedIn: "root",
})
export class BankService {
  protected http = inject(HttpClient);

  getContoCorrenteById(id: string): Observable<ContoCorrente> {
    return this.http.get<ContoCorrente>(
      `api/ContoCorrente/getContoCorrenteById/${id}`
    );
  }

  addPhone(
    ContoCorrenteID: string,
    Importo: number,
    CategoriaMovimento: string,
    OperatoreTelefonico: string,
    NumeroTelefono: number
  ) {
    const payload = {
      ContoCorrenteID,
      Importo,
      CategoriaMovimento,
      OperatoreTelefonico,
      NumeroTelefono,
    };
    return this.http.post("/api/Movimenti/addRicarica", payload);
  }
}
