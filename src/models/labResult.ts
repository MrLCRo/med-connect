export interface LabResult {
  id: string;
  date: string;
  name: string;
  patientId: string;
  status: "normal" | "abnormal" | "critical";
  value: string;
}
