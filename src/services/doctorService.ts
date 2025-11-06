import {
  collection,
  query,
  where,
  getDocs,
  getDoc,
  doc,
  addDoc,
  orderBy,
  Timestamp,
} from "firebase/firestore";
import { Doctor } from "@/models/doctor";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "@/lib/firebase";
import { Patient } from "@/models/patient";
import { MedicalImage } from "@/models/medicalImage";
import { Consultation } from "@/models/consultation";

export const getDoctorPatients = async (
  doctorId: string
): Promise<Patient[]> => {
  try {
    const consultationsQuery = query(
      collection(db, "consultations"),
      where("doctorId", "==", doctorId),
      orderBy("date", "desc")
    );
    const consultationsSnapshot = await getDocs(consultationsQuery);

    const patientIds = new Set<string>();
    consultationsSnapshot.docs.forEach((doc) => {
      patientIds.add(doc.data().patientId);
    });

    if (patientIds.size === 0) return [];

    const patients: Patient[] = [];
    for (const patientId of patientIds) {
      const patientQuery = query(
        collection(db, "patients"),
        where("__name__", "==", patientId)
      );
      const patientSnapshot = await getDocs(patientQuery);

      if (!patientSnapshot.empty) {
        const patientDoc = patientSnapshot.docs[0];
        const data = patientDoc.data();
        patients.push({
          id: patientDoc.id,
          email: data.email,
          cnp: data.cnp,
          fullName: data.fullName,
          dateOfBirth:
            data.dateOfBirth?.toDate().toISOString().split("T")[0] || "",
          gender: data.gender,
          bloodType: data.bloodType,
          allergies: data.allergies || [],
        });
      }
    }

    return patients;
  } catch (error) {
    console.error("Eroare la preluarea pacienților medicului:", error);
    return [];
  }
};

export const searchPatientByCNP = async (
  cnp: string
): Promise<Patient | null> => {
  try {
    const q = query(collection(db, "patients"), where("cnp", "==", cnp));
    const snapshot = await getDocs(q);

    if (snapshot.empty) return null;

    const patientDoc = snapshot.docs[0];
    const data = patientDoc.data();

    return {
      id: patientDoc.id,
      email: data.email,
      cnp: data.cnp,
      fullName: data.fullName,
      dateOfBirth: data.dateOfBirth?.toDate().toISOString().split("T")[0] || "",
      gender: data.gender,
      bloodType: data.bloodType,
      allergies: data.allergies || [],
    };
  } catch (error) {
    console.error("Eroare la căutarea pacientului:", error);
    return null;
  }
};

export const uploadConsultationImages = async (
  files: File[],
  patientId: string
): Promise<string[]> => {
  const uploadPromises = files.map(async (file) => {
    const storageRef = ref(
      storage,
      `consultations/${patientId}/${Date.now()}_${file.name}`
    );
    await uploadBytes(storageRef, file);
    return getDownloadURL(storageRef);
  });

  return Promise.all(uploadPromises);
};

export const uploadMedicalImages = async (
  files: File[],
  patientId: string
): Promise<string[]> => {
  const uploadPromises = files.map(async (file) => {
    const storageRef = ref(
      storage,
      `medical-images/${patientId}/${Date.now()}_${file.name}`
    );
    await uploadBytes(storageRef, file);
    return getDownloadURL(storageRef);
  });

  return Promise.all(uploadPromises);
};

export const saveConsultation = async (data: any): Promise<boolean> => {
  try {
    const today = Timestamp.now();

    const consultationRef = await addDoc(collection(db, "consultations"), {
      patientId: data.patientId,
      doctorId: data.doctorId,
      doctorName: data.doctorName,
      date: today,
      diagnosis: data.diagnosis,
      notes: data.notes,
      imageUrls: data.imageUrls,
    });

    const medicationPromises = data.medications.map((med: any) =>
      addDoc(collection(db, "medications"), {
        patientId: data.patientId,
        consultationId: consultationRef.id,
        name: med.name,
        dose: med.dose,
        frequency: med.frequency,
        duration: med.duration,
        prescribedDate: today,
        status: "active",
      })
    );

    await Promise.all(medicationPromises);

    if (data.vaccination && data.vaccination.name) {
      await addDoc(collection(db, "vaccinations"), {
        patientId: data.patientId,
        consultationId: consultationRef.id,
        name: data.vaccination.name,
        date: today,
        status: data.vaccination.status,
      });
    }

    if (data.medicalImages && data.medicalImages.length > 0) {
      const imagePromises = data.medicalImages.map((img: any) =>
        addDoc(collection(db, "medicalImages"), {
          patientId: data.patientId,
          consultationId: consultationRef.id,
          type: img.type,
          notes: img.notes,
          date: today,
          imageUrl: img.imageUrl,
        })
      );

      await Promise.all(imagePromises);
    }

    return true;
  } catch (error) {
    console.error("Eroare la salvarea consultației:", error);
    return false;
  }
};

export const getMedicationTemplates = async (): Promise<any[]> => {
  try {
    const snapshot = await getDocs(collection(db, "medicationTemplates"));
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("Error fetching medication templates:", error);
    return [];
  }
};

export const getVaccinationTemplates = async (): Promise<any[]> => {
  try {
    const snapshot = await getDocs(collection(db, "vaccinationTemplates"));
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("Error fetching vaccination templates:", error);
    return [];
  }
};

export const getDoctorPatientMedications = async (
  patientId: string,
  consultationId?: string
): Promise<any[]> => {
  try {
    const conditions = [where("patientId", "==", patientId)];
    if (consultationId) {
      conditions.push(where("consultationId", "==", consultationId));
    }
    const q = query(collection(db, "medications"), ...conditions);
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("Eroare la preluarea datelo:", error);
    return [];
  }
};
export const getAllPatients = async (): Promise<Patient[]> => {
  try {
    const patientsQuery = query(collection(db, "patients"));
    const patientsSnapshot = await getDocs(patientsQuery);

    const allPatients: Patient[] = patientsSnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        email: data.email,
        cnp: data.cnp,
        fullName: data.fullName,
        dateOfBirth: data.dateOfBirth?.toDate().toLocaleDateString() || "",
        gender: data.gender,
        bloodType: data.bloodType,
        allergies: data.allergies || [],
      };
    });

    return allPatients;
  } catch (error) {
    console.error("Error fetching all patients:", error);
    return [];
  }
};

export const getConsultationMedicalImages = async (
  patientId: string,
  consultationId: string
): Promise<MedicalImage[]> => {
  try {
    const q = query(
      collection(db, "medicalImages"),
      where("patientId", "==", patientId),
      where("consultationId", "==", consultationId)
    );
    const snapshot = await getDocs(q);

    const images: MedicalImage[] = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        patientId: data.patientId,
        consultationId: data.consultationId,
        type: data.type,
        notes: data.notes,
        date: data.date?.toDate().toLocaleString() || "",
        imageUrl: data.imageUrl,
      };
    });

    return images;
  } catch (error) {
    console.error("Error fetching medical images:", error);
    return [];
  }
};
export const getDoctor = async (doctorId: string): Promise<Doctor | null> => {
  try {
    const doctorRef = doc(db, "doctors", doctorId);
    const doctorDoc = await getDoc(doctorRef);
    if (!doctorDoc.exists()) return null;

    const data = doctorDoc.data();
    return {
      id: doctorDoc.id,
      email: data.email,
      fullName: data.fullName,
    };
  } catch (error) {
    console.error("Error fetching doctor:", error);
    return null;
  }
};
export const getPatientConsultationsByCNP = async (
  cnp: string
): Promise<Consultation[]> => {
  try {
    const patientsQuery = query(
      collection(db, "patients"),
      where("cnp", "==", cnp)
    );
    const patientsSnapshot = await getDocs(patientsQuery);
    if (patientsSnapshot.empty) return [];

    const patientId = patientsSnapshot.docs[0].id;

    const consultationsQuery = query(
      collection(db, "consultations"),
      where("patientId", "==", patientId),
      orderBy("date", "desc")
    );
    const consultationsSnapshot = await getDocs(consultationsQuery);

    return consultationsSnapshot.docs.map((doc) => {
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
    console.error("Error:", error);
    return [];
  }
};
