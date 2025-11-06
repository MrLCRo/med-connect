export interface Consultation {
  id: string;
  patientId: string;
  notes: string;
  imageUrls: string[];
  doctorName: string;
  doctorId: string;
  diagnosis: string;
  date: string;
}
