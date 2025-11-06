import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
  orderBy,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Patient } from "@/models/patient";
import { Medication } from "@/models/medication";
import { Vaccination } from "@/models/vaccination";
import { Consultation } from "@/models/consultation";
import { LabResult } from "@/models/labResult";
import { MedicalImage } from "@/models/medicalImage";

export const getPatient = async (
  patientId: string
): Promise<Patient | null> => {
  try {
    const patientDoc = await getDoc(doc(db, "patients", patientId));
    if (!patientDoc.exists()) return null;

    const data = patientDoc.data();
    return {
      id: patientDoc.id,
      email: data.email,
      cnp: data.cnp,
      fullName: data.fullName,
      dateOfBirth: data.dateOfBirth?.toDate().toLocaleDateString() || "",
      gender: data.gender,
      bloodType: data.bloodType,
      allergies: data.allergies || [],
    };
  } catch (error) {
    console.error("Eroare la preluarea pacientului:", error);
    return null;
  }
};

export const getPatientMedications = async (
  patientId: string
): Promise<Medication[]> => {
  try {
    const q = query(
      collection(db, "medications"),
      where("patientId", "==", patientId)
    );
    const snapshot = await getDocs(q);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const activeMedications = snapshot.docs
      .map((doc) => {
        const data = doc.data();
        const prescribedDate = data.prescribedDate?.toDate();

        if (!prescribedDate) return null;

        const prescribedDateMidnight = new Date(prescribedDate);
        prescribedDateMidnight.setHours(0, 0, 0, 0);

        const endDate = new Date(prescribedDateMidnight);
        endDate.setDate(endDate.getDate() + data.duration);

        if (today >= prescribedDateMidnight && today <= endDate) {
          return {
            id: doc.id,
            patientId: data.patientId,
            consultationId: data.consultationId,
            name: data.name,
            dose: data.dose,
            frequency: data.frequency,
            duration: data.duration,
            prescribedDate: prescribedDate.toLocaleDateString(),
          };
        }

        return null;
      })
      .filter((med) => med !== null) as Medication[];

    console.log("Număr total de medicamente active:", activeMedications.length);
    return activeMedications;
  } catch (error) {
    console.error("Eroare la preluarea medicamentelor:", error);
    return [];
  }
};

export const getPatientVaccinations = async (
  patientId: string
): Promise<Vaccination[]> => {
  try {
    const q = query(
      collection(db, "vaccinations"),
      where("patientId", "==", patientId)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        patientId: data.patientId,
        consultationId: data.consultationId,
        name: data.name,
        date: data.date?.toDate().toLocaleDateString() || "",
        status: data.status,
      };
    });
  } catch (error) {
    console.error("Eroare la preluarea vaccinărilor:", error);
    return [];
  }
};

export const getPatientConsultations = async (
  patientId: string
): Promise<Consultation[]> => {
  try {
    const q = query(
      collection(db, "consultations"),
      where("patientId", "==", patientId),
      orderBy("date", "desc")
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        patientId: data.patientId,
        doctorId: data.doctorId,
        doctorName: data.doctorName,
        date: data.date?.toDate().toLocaleDateString() || "",
        diagnosis: data.diagnosis,
        notes: data.notes,
        imageUrls: data.imageUrls || [],
      };
    });
  } catch (error) {
    console.error("Eroare la preluarea consultațiilor:", error);
    return [];
  }
};

export const getPatientLabResults = async (
  patientId: string
): Promise<LabResult[]> => {
  try {
    const q = query(
      collection(db, "labResults"),
      where("patientId", "==", patientId)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        patientId: data.patientId,
        name: data.name,
        value: data.value,
        date: data.date?.toDate().toLocaleDateString() || "",
        status: data.status,
      };
    });
  } catch (error) {
    console.error("Eroare la preluarea rezultatelor de laborator:", error);
    return [];
  }
};

export const getPatientMedicalImages = async (
  patientId: string
): Promise<MedicalImage[]> => {
  try {
    const q = query(
      collection(db, "medicalImages"),
      where("patientId", "==", patientId)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        consultationId: data.consultationId,
        patientId: data.patientId,
        type: data.type,
        notes: data.notes,
        date: data.date?.toDate().toLocaleDateString() || "",
        imageUrl: data.imageUrl,
      };
    });
  } catch (error) {
    console.error("Eroare la preluarea imaginilor medicale:", error);
    return [];
  }
};
