import { Worker } from "./Worker"
export type RootStackParamList = {
  Home: undefined; // No parameters for Home
  Tilganger: undefined; // No parameters for Tilganger
  Innsyn: undefined; // No parameters for Innsyn
  Oppdateringer: undefined; // No parameters for Oppdateringer
  Notater: undefined; // No parameters for Notater
  Foresporsel: undefined; // No parameters for Foresporsel
  DetailedForesporsel: { address: string; note: string; worker: Worker | null }; // Parameters for DetailedForesporsel
};
  