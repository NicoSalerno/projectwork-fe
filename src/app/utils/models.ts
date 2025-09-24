export interface Movimento {
  IdMovimento: number;
  ContoCorrenteID: number;
  Data: string;
  Importo: number;
  Saldo: number;
  CategoriaMovimentoID: number;
  DescrizioneEstesa: string;
}

export interface MovimentiResponse {
  movimenti: Movimento[];
  saldoFinale: number;
}


export interface ContoCorrente {
  ContoCorrenteID: number;
  Email: string;
  Password: string;
  CognomeTitolare: string;
  NomeTitolare: string;
  DataApertura: string;
  IBAN: string;
}
