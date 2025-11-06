import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  ArrowLeft,
  FileText,
  Upload,
  Save,
  Calendar,
  Plus,
  X,
  Syringe,
  Pill,
} from "lucide-react";
import { Consultation } from "@/models/consultation";
import { auth } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import {
  saveConsultation,
  uploadConsultationImages,
  uploadMedicalImages,
  getMedicationTemplates,
  getVaccinationTemplates,
  getDoctorPatientMedications,
  getConsultationMedicalImages,
  getPatientConsultationsByCNP,
} from "@/services/doctorService";
import { DcmViewer } from "@/components/DcmViewer";

const PatientProfile = ({ patient, onBack }: any) => {
  const [consultationNotes, setConsultationNotes] = useState("");
  const [newDiagnosis, setNewDiagnosis] = useState("");
  const [medications, setMedications] = useState([
    { name: "", dose: "", frequency: "", duration: "" },
  ]);
  const [vaccinations, setVaccinations] = useState([{ name: "", status: "" }]);
  const [consultationImages, setConsultationImages] = useState<File[]>([]);
  const [consultationImageInputRef, setConsultationImageInputRef] =
    useState<HTMLInputElement | null>(null);
  const [medicalImages, setMedicalImages] = useState<
    { file: File; type: string; notes: string }[]
  >([]);
  const [medicalImageInputRef, setMedicalImageInputRef] =
    useState<HTMLInputElement | null>(null);
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [selectedConsultation, setSelectedConsultation] =
    useState<Consultation | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [medicationTemplates, setMedicationTemplates] = useState<any[]>([]);
  const [vaccinationTemplates, setVaccinationTemplates] = useState<any[]>([]);
  const [loadingConsultationDialog, setLoadingConsultationDialog] =
    useState(false);
  const [consultationMedications, setConsultationMedications] = useState<any[]>(
    []
  );
  const [consultationMedicalImages, setConsultationMedicalImages] = useState<
    any[]
  >([]);

  const { toast } = useToast();

  useEffect(() => {
    const fetchConsultations = async () => {
      const consultationsData = await getPatientConsultationsByCNP(patient.cnp);
      setConsultations(consultationsData);
    };
    fetchConsultations();
  }, [patient.cnp]);

  useEffect(() => {
    const fetchTemplates = async () => {
      const [medTemplates, vacTemplates] = await Promise.all([
        getMedicationTemplates(),
        getVaccinationTemplates(),
      ]);
      console.log("Medication templates:", medTemplates);
      console.log("Vaccination templates:", vacTemplates);
      setMedicationTemplates(medTemplates);
      setVaccinationTemplates(vacTemplates);
    };
    fetchTemplates();
  }, []);
  const addMedication = () =>
    setMedications([
      ...medications,
      { name: "", dose: "", frequency: "", duration: "" },
    ]);
  const removeMedication = (index: number) => {
    if (medications.length > 1)
      setMedications(medications.filter((_, i) => i !== index));
  };
  const updateMedication = (index: number, field: string, value: string) => {
    const updated = [...medications];
    updated[index] = { ...updated[index], [field]: value };
    setMedications(updated);
  };
  const quickFillMedication = (
    index: number,
    name: string,
    dose: string,
    frequency: string,
    duration: string
  ) => {
    const updated = [...medications];
    updated[index] = { name, dose, frequency, duration };
    setMedications(updated);
  };

  const addVaccination = () =>
    setVaccinations([...vaccinations, { name: "", status: "" }]);
  const removeVaccination = (index: number) => {
    if (vaccinations.length > 1)
      setVaccinations(vaccinations.filter((_, i) => i !== index));
  };
  const updateVaccination = (index: number, field: string, value: string) => {
    const updated = [...vaccinations];
    updated[index] = { ...updated[index], [field]: value };
    setVaccinations(updated);
  };
  const quickFillVaccination = (
    index: number,
    name: string,
    status: string
  ) => {
    const updated = [...vaccinations];
    updated[index] = { name, status };
    setVaccinations(updated);
  };

  const updateMedicalImageMetadata = (
    index: number,
    field: "type" | "notes",
    value: string
  ) => {
    const updated = [...medicalImages];
    updated[index] = { ...updated[index], [field]: value };
    setMedicalImages(updated);
  };

  const removeMedicalImage = (index: number) => {
    setMedicalImages(medicalImages.filter((_, i) => i !== index));
  };

  const handleMedicalImagesChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      const invalidFiles = filesArray.filter(
        (file) => !file.name.toLowerCase().endsWith(".dcm")
      );

      if (invalidFiles.length > 0) {
        toast({
          variant: "destructive",
          title: "Eroare",
          description: "Doar fișiere .dcm sunt acceptate",
        });
        e.target.value = "";
        return;
      }

      const newMedicalImages = filesArray.map((file) => ({
        file,
        type: "",
        notes: "",
      }));
      setMedicalImages([...medicalImages, ...newMedicalImages]);
    }
  };
  const handleConsultationImagesChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      // CH: Block non-image files
      const invalidFiles = filesArray.filter(
        (file) => !file.type.startsWith("image/")
      );

      if (invalidFiles.length > 0) {
        toast({
          variant: "destructive",
          title: "Eroare",
          description: "Doar fișiere imagine sunt acceptate",
        });
        e.target.value = ""; // CH: Clear the input
        return; // CH: Stop processing
      }

      setConsultationImages(Array.from(e.target.files));
    }
  };
  const triggerMedicalImageUpload = () => medicalImageInputRef?.click();
  const triggerConsultationImageUpload = () =>
    consultationImageInputRef?.click();

  const handleSaveConsultation = async () => {
    if (!newDiagnosis.trim() || !consultationNotes.trim()) {
      toast({
        variant: "destructive",
        title: "Eroare",
        description:
          "Te rugăm să introduci diagnosticul și notițele consultației",
      });
      return;
    }
    const validMedications = medications.filter(
      (m) =>
        m.name.trim() &&
        m.dose.trim() &&
        m.frequency.trim() &&
        m.duration.trim()
    );

    if (medicalImages.length > 0) {
      const invalidImages = medicalImages.filter(
        (img) => !img.type.trim() || !img.notes.trim()
      );
      if (invalidImages.length > 0) {
        toast({
          variant: "destructive",
          title: "Eroare",
          description:
            "Te rugăm să completezi tipul și notițele pentru toate imaginile medicale",
        });
        return;
      }
    }
    setLoading(true);
    try {
      const doctor = auth.currentUser;
      if (!doctor) {
        toast({
          variant: "destructive",
          title: "Eroare",
          description: "Niciun medic autentificat",
        });
        setLoading(false);
        return;
      }
      const patientsQuery = query(
        collection(db, "patients"),
        where("cnp", "==", patient.cnp)
      );
      const patientsSnapshot = await getDocs(patientsQuery);
      if (patientsSnapshot.empty) {
        toast({
          variant: "destructive",
          title: "Eroare",
          description: "Pacientul nu a fost găsit în baza de date",
        });
        setLoading(false);
        return;
      }
      const patientId = patientsSnapshot.docs[0].id;
      let medicalImageUrls: string[] = [];
      if (medicalImages.length > 0) {
        const files = medicalImages.map((img) => img.file);
        medicalImageUrls = await uploadMedicalImages(files, patientId);
      }
      let consultationImageUrls: string[] = [];
      if (consultationImages.length > 0)
        consultationImageUrls = await uploadConsultationImages(
          consultationImages,
          patientId
        );
      const validVaccinations = vaccinations.filter((v) => v.name.trim());
      const consultationData = {
        patientId,
        doctorId: doctor.uid,
        doctorName: doctor.displayName || doctor.email?.split("@")[0],
        diagnosis: newDiagnosis,
        notes: consultationNotes,
        imageUrls: consultationImageUrls,
        medications: validMedications.map((m) => ({
          name: m.name,
          dose: m.dose,
          frequency: m.frequency,
          duration: parseInt(m.duration),
        })),
        vaccination:
          validVaccinations.length > 0 ? validVaccinations[0] : undefined,
        medicalImages:
          medicalImageUrls.length > 0
            ? medicalImageUrls.map((url, index) => ({
                type: medicalImages[index].type,
                notes: medicalImages[index].notes,
                imageUrl: url,
              }))
            : undefined,
      };
      const success = await saveConsultation(consultationData);
      if (success) {
        toast({
          title: "Succes",
          description: "Consultația a fost salvată cu succes",
        });
        setConsultationNotes("");
        setNewDiagnosis("");
        setMedications([{ name: "", dose: "", frequency: "", duration: "" }]);
        setVaccinations([{ name: "", status: "" }]);
        setConsultationImages([]);
        setMedicalImages([]);
        if (medicalImageInputRef) medicalImageInputRef.value = "";
        if (consultationImageInputRef) consultationImageInputRef.value = "";
        const consultationsQuery = query(
          collection(db, "consultations"),
          where("patientId", "==", patientId)
        );
        const consultationsSnapshot = await getDocs(consultationsQuery);
        const consultationsData: Consultation[] =
          consultationsSnapshot.docs.map((doc) => {
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
        setConsultations(consultationsData);
      } else {
        toast({
          variant: "destructive",
          title: "Eroare",
          description: "Salvarea consultației a eșuat",
        });
      }
    } catch (error) {
      console.error("Eroare:", error);
      toast({
        variant: "destructive",
        title: "Eroare",
        description: "A apărut o eroare în timpul salvării",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <Button variant="ghost" onClick={onBack} className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Înapoi
        </Button>
        <div className="p-6 rounded-medical border">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-bold text-primary mb-2">
                {patient.name}
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">CNP</p>
                  <p className="font-medium">{patient.cnp}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Vârstă</p>
                  <p className="font-medium">{patient.age} ani</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Gen</p>
                  <p className="font-medium">{patient.gender}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Ultima vizită</p>
                  <p className="font-medium">{patient.lastVisit}</p>
                </div>
              </div>
            </div>
          </div>
          {patient.conditions.length > 0 && (
            <div className="mt-4">
              <p className="text-sm text-muted-foreground mb-2">Alergii</p>
              <div className="flex flex-wrap gap-2">
                {patient.conditions.map((condition: string, index: number) => (
                  <Badge key={index} variant="destructive">
                    {condition}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <Tabs defaultValue="consultation" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="consultation">
            Consultație nouă și rețetă
          </TabsTrigger>
          <TabsTrigger value="history">Consultații recente</TabsTrigger>
        </TabsList>

        <TabsContent value="consultation" className="space-y-4">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Consultație nouă și rețetă
              </CardTitle>
              <CardDescription>
                Adaugă notițe de consultație, diagnostic și prescrie medicamente
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="notes">Notițe de consultație</Label>
                <Textarea
                  id="notes"
                  placeholder="Introdu detalii despre consultație, simptome, constatări ale examinării..."
                  value={consultationNotes}
                  onChange={(e) => setConsultationNotes(e.target.value)}
                  className="min-h-[120px] mt-2"
                  disabled={loading}
                />
              </div>
              <div>
                <Label htmlFor="diagnosis">Diagnostic nou</Label>
                <Input
                  id="diagnosis"
                  placeholder="Introdu diagnosticul (ex: bronșită acută)"
                  value={newDiagnosis}
                  onChange={(e) => setNewDiagnosis(e.target.value)}
                  className="mt-2"
                  disabled={loading}
                />
              </div>

              <Separator />

              <div>
                <Label htmlFor="xray-upload">
                  Încarcă radiografii și imagini medicale
                </Label>
                <div className="mt-2 flex items-center gap-2">
                  <Input
                    id="xray-upload"
                    type="file"
                    accept=".dcm,application/dicom"
                    multiple
                    className="flex-1"
                    onChange={handleMedicalImagesChange}
                    disabled={loading}
                    ref={(ref) => setMedicalImageInputRef(ref)}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={triggerMedicalImageUpload}
                    disabled={loading}
                  >
                    <Upload className="h-4 w-4" />
                  </Button>
                </div>
                {medicalImages.length > 0 && (
                  <div className="mt-3 space-y-3">
                    <p className="text-sm font-medium">
                      {medicalImages.length} imagine(i) medicale selectate
                    </p>
                    {medicalImages.map((img, index) => (
                      <div
                        key={index}
                        className="p-3 border rounded-medical space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <p className="font-medium text-sm">{img.file.name}</p>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeMedicalImage(index)}
                            disabled={loading}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div>
                            <Label>Tip imagine</Label>
                            <Input
                              placeholder="ex: X-ray, CT, MRI, Ecografie"
                              value={img.type}
                              onChange={(e) =>
                                updateMedicalImageMetadata(
                                  index,
                                  "type",
                                  e.target.value
                                )
                              }
                              disabled={loading}
                            />
                          </div>
                          <div>
                            <Label>Notițe</Label>
                            <Input
                              placeholder="ex: Torace AP, Genunchi stâng"
                              value={img.notes}
                              onChange={(e) =>
                                updateMedicalImageMetadata(
                                  index,
                                  "notes",
                                  e.target.value
                                )
                              }
                              disabled={loading}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <Separator />

              <div>
                <div className="flex items-center justify-between mb-3">
                  <Label className="text-base font-semibold">
                    Detalii rețetă
                  </Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addMedication}
                    disabled={loading}
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Adaugă medicament
                  </Button>
                </div>
                {medications.map((med, index) => (
                  <div key={index} className="mb-4">
                    <div className="p-4 border rounded-medical space-y-3">
                      <div className="flex items-center justify-between">
                        <p className="font-medium text-sm">
                          Medicamentul {index + 1}
                        </p>
                        {medications.length > 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeMedication(index)}
                            disabled={loading}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <Label>Nume medicament</Label>
                          <Input
                            placeholder="ex: Amoxicilină"
                            value={med.name}
                            onChange={(e) =>
                              updateMedication(index, "name", e.target.value)
                            }
                            disabled={loading}
                          />
                        </div>
                        <div>
                          <Label>Doza</Label>
                          <Input
                            placeholder="ex: 500mg"
                            value={med.dose}
                            onChange={(e) =>
                              updateMedication(index, "dose", e.target.value)
                            }
                            disabled={loading}
                          />
                        </div>
                        <div>
                          <Label>Frecvență</Label>
                          <Input
                            placeholder="ex: de 3 ori pe zi"
                            value={med.frequency}
                            onChange={(e) =>
                              updateMedication(
                                index,
                                "frequency",
                                e.target.value
                              )
                            }
                            disabled={loading}
                          />
                        </div>
                        <div>
                          <Label>"Durată (număr de zile)</Label>
                          <Input
                            type="number"
                            placeholder="ex: 7"
                            value={med.duration}
                            onChange={(e) =>
                              updateMedication(
                                index,
                                "duration",
                                e.target.value
                              )
                            }
                            disabled={loading}
                          />
                        </div>
                      </div>
                    </div>
                    {medicationTemplates.length > 0 && (
                      <div className="mt-2 p-3 bg-medical-green-light rounded-medical">
                        <h4 className="font-medium text-medical-green mb-2 text-sm flex items-center gap-1">
                          <Pill className="h-4 w-4" />
                          Rețete rapide
                        </h4>
                        <div className="grid grid-cols-1 gap-2">
                          {medicationTemplates.map((template) => (
                            <Button
                              key={template.id}
                              variant="ghost"
                              size="sm"
                              className="justify-start text-left h-auto p-2"
                              onClick={() =>
                                quickFillMedication(
                                  index,
                                  template.name,
                                  template.dose,
                                  template.frequency,
                                  template.duration.toString()
                                )
                              }
                              disabled={loading}
                            >
                              <div>
                                <p className="font-medium text-sm">
                                  {template.name} {template.dose}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {template.description}
                                </p>
                              </div>
                            </Button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <Separator />

              <div>
                <div className="flex items-center justify-between mb-3">
                  <Label className="text-base font-semibold">
                    Istoric vaccinări
                  </Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addVaccination}
                    disabled={loading}
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Adaugă vaccin
                  </Button>
                </div>
                {vaccinations.map((vac, index) => (
                  <div key={index} className="mb-4">
                    <div className="p-4 border rounded-medical space-y-3">
                      <div className="flex items-center justify-between">
                        <p className="font-medium text-sm">
                          Vaccinul {index + 1}
                        </p>
                        {vaccinations.length > 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeVaccination(index)}
                            disabled={loading}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <Label>Nume vaccin</Label>
                          <Input
                            placeholder="es:  Rapel COVID-19"
                            value={vac.name}
                            onChange={(e) =>
                              updateVaccination(index, "name", e.target.value)
                            }
                            disabled={loading}
                          />
                        </div>
                        <div>
                          <Label>Stare</Label>
                          <Input
                            placeholder="ex: Complet, Anual, Valabil până în 2030"
                            value={vac.status}
                            onChange={(e) =>
                              updateVaccination(index, "status", e.target.value)
                            }
                            disabled={loading}
                          />
                        </div>
                      </div>
                    </div>
                    {vaccinationTemplates.length > 0 && (
                      <div className="mt-2 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-medical">
                        <h4 className="font-medium text-blue-700 dark:text-blue-400 mb-2 text-sm flex items-center gap-1">
                          <Syringe className="h-4 w-4" />
                          Vaccinări rapide
                        </h4>
                        <div className="grid grid-cols-1 gap-2">
                          {vaccinationTemplates.map((template) => (
                            <Button
                              key={template.id}
                              variant="ghost"
                              size="sm"
                              className="justify-start text-left h-auto p-2"
                              onClick={() =>
                                quickFillVaccination(
                                  index,
                                  template.name,
                                  template.status
                                )
                              }
                              disabled={loading}
                            >
                              <div>
                                <p className="font-medium text-sm">
                                  {template.name}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {template.description}
                                </p>
                              </div>
                            </Button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <Separator />

              <div>
                <Label htmlFor="consult-images">
                  Încarcă imagini din consultație
                </Label>
                <div className="mt-2 flex items-center gap-2">
                  <Input
                    id="consult-images"
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleConsultationImagesChange}
                    className="flex-1"
                    disabled={loading}
                    ref={(ref) => setConsultationImageInputRef(ref)}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={triggerConsultationImageUpload}
                    disabled={loading}
                  >
                    <Upload className="h-4 w-4" />
                  </Button>
                </div>
                {consultationImages.length > 0 && (
                  <p className="text-sm text-muted-foreground mt-1">
                    {consultationImages.length} imagine(i) de consultație
                    selectate"
                  </p>
                )}
              </div>

              <Separator />

              <Button
                onClick={handleSaveConsultation}
                variant="medical"
                className="w-full"
                disabled={loading}
              >
                <Save className="h-4 w-4 mr-2" />
                {loading ? "Se salvează......" : "Salvează consultația"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                Consultații recente
              </CardTitle>
              <CardDescription>
                Istoricul consultațiilor pacientului cu toți medicii
              </CardDescription>
            </CardHeader>
            <CardContent>
              {consultations.length > 0 ? (
                <div className="space-y-4">
                  {consultations.map((consultation) => (
                    <div
                      key={consultation.id}
                      className="p-4 border border-border rounded-medical hover:bg-muted/50 transition-colors cursor-pointer"
                      onClick={async () => {
                        setLoadingConsultationDialog(true);
                        setSelectedConsultation(consultation);
                        const meds = await getDoctorPatientMedications(
                          consultation.patientId,
                          consultation.id
                        );
                        setConsultationMedications(meds);
                        const medicalImgs = await getConsultationMedicalImages(
                          consultation.patientId,
                          consultation.id
                        );
                        setConsultationMedicalImages(medicalImgs);
                        setLoadingConsultationDialog(false);
                      }}
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <p className="font-semibold text-primary">
                            {consultation.diagnosis}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Dr. {consultation.doctorName}
                          </p>
                        </div>
                        <Badge variant="outline">{consultation.date}</Badge>
                      </div>
                      <div className="space-y-2">
                        <div>
                          <p className="text-sm font-medium">Notițe:</p>
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {consultation.notes}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Nu au fost găsite înregistrări de consultații"
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog
        open={selectedConsultation !== null}
        onOpenChange={(open) => !open && setSelectedConsultation(null)}
      >
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          {loadingConsultationDialog ? (
            <div className="flex items-center justify-center p-8">
              <p className="text-muted-foreground">Se încarcă...</p>
            </div>
          ) : (
            <>
              <DialogHeader>
                <DialogTitle>{selectedConsultation?.diagnosis}</DialogTitle>
                <DialogDescription>
                  Dr. {selectedConsultation?.doctorName} •{" "}
                  {selectedConsultation?.date}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Notițe de consultație</h4>
                  <p className="text-sm text-muted-foreground">
                    {selectedConsultation?.notes}
                  </p>
                </div>
                <Separator />

                <div>
                  <h4 className="font-semibold mb-2">Prescripție</h4>
                  {consultationMedications.length > 0 ? (
                    <div className="space-y-2">
                      {consultationMedications.map((med, idx) => (
                        <div key={idx} className="p-3 bg-muted rounded-medical">
                          <p className="font-medium">{med.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {med.dose} - {med.frequency} - {med.duration} zile
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      Nicio prescripție
                    </p>
                  )}
                </div>

                <Separator />
                {selectedConsultation?.imageUrls &&
                  selectedConsultation.imageUrls.length > 0 && (
                    <>
                      <div>
                        <h4 className="font-semibold mb-2">Imagini medicale</h4>
                        <div className="grid grid-cols-2 gap-2">
                          {selectedConsultation.imageUrls.map(
                            (imageUrl, idx) => (
                              <img
                                key={idx}
                                src={imageUrl}
                                alt={`Medical image ${idx + 1}`}
                                className="w-full rounded-medical border cursor-pointer hover:opacity-90 transition-opacity"
                                onClick={() => setSelectedImage(imageUrl)}
                              />
                            )
                          )}
                        </div>
                      </div>
                      <Separator />
                    </>
                  )}

                {consultationMedicalImages.length > 0 && (
                  <>
                    <div>
                      <h4 className="font-semibold mb-2">
                        Radiografii medicale
                      </h4>
                      <div className="space-y-3">
                        {consultationMedicalImages.map((img, idx) => (
                          <div key={idx} className="p-3 border rounded-medical">
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <p className="font-medium">{img.type}</p>
                              </div>
                              <p className="text-sm text-muted-foreground">
                                {img.notes}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {img.date
                                  ? img.date.toDate
                                    ? img.date.toDate().toLocaleDateString()
                                    : new Date(img.date).toLocaleDateString()
                                  : ""}
                              </p>
                              <div
                                className="border rounded p-2"
                                style={{ backgroundColor: "#020817" }}
                              >
                                <DcmViewer
                                  imageUrl={img.imageUrl.replace(
                                    "https://firebasestorage.googleapis.com",
                                    "/storage-proxy"
                                  )}
                                  className="w-full h-48"
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <Separator />
                  </>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PatientProfile;
