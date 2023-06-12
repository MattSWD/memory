/**
 * Interfaccia che ricalca il modello presente nel DB
 * per l'entità denominata: 'Match'; */
export interface Match {
  _id?: string;
  nickname?: string;
  time?: number;
  rank?: number;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Interfaccia che ricalca la risposta
 * ricevuta in caso di richiesta della
 * classifica Globale; */
export interface GlobalRanking {
  response: Match[];
  currentPage: number;
  totalElements: number;
  elementsPerPage: number;
  totalPages: number;
}
