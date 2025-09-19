export type User = {
    id?: string;
    email: string,
    NomeTitolare: string,
    CognomeTitolare: string,
    contoCorrenteId: string
}

export interface ContoCorrente {
  User: {
    NomeTitolare: string;
    CognomeTitolare: string;
    Titolare: string;
    id: string;
  };
  DataApertura: string;
  IBAN: string;
  Titolare: string;
  id: string;
}
