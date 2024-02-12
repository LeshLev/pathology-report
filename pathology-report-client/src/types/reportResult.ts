export type ReportResult = {
  id: number;
  diagnosticMetric: string;
  observation: string;
  condition: string;
  units: string;
  value: number;
  everlabHigh: number | null;
  everlabLow: number | null;
  standardHigh: number | null;
  standardLow: number | null;
  diagnostic: string;
  diagnosticGroups: string;
};
