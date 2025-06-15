export interface Grade {
  vak: {
    naam: string;
    afkorting: string;
  };
  type: string;
  $type: string;
  leerling: {
    UUID: string;
    roepnaam: string;
    achternaam: string;
    leerlingnummer: number;
  };
  resultaat: string;
  datumInvoer: string;
  teltNietmee: boolean;
  geldendResultaat: string;
  toetsNietGemaakt: boolean;
}

export interface GradesResponse {
  items: Grade[];
}