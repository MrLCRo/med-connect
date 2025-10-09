import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import PatientProfile from "./PatientProfile";
import { 
  Search, 
  User
} from "lucide-react";

interface Patient {
  cnp: string;
  name: string;
  age: number;
  gender: string;
  lastVisit: string;
  conditions: string[];
}

const mockPatients: Patient[] = [
  {
    cnp: "2950715123456",
    name: "Maria Popescu",
    age: 29,
    gender: "Female",
    lastVisit: "2024-01-10",
    conditions: ["Hypertension", "Type 2 Diabetes"]
  },
  {
    cnp: "1801012345678",
    name: "Ion Gheorghe",
    age: 45,
    gender: "Male", 
    lastVisit: "2024-01-08",
    conditions: ["Asthma"]
  }
];

const DoctorDashboard = () => {
  const [searchCNP, setSearchCNP] = useState("");
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [viewingProfile, setViewingProfile] = useState(false);

  const handleSearch = () => {
    const patient = mockPatients.find(p => p.cnp.includes(searchCNP));
    setSelectedPatient(patient || null);
    if (patient) {
      setViewingProfile(true);
    }
  };

  const handleSelectPatient = (patient: Patient) => {
    setSelectedPatient(patient);
    setViewingProfile(true);
  };

  const handleBackToSearch = () => {
    setViewingProfile(false);
  };

  if (viewingProfile && selectedPatient) {
    return <PatientProfile patient={selectedPatient} onBack={handleBackToSearch} />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold font-medical text-foreground">Doctor Dashboard</h1>
        <p className="text-muted-foreground mt-1">Manage patient consultations and medical records</p>
      </div>

      {/* Patient Search */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5 text-primary" />
            Patient Search
          </CardTitle>
          <CardDescription>
            Search for patients using their CNP (Personal Numeric Code)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3">
            <div className="flex-1">
              <Input
                placeholder="Enter patient CNP (e.g., 2950715123456)"
                value={searchCNP}
                onChange={(e) => setSearchCNP(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className="font-medical"
              />
            </div>
            <Button onClick={handleSearch} variant="medical">
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Patients */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5 text-primary" />
            Recent Patients
          </CardTitle>
          <CardDescription>
            Quickly access recently consulted patients
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {mockPatients.map((patient, index) => (
              <div 
                key={index} 
                className="p-3 border border-border rounded-medical hover:bg-muted/50 cursor-pointer transition-colors"
                onClick={() => handleSelectPatient(patient)}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium">{patient.name}</p>
                    <p className="text-sm text-muted-foreground">CNP: {patient.cnp}</p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {patient.conditions.map((condition, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {condition}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Last Visit</p>
                    <p className="text-sm font-medium">{patient.lastVisit}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DoctorDashboard;