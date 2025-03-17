import { Worker } from "./worker";

export type RootStackParamList = {
  Home: undefined;
  Tilganger: undefined;
  Innsyn: undefined;
  DetailedInnsyn: { address: string; worker: Worker | null };
  Oppdateringer: undefined;
  Notater: { patientHash: string };
  Foresporsel: undefined;
  DetailedForesporsel: { address: string; note: string; worker: Worker | null };
};
