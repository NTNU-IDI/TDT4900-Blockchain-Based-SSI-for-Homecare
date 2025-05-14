import { Worker } from "./worker";

export type Pages = {
  Home: undefined;
  Access: undefined;
  Insight: undefined;
  DetailedInsight: { address: string; worker: Worker | null };
  ChangeLog: undefined;
  Notes: { clientHash: string };
  Request: undefined;
  DetailedRequest: { address: string; note: string; worker: Worker | null };
};
