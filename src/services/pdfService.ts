import { jsPDF } from "jspdf";
import { Patient } from "@/models/patient";
import { Medication } from "@/models/medication";
import { Vaccination } from "@/models/vaccination";
import { Consultation } from "@/models/consultation";
import { LabResult } from "@/models/labResult";
import { MedicalImage } from "@/models/medicalImage";

export const exportPatientMedicalRecord = (
  patient: Patient,
  medications: Medication[],
  vaccinations: Vaccination[],
  consultations: Consultation[],
  labResults: LabResult[],
  medicalImages: MedicalImage[]
) => {
  const doc = new jsPDF();
  let yPosition = 20;

  doc.setFontSize(20);
  doc.setTextColor(40, 40, 40);
  doc.text("Dosar Medical", 105, yPosition, { align: "center" });
  yPosition += 15;

  doc.setFontSize(14);
  doc.setTextColor(0, 100, 200);
  doc.text("Informatii personale", 20, yPosition);
  yPosition += 8;

  doc.setFontSize(10);
  doc.setTextColor(60, 60, 60);
  doc.text(`Nume complet: ${patient.fullName}`, 20, yPosition);
  yPosition += 6;
  doc.text(`CNP: ${patient.cnp}`, 20, yPosition);
  yPosition += 6;
  doc.text(`Data nasterii: ${patient.dateOfBirth}`, 20, yPosition);
  yPosition += 6;
  doc.text(`Gen: ${patient.gender}`, 20, yPosition);
  yPosition += 6;
  doc.text(`Grupa sanguina: ${patient.bloodType}`, 20, yPosition);
  yPosition += 10;

  doc.setFontSize(14);
  doc.setTextColor(200, 0, 0);
  doc.text("Allergii si informatii critice", 20, yPosition);
  yPosition += 8;

  doc.setFontSize(10);
  doc.setTextColor(60, 60, 60);
  if (patient.allergies.length > 0) {
    doc.text(patient.allergies.join(", "), 20, yPosition);
  } else {
    doc.text("Fara alergii cunoscute", 20, yPosition);
  }
  yPosition += 10;

  if (medications.length > 0) {
    doc.setFontSize(14);
    doc.setTextColor(0, 100, 200);
    doc.text("Medicamente curente", 20, yPosition);
    yPosition += 8;

    doc.setFontSize(10);
    doc.setTextColor(60, 60, 60);
    medications.forEach((med) => {
      if (yPosition > 270) {
        doc.addPage();
        yPosition = 20;
      }
      doc.text(
        `• ${med.name} - ${med.dose} - ${med.frequency} - ${med.duration} zile`,
        20,
        yPosition
      );
      yPosition += 6;
    });
    yPosition += 5;
  }

  if (vaccinations.length > 0) {
    if (yPosition > 250) {
      doc.addPage();
      yPosition = 20;
    }

    doc.setFontSize(14);
    doc.setTextColor(0, 100, 200);
    doc.text("Istoric vaccinari", 20, yPosition);
    yPosition += 8;

    doc.setFontSize(10);
    doc.setTextColor(60, 60, 60);
    vaccinations.forEach((vac) => {
      if (yPosition > 270) {
        doc.addPage();
        yPosition = 20;
      }
      doc.text(`• ${vac.name} - ${vac.date} - ${vac.status}`, 20, yPosition);
      yPosition += 6;
    });
    yPosition += 5;
  }

  if (consultations.length > 0) {
    if (yPosition > 250) {
      doc.addPage();
      yPosition = 20;
    }

    doc.setFontSize(14);
    doc.setTextColor(0, 100, 200);
    doc.text("Istoric medical si diagnostice", 20, yPosition);
    yPosition += 8;

    doc.setFontSize(10);
    doc.setTextColor(60, 60, 60);
    consultations.forEach((consult) => {
      if (yPosition > 260) {
        doc.addPage();
        yPosition = 20;
      }
      doc.text(
        `• ${consult.diagnosis} - ${consult.doctorName} - ${consult.date}`,
        20,
        yPosition
      );
      yPosition += 6;
      const splitNotes = doc.splitTextToSize(`  Note: ${consult.notes}`, 170);
      doc.text(splitNotes, 20, yPosition);
      yPosition += splitNotes.length * 5 + 3;
    });
    yPosition += 5;
  }

  if (labResults.length > 0) {
    if (yPosition > 250) {
      doc.addPage();
      yPosition = 20;
    }

    doc.setFontSize(14);
    doc.setTextColor(0, 100, 200);
    doc.text("Rezultate recente de laborator", 20, yPosition);
    yPosition += 8;

    doc.setFontSize(10);
    doc.setTextColor(60, 60, 60);
    labResults.forEach((lab) => {
      if (yPosition > 270) {
        doc.addPage();
        yPosition = 20;
      }
      doc.text(
        `• ${lab.name}: ${lab.value} - ${lab.status} - ${lab.date}`,
        20,
        yPosition
      );
      yPosition += 6;
    });
    yPosition += 5;
  }

  if (medicalImages.length > 0) {
    if (yPosition > 250) {
      doc.addPage();
      yPosition = 20;
    }

    doc.setFontSize(14);
    doc.setTextColor(0, 100, 200);
    doc.text("Imagini medicale", 20, yPosition);
    yPosition += 8;

    doc.setFontSize(10);
    doc.setTextColor(60, 60, 60);
    medicalImages.forEach((img) => {
      if (yPosition > 270) {
        doc.addPage();
        yPosition = 20;
      }
      doc.text(`• ${img.type} - ${img.date}`, 20, yPosition);
      yPosition += 6;
      doc.text(`  ${img.notes}`, 20, yPosition);
      yPosition += 6;
    });
  }

  doc.save(
    `Medical_Record_${patient.fullName.replace(/\s+/g, "_")}_${
      new Date().toISOString().split("T")[0]
    }.pdf`
  );
};
