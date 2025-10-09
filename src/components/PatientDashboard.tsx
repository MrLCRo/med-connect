import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Download, 
  User, 
  Heart, 
  Shield, 
  Pill, 
  FileText, 
  ImageIcon,
  AlertTriangle,
  Calendar,
  Activity
} from "lucide-react";

interface PatientData {
  name: string;
  cnp: string;
  birthDate: string;
  gender: string;
  bloodType: string;
  allergies: string[];
  vaccinations: Array<{ name: string; date: string; status: string }>;
  medications: Array<{ name: string; dosage: string; frequency: string }>;
  diagnoses: Array<{ condition: string; date: string; doctor: string }>;
  labResults: Array<{ test: string; result: string; date: string; status: "normal" | "abnormal" | "critical" }>;
  images: Array<{ type: string; date: string; description: string }>;
}

const mockPatientData: PatientData = {
  name: "Maria Popescu",
  cnp: "2950715123456",
  birthDate: "July 15, 1995",
  gender: "Female",
  bloodType: "A+",
  allergies: ["Penicillin", "Peanuts"],
  vaccinations: [
    { name: "COVID-19", date: "2024-01-15", status: "Complete" },
    { name: "Influenza", date: "2023-10-20", status: "Annual" },
    { name: "Tetanus", date: "2020-06-10", status: "Valid until 2030" }
  ],
  medications: [
    { name: "Lisinopril", dosage: "10mg", frequency: "Once daily" },
    { name: "Metformin", dosage: "500mg", frequency: "Twice daily" }
  ],
  diagnoses: [
    { condition: "Hypertension", date: "2023-03-15", doctor: "Dr. Ion Vasile" },
    { condition: "Type 2 Diabetes", date: "2022-11-20", doctor: "Dr. Ana Marinescu" }
  ],
  labResults: [
    { test: "HbA1c", result: "6.8%", date: "2024-01-10", status: "abnormal" },
    { test: "Blood Pressure", result: "135/85", date: "2024-01-10", status: "abnormal" },
    { test: "Cholesterol", result: "180 mg/dL", date: "2024-01-10", status: "normal" }
  ],
  images: [
    { type: "Chest X-Ray", date: "2024-01-05", description: "Annual checkup - Clear" },
    { type: "Ultrasound", date: "2023-12-20", description: "Abdominal scan - Normal" }
  ]
};

const PatientDashboard = () => {
  const handleExportPDF = () => {
    console.log("Exporting PDF medical record...");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "normal": return "bg-medical-green-light text-medical-green";
      case "abnormal": return "bg-yellow-100 text-yellow-800";
      case "critical": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Export */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold font-medical text-foreground">Patient Dashboard</h1>
          <p className="text-muted-foreground mt-1">Your complete medical record overview</p>
        </div>
        <Button onClick={handleExportPDF} variant="medical" className="gap-2">
          <Download className="h-4 w-4" />
          Export PDF Medical Record
        </Button>
      </div>

      {/* Demographics */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5 text-primary" />
            Personal Information
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Full Name</p>
            <p className="font-medical">{mockPatientData.name}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">CNP</p>
            <p className="font-medical">{mockPatientData.cnp}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Date of Birth</p>
            <p className="font-medical">{mockPatientData.birthDate}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Gender</p>
            <p className="font-medical">{mockPatientData.gender}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Blood Type</p>
            <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
              {mockPatientData.bloodType}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Allergies & Critical Info */}
      <Card className="shadow-card border-l-4 border-l-destructive">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-5 w-5" />
            Allergies & Critical Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {mockPatientData.allergies.map((allergy, index) => (
              <Badge key={index} variant="destructive">
                {allergy}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Current Medications */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Pill className="h-5 w-5 text-primary" />
              Current Medications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {mockPatientData.medications.map((med, index) => (
              <div key={index} className="p-3 bg-muted rounded-medical">
                <p className="font-medium">{med.name}</p>
                <p className="text-sm text-muted-foreground">{med.dosage} - {med.frequency}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Vaccinations */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              Vaccination History
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {mockPatientData.vaccinations.map((vaccine, index) => (
              <div key={index} className="flex justify-between items-center p-3 bg-muted rounded-medical">
                <div>
                  <p className="font-medium">{vaccine.name}</p>
                  <p className="text-sm text-muted-foreground">{vaccine.date}</p>
                </div>
                <Badge variant="success" className="bg-medical-green-light text-medical-green">
                  {vaccine.status}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Medical History */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-primary" />
            Medical History & Diagnoses
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {mockPatientData.diagnoses.map((diagnosis, index) => (
            <div key={index} className="p-3 border border-border rounded-medical">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium">{diagnosis.condition}</p>
                  <p className="text-sm text-muted-foreground">Diagnosed by {diagnosis.doctor}</p>
                </div>
                <span className="text-sm text-muted-foreground">{diagnosis.date}</span>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Lab Results */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              Recent Lab Results
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {mockPatientData.labResults.map((result, index) => (
              <div key={index} className="flex justify-between items-center p-3 border border-border rounded-medical">
                <div>
                  <p className="font-medium">{result.test}</p>
                  <p className="text-sm text-muted-foreground">{result.date}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">{result.result}</p>
                  <Badge className={getStatusColor(result.status)}>
                    {result.status}
                  </Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Medical Images */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ImageIcon className="h-5 w-5 text-primary" />
              Medical Images
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {mockPatientData.images.map((image, index) => (
              <div key={index} className="p-3 border border-border rounded-medical">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium">{image.type}</p>
                    <p className="text-sm text-muted-foreground">{image.description}</p>
                  </div>
                  <span className="text-sm text-muted-foreground">{image.date}</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PatientDashboard;