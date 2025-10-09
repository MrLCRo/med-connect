import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  Heart, 
  LayoutDashboard, 
  FileText, 
  Settings, 
  LogOut,
  Menu,
  X,
  User,
  Calendar
} from "lucide-react";
import PatientDashboard from "./PatientDashboard";
import DoctorDashboard from "./DoctorDashboard";
import PatientProfile from "./PatientProfile";
import SettingsPanel from "./SettingsPanel";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";

type UserType = "patient" | "doctor";
type ActiveSection = "dashboard" | "history" | "settings";

interface LayoutProps {
  userType: UserType;
  onLogout: () => void;
}

const mockPatientConsultations = [
  {
    date: "2024-01-10",
    doctor: "Dr. Ionescu Mihai",
    diagnosis: "Acute bronchitis",
    notes: "Patient presented with persistent cough and mild fever. Prescribed antibiotics and rest.",
    prescription: "Amoxicillin 500mg - 3 times daily - 7 days",
    xrayUrl: "https://images.unsplash.com/photo-1516549655169-df83a0774514?w=400"
  },
  {
    date: "2023-12-15",
    doctor: "Dr. Popescu Ana",
    diagnosis: "Annual checkup",
    notes: "Routine examination. All vitals normal. Blood pressure slightly elevated, recommended lifestyle changes.",
    prescription: "None",
    xrayUrl: null
  },
  {
    date: "2023-11-20",
    doctor: "Dr. Ionescu Mihai",
    diagnosis: "Flu vaccination",
    notes: "Annual flu shot administered. No adverse reactions observed.",
    prescription: "None",
    xrayUrl: null
  }
];

const Layout = ({ userType, onLogout }: LayoutProps) => {
  const [activeSection, setActiveSection] = useState<ActiveSection>("dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<any | null>(null);
  const [viewingPatientProfile, setViewingPatientProfile] = useState(false);
  const [selectedConsultation, setSelectedConsultation] = useState<typeof mockPatientConsultations[0] | null>(null);
  const [selectedXrayImage, setSelectedXrayImage] = useState<string | null>(null);

  const patientNavItems = [
    { id: "dashboard" as const, label: "Dashboard", icon: LayoutDashboard },
    { id: "history" as const, label: "Medical History", icon: FileText },
    { id: "settings" as const, label: "Settings", icon: Settings },
  ];

  const doctorNavItems = [
    { id: "dashboard" as const, label: "Dashboard", icon: LayoutDashboard },
    { id: "history" as const, label: "Latest Patients", icon: FileText },
    { id: "settings" as const, label: "Settings", icon: Settings },
  ];

  const navItems = userType === "patient" ? patientNavItems : doctorNavItems;

  const recentPatients = [
    {
      cnp: "2950715123456",
      name: "Maria Popescu",
      age: 29,
      gender: "Female",
      lastConsultation: "2024-01-10",
      lastVisit: "2024-01-10",
      conditions: ["Hypertension", "Type 2 Diabetes"]
    },
    {
      cnp: "1801012345678",
      name: "Ion Gheorghe",
      age: 45,
      gender: "Male", 
      lastConsultation: "2024-01-08",
      lastVisit: "2024-01-08",
      conditions: ["Asthma"]
    }
  ];

  const handleOpenPatientProfile = (patient: any) => {
    setSelectedPatient(patient);
    setViewingPatientProfile(true);
  };

  const handleBackFromProfile = () => {
    setViewingPatientProfile(false);
    setSelectedPatient(null);
  };

  const renderContent = () => {
    if (activeSection === "dashboard") {
      return userType === "patient" ? <PatientDashboard /> : <DoctorDashboard />;
    }
    
    if (activeSection === "history" && userType === "doctor") {
      if (viewingPatientProfile && selectedPatient) {
        return <PatientProfile patient={selectedPatient} onBack={handleBackFromProfile} />;
      }

      return (
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold font-medical text-foreground">Latest Patients</h1>
            <p className="text-muted-foreground mt-1">Recent patients you've added consultations to</p>
          </div>

          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                Recent Consultations
              </CardTitle>
              <CardDescription>
                Patients with recent medical consultations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentPatients.map((patient, index) => (
                  <div 
                    key={index} 
                    className="p-4 border border-border rounded-medical hover:bg-muted/50 cursor-pointer transition-colors"
                    onClick={() => handleOpenPatientProfile(patient)}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-lg">{patient.name}</p>
                        <p className="text-sm text-muted-foreground">CNP: {patient.cnp}</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          {patient.age} years old • {patient.gender}
                        </p>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {patient.conditions.map((condition, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {condition}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">Last Consultation</p>
                        <p className="text-sm font-medium">{patient.lastConsultation}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }
    
    if (activeSection === "history" && userType === "patient") {
      return (
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold font-medical text-foreground">Medical History</h1>
            <p className="text-muted-foreground mt-1">Your consultation and treatment history</p>
          </div>

          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                Recent Consultations
              </CardTitle>
              <CardDescription>
                Your recent medical consultations and treatments
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mockPatientConsultations.map((consultation, index) => (
                  <div 
                    key={index}
                    className="p-4 border border-border rounded-medical hover:bg-muted/50 transition-colors cursor-pointer"
                    onClick={() => setSelectedConsultation(consultation)}
                  >
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
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    if (activeSection === "settings") {
      return <SettingsPanel />;
    }
    
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-muted-foreground mb-2">
          {navItems.find(item => item.id === activeSection)?.label}
        </h2>
        <p className="text-muted-foreground">This section is coming soon...</p>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-clinical">
      {/* Mobile Header */}
      <div className="lg:hidden bg-card border-b border-border px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Heart className="h-6 w-6 text-primary" />
            <span className="font-bold font-medical text-lg">MedConnect</span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            {isSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <aside className={`
          fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-border transition-transform duration-300 lg:relative lg:translate-x-0
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}>
          <div className="flex h-full flex-col">
            {/* Logo */}
            <div className="hidden lg:flex h-16 items-center gap-2 px-6 border-b border-border">
              <Heart className="h-8 w-8 text-primary" />
              <span className="font-bold font-medical text-xl">MedConnect</span>
            </div>

            {/* User Info */}
            <div className="p-6 border-b border-border">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-medical rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">
                    {userType === "patient" ? "P" : "D"}
                  </span>
                </div>
                <div>
                  <p className="font-medium">
                    {userType === "patient" ? "Maria Popescu" : "Dr. Ion Vasile"}
                  </p>
                  <p className="text-sm text-muted-foreground capitalize">
                    {userType}
                  </p>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4">
              <ul className="space-y-2">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeSection === item.id;
                  
                  return (
                    <li key={item.id}>
                      <button
                        onClick={() => {
                          setActiveSection(item.id);
                          setIsSidebarOpen(false);
                        }}
                        className={`
                          w-full flex items-center gap-3 px-3 py-2 rounded-medical text-left transition-colors
                          ${isActive 
                            ? 'bg-gradient-medical text-white shadow-medical' 
                            : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                          }
                        `}
                      >
                        <Icon className="h-5 w-5" />
                        {item.label}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </nav>

            {/* Logout */}
            <div className="p-4 border-t border-border">
              <Button
                onClick={onLogout}
                variant="ghost"
                className="w-full justify-start gap-3 text-muted-foreground hover:text-foreground"
              >
                <LogOut className="h-5 w-5" />
                Sign Out
              </Button>
            </div>
          </div>
        </aside>

        {/* Mobile Overlay */}
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 z-40 bg-black/50 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 lg:ml-0">
          <div className="p-6 lg:p-8">
            {renderContent()}
          </div>
        </main>
      </div>

      {/* Consultation Details Dialog */}
      <Dialog open={selectedConsultation !== null} onOpenChange={(open) => !open && setSelectedConsultation(null)}>
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

            {selectedConsultation?.xrayUrl && (
              <>
                <Separator />
                <div>
                  <h4 className="font-semibold mb-2">Medical Images</h4>
                  <img 
                    src={selectedConsultation.xrayUrl} 
                    alt="Medical X-ray" 
                    className="w-full rounded-medical border cursor-pointer hover:opacity-90 transition-opacity"
                    onClick={() => setSelectedXrayImage(selectedConsultation.xrayUrl)}
                  />
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* X-ray Image Popup */}
      <Dialog open={selectedXrayImage !== null} onOpenChange={(open) => !open && setSelectedXrayImage(null)}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Medical X-ray Image</DialogTitle>
          </DialogHeader>
          <div className="flex justify-center">
            <img 
              src={selectedXrayImage || ''} 
              alt="Medical X-ray enlarged" 
              className="w-full h-auto rounded-medical"
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Layout;