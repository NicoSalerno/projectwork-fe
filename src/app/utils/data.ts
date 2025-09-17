// ---------- Conti Correnti ----------
export const TContiCorrenti = [
  {
    ContoCorrenteID: 1,
    Email: "mario.rossi@email.it",
    Password: "pwd123",
    CognomeTitolare: "Rossi",
    NomeTitolare: "Mario",
    DataApertura: "2022-01-15",
    IBAN: "IT60X0542811101000000123456",
  },
  {
    ContoCorrenteID: 2,
    Email: "anna.bianchi@email.it",
    Password: "annaPwd!",
    CognomeTitolare: "Bianchi",
    NomeTitolare: "Anna",
    DataApertura: "2023-06-20",
    IBAN: "IT32D0306909606100000001234",
  },
  {
    ContoCorrenteID: 3,
    Email: "luca.verdi@email.it",
    Password: "verde2024",
    CognomeTitolare: "Verdi",
    NomeTitolare: "Luca",
    DataApertura: "2021-11-05",
    IBAN: "IT85K0200805312000100200300",
  },
];

// ---------- Categorie Movimenti ----------
export const TCategorieMovimenti = [
  { CategoriaMovimentoID: 1, NomeCategoria: "Apertura Conto", Tipologia: "Entrata" },
  { CategoriaMovimentoID: 2, NomeCategoria: "Bonifico Entrata", Tipologia: "Entrata" },
  { CategoriaMovimentoID: 3, NomeCategoria: "Bonifico Uscita", Tipologia: "Uscita" },
  { CategoriaMovimentoID: 4, NomeCategoria: "Prelievo contanti", Tipologia: "Uscita" },
  { CategoriaMovimentoID: 5, NomeCategoria: "Pagamento Utenze", Tipologia: "Uscita" },
  { CategoriaMovimentoID: 6, NomeCategoria: "Ricarica Telefonica", Tipologia: "Uscita" },
  { CategoriaMovimentoID: 7, NomeCategoria: "Versamento Bancomat", Tipologia: "Entrata" },
  { CategoriaMovimentoID: 8, NomeCategoria: "Accredito Stipendio", Tipologia: "Entrata" },
];

// ---------- Movimenti Conto Corrente ----------
export const TMovimentiContoCorrente = [
  {
    MovimentoID: 1,
    ContoCorrenteID: 1,
    Data: "2022-01-15",
    Importo: 1000.0,
    Saldo: 1000.0,
    CategoriaMovimentoID: 1,
    DescrizioneEstesa: "Apertura conto",
  },
  {
    MovimentoID: 2,
    ContoCorrenteID: 1,
    Data: "2022-02-10",
    Importo: 1500.0,
    Saldo: 2500.0,
    CategoriaMovimentoID: 8,
    DescrizioneEstesa: "Accredito stipendio febbraio",
  },
  {
    MovimentoID: 3,
    ContoCorrenteID: 1,
    Data: "2022-02-15",
    Importo: -200.0,
    Saldo: 2300.0,
    CategoriaMovimentoID: 5,
    DescrizioneEstesa: "Pagamento bolletta luce",
  },
  {
    MovimentoID: 4,
    ContoCorrenteID: 1,
    Data: "2022-02-20",
    Importo: -100.0,
    Saldo: 2200.0,
    CategoriaMovimentoID: 4,
    DescrizioneEstesa: "Prelievo bancomat",
  },
  {
    MovimentoID: 5,
    ContoCorrenteID: 2,
    Data: "2023-06-20",
    Importo: 500.0,
    Saldo: 500.0,
    CategoriaMovimentoID: 1,
    DescrizioneEstesa: "Apertura conto",
  },
  {
    MovimentoID: 6,
    ContoCorrenteID: 2,
    Data: "2023-07-01",
    Importo: 1200.0,
    Saldo: 1700.0,
    CategoriaMovimentoID: 2,
    DescrizioneEstesa: "Bonifico entrata da cliente",
  },
  {
    MovimentoID: 7,
    ContoCorrenteID: 2,
    Data: "2023-07-05",
    Importo: -300.0,
    Saldo: 1400.0,
    CategoriaMovimentoID: 6,
    DescrizioneEstesa: "Ricarica telefonica",
  },
];
