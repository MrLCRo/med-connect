import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ArrowLeft, FileText, Upload, Pill, ClipboardList, Save, Calendar, User, Syringe } from "lucide-react";
interface Patient {
  cnp: string;
  name: string;
  age: number;
  gender: string;
  lastVisit: string;
  conditions: string[];
}
interface PatientProfileProps {
  patient: Patient;
  onBack: () => void;
}
const mockConsultations = [{
  date: "2024-01-10",
  doctor: "Dr. Ionescu Mihai",
  diagnosis: "Acute bronchitis",
  notes: "Patient presented with persistent cough and mild fever. Prescribed antibiotics and rest.",
  prescription: "Amoxicillin 500mg - 3 times daily - 7 days",
  xrayUrl: "https://images.unsplash.com/photo-1516549655169-df83a0774514?w=400"
}, {
  date: "2023-12-15",
  doctor: "Dr. Popescu Ana",
  diagnosis: "Annual checkup",
  notes: "Routine examination. All vitals normal. Blood pressure slightly elevated, recommended lifestyle changes.",
  prescription: "None",
  xrayUrl: null
}];
const PatientProfile = ({
  patient,
  onBack
}: PatientProfileProps) => {
  const [consultationNotes, setConsultationNotes] = useState("");
  const [newPrescription, setNewPrescription] = useState("");
  const [newDiagnosis, setNewDiagnosis] = useState("");
  const [newVaccination, setNewVaccination] = useState("");
  const [selectedConsultation, setSelectedConsultation] = useState<typeof mockConsultations[0] | null>(null);
  const handleSaveConsultation = () => {
    console.log("Saving consultation:", {
      patient: patient.cnp,
      notes: consultationNotes,
      prescription: newPrescription,
      diagnosis: newDiagnosis
    });
  };
  const handleUploadImage = () => {
    console.log("Upload medical image");
  };
  return <div className="space-y-6">
      {/* Header */}
      <div>
        <Button variant="ghost" onClick={onBack} className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Search
        </Button>
        
        <div className="p-6 bg-medical-blue-light rounded-medical border">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-bold text-primary mb-2">{patient.name}</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">CNP</p>
                  <p className="font-medium">{patient.cnp}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Age</p>
                  <p className="font-medium">{patient.age} years</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Gender</p>
                  <p className="font-medium">{patient.gender}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Last Visit</p>
                  <p className="font-medium">{patient.lastVisit}</p>
                </div>
              </div>
            </div>
          </div>
          
          {patient.conditions.length > 0 && <div className="mt-4">
              <p className="text-sm text-muted-foreground mb-2">Current Conditions</p>
              <div className="flex flex-wrap gap-2">
                {patient.conditions.map((condition, index) => <Badge key={index} variant="outline" className="bg-[#b31706]">
                    {condition}
                  </Badge>)}
              </div>
            </div>}
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="consultation" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="consultation">New Consultation & Prescription</TabsTrigger>
          <TabsTrigger value="history">Recent Consultations</TabsTrigger>
        </TabsList>

        <TabsContent value="consultation" className="space-y-4">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                New Consultation & Prescription
              </CardTitle>
              <CardDescription>
                Add consultation notes, diagnosis, and prescribe medications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="notes">Consultation Notes</Label>
                <Textarea id="notes" placeholder="Enter detailed consultation notes, symptoms, examination findings..." value={consultationNotes} onChange={e => setConsultationNotes(e.target.value)} className="min-h-[120px] mt-2" />
              </div>

              <div>
                <Label htmlFor="diagnosis">New Diagnosis</Label>
                <Input id="diagnosis" placeholder="Enter diagnosis (e.g., Acute bronchitis)" value={newDiagnosis} onChange={e => setNewDiagnosis(e.target.value)} className="mt-2" />
              </div>

              <Separator />

              <div>
                <Label htmlFor="xray-upload">Upload X-rays & Medical Images</Label>
                <div className="mt-2 flex items-center gap-2">
                  <Input id="xray-upload" type="file" accept="image/*" multiple className="flex-1" />
                  <Button type="button" variant="outline" size="sm">
                    <Upload className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <Separator />

              <div>
                <Label htmlFor="prescription">Prescription Details</Label>
                <Textarea id="prescription" placeholder="Enter medication name, dosage, frequency, and duration&#10;Example:&#10;Amoxicillin 500mg - 3 times daily - 7 days&#10;Ibuprofen 400mg - as needed for pain" value={newPrescription} onChange={e => setNewPrescription(e.target.value)} className="min-h-[120px] mt-2" />
              </div>

              <div className="space-y-3">
                <div className="p-3 bg-medical-green-light rounded-medical">
                  <h4 className="font-medium text-medical-green mb-2">Quick Prescriptions</h4>
                  <div className="grid grid-cols-1 gap-2">
                    <Button variant="ghost" size="sm" className="justify-start text-left h-auto p-2" onClick={() => setNewPrescription("Paracetamol 500mg - 3 times daily - 5 days")}>
                      <div>
                        <p className="font-medium">Paracetamol 500mg</p>
                        <p className="text-xs text-muted-foreground">For fever and pain relief</p>
                      </div>
                    </Button>
                    <Button variant="ghost" size="sm" className="justify-start text-left h-auto p-2" onClick={() => setNewPrescription("Amoxicillin 500mg - 3 times daily - 7 days")}>
                      <div>
                        <p className="font-medium">Amoxicillin 500mg</p>
                        <p className="text-xs text-muted-foreground">Antibiotic treatment</p>
                      </div>
                    </Button>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <Label htmlFor="vaccination">Vaccination Record</Label>
                <Textarea id="vaccination" placeholder="Enter vaccination details (vaccine name, date, next dose)&#10;Example:&#10;COVID-19 Booster - Administered: 2024-01-10 - Next dose: N/A&#10;Tetanus - Administered: 2024-01-10 - Next dose: 2034-01-10" value={newVaccination} onChange={e => setNewVaccination(e.target.value)} className="min-h-[100px] mt-2" />
              </div>

              <div className="space-y-3">
                <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded-medical">
                  <h4 className="font-medium text-blue-700 dark:text-blue-400 mb-2 flex items-center gap-2">
                    <Syringe className="h-4 w-4" />
                    Quick Vaccinations
                  </h4>
                  <div className="grid grid-cols-1 gap-2">
                    <Button variant="ghost" size="sm" className="justify-start text-left h-auto p-2" onClick={() => setNewVaccination(`COVID-19 Vaccine - Administered: ${new Date().toISOString().split('T')[0]} - Booster recommended in 6 months`)}>
                      <div>
                        <p className="font-medium">COVID-19 Vaccine</p>
                        <p className="text-xs text-muted-foreground">Annual booster recommended</p>
                      </div>
                    </Button>
                    <Button variant="ghost" size="sm" className="justify-start text-left h-auto p-2" onClick={() => setNewVaccination(`Influenza Vaccine - Administered: ${new Date().toISOString().split('T')[0]} - Next dose: Annual`)}>
                      <div>
                        <p className="font-medium">Influenza Vaccine</p>
                        <p className="text-xs text-muted-foreground">Annual flu shot</p>
                      </div>
                    </Button>
                    <Button variant="ghost" size="sm" className="justify-start text-left h-auto p-2" onClick={() => setNewVaccination(`Tetanus - Administered: ${new Date().toISOString().split('T')[0]} - Next dose: 10 years`)}>
                      <div>
                        <p className="font-medium">Tetanus</p>
                        <p className="text-xs text-muted-foreground">Valid for 10 years</p>
                      </div>
                    </Button>
                    <Button variant="ghost" size="sm" className="justify-start text-left h-auto p-2" onClick={() => setNewVaccination(`Hepatitis B - Administered: ${new Date().toISOString().split('T')[0]} - Series: 3 doses`)}>
                      <div>
                        <p className="font-medium">Hepatitis B</p>
                        <p className="text-xs text-muted-foreground">3-dose series</p>
                      </div>
                    </Button>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="flex gap-2">
                <Button onClick={handleUploadImage} variant="outline" className="flex-1">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Images
                </Button>
                <Button onClick={handleSaveConsultation} variant="medical" className="flex-1">
                  <Save className="h-4 w-4 mr-2" />
                  Save Consultation
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                Recent Consultations
              </CardTitle>
              <CardDescription>
                Patient consultation history
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockConsultations.map((consultation, index) => <div key={index} className="p-4 border border-border rounded-medical hover:bg-muted/50 transition-colors cursor-pointer" onClick={() => setSelectedConsultation(consultation)}>
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <p className="font-semibold text-primary">{consultation.diagnosis}</p>
                        <p className="text-sm text-muted-foreground">{consultation.doctor}</p>
                      </div>
                      <Badge variant="outline">{consultation.date}</Badge>
                    </div>
                    
                    <div className="space-y-2">
                      <div>
                        <p className="text-sm font-medium">Notes:</p>
                        <p className="text-sm text-muted-foreground line-clamp-2">{consultation.notes}</p>
                      </div>
                      
                      <div>
                        <p className="text-sm font-medium">Prescription:</p>
                        <p className="text-sm text-muted-foreground">{consultation.prescription}</p>
                      </div>
                    </div>
                  </div>)}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Consultation Details Dialog */}
      <Dialog open={selectedConsultation !== null} onOpenChange={open => !open && setSelectedConsultation(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedConsultation?.diagnosis}</DialogTitle>
            <DialogDescription>
              {selectedConsultation?.doctor} • {selectedConsultation?.date}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Consultation Notes</h4>
              <p className="text-sm text-muted-foreground">{selectedConsultation?.notes}</p>
            </div>

            <Separator />

            <div>
              <h4 className="font-semibold mb-2">Prescription</h4>
              <p className="text-sm text-muted-foreground">{selectedConsultation?.prescription}</p>
            </div>

            {selectedConsultation?.xrayUrl && <>
                <Separator />
                <div>
                  <h4 className="font-semibold mb-2">Medical Images</h4>
                  <img src={selectedConsultation.xrayUrl} alt="Medical X-ray" className="w-full rounded-medical border" />
                </div>
              </>}
          </div>
        </DialogContent>
      </Dialog>
    </div>;
};
export default PatientProfile;