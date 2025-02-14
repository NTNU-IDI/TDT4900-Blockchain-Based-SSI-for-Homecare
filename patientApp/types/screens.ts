import { Worker } from "./Worker"

export type RootStackParamList = {
  Home: undefined;
  Tilganger: undefined; 
  Innsyn: undefined; 
  DetailedInnsyn: { address: string; worker: Worker | null }; 
  Oppdateringer: undefined; 
  Notater: { notes: string[] }; 
  Foresporsel: undefined; 
  DetailedForesporsel: { address: string; note: string; worker: Worker | null }; 
};
  