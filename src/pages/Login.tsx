import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Heart, Shield, UserCheck, Stethoscope } from "lucide-react";
import { loginPatient, loginDoctor } from "@/services/authService";
import { useToast } from "@/hooks/use-toast";

type UserType = "patient" | "doctor";

interface LoginProps {
  onLogin: (type: UserType) => void;
}

const Login = ({ onLogin }: LoginProps) => {
  const [patientEmail, setPatientEmail] = useState("");
  const [patientPassword, setPatientPassword] = useState("");
  const [doctorEmail, setDoctorEmail] = useState("");
  const [doctorPassword, setDoctorPassword] = useState("");
  const [loading, setLoading] = useState<boolean>(false);
  const { toast } = useToast();

  const handlePatientLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const result = await loginPatient(patientEmail, patientPassword);

    if (result.success) {
      onLogin(result.userType);
    } else {
      toast({
        variant: "destructive",
        title: "Autentificare eșuată",
        description:
          result.success === false ? result.error : "A apărut o eroare",
      });
    }

    setLoading(false);
  };

  const handleDoctorLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const result = await loginDoctor(doctorEmail, doctorPassword);

    if (result.success) {
      onLogin(result.userType);
    } else {
      toast({
        variant: "destructive",
        title: "Autentificare eșuată",
        description:
          result.success === false ? result.error : "A apărut o eroare",
      });
    }

    setLoading(false);
  };
  return (
    <div className="min-h-screen bg-gradient-clinical flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="flex items-center gap-2 text-primary">
              <Heart className="h-8 w-8" />
              <span className="text-2xl font-bold font-medical">
                MedConnect
              </span>
            </div>
          </div>
          <p className="text-muted-foreground">
            Acces securizat la dosarul tău medical electronic
          </p>
        </div>

        {/* Login Card */}
        <Card className="shadow-medical border-0">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-medical">
              Autentificare
            </CardTitle>
            <CardDescription>
              Alege tipul contului pentru a continua
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="patient" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger
                  value="patient"
                  className="flex items-center gap-2"
                >
                  <UserCheck className="h-4 w-4" />
                  Pacient
                </TabsTrigger>
                <TabsTrigger value="doctor" className="flex items-center gap-2">
                  <Stethoscope className="h-4 w-4" />
                  Doctor
                </TabsTrigger>
              </TabsList>

              {/* Patient Login */}
              <TabsContent value="patient">
                <form onSubmit={handlePatientLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="patient-email">Email</Label>
                    <Input
                      id="patient-email"
                      type="email"
                      placeholder="patient@example.com"
                      value={patientEmail}
                      onChange={(e) => setPatientEmail(e.target.value)}
                      className="font-medical"
                      required
                      disabled={loading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="patient-password">Parolă</Label>
                    <Input
                      id="patient-password"
                      type="password"
                      value={patientPassword}
                      onChange={(e) => setPatientPassword(e.target.value)}
                      required
                      disabled={loading}
                    />
                  </div>
                  <Button
                    type="submit"
                    variant="medical"
                    className="w-full"
                    disabled={loading}
                  >
                    {loading ? "Autentificare..." : "Autentificare ca Pacient"}
                  </Button>
                </form>
              </TabsContent>

              {/* Doctor Login */}
              <TabsContent value="doctor">
                <form onSubmit={handleDoctorLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Adresă de email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="doctor@medconnect.com"
                      value={doctorEmail}
                      onChange={(e) => setDoctorEmail(e.target.value)}
                      className="font-medical"
                      required
                      disabled={loading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="doctor-password">Parolă</Label>
                    <Input
                      id="doctor-password"
                      type="password"
                      value={doctorPassword}
                      onChange={(e) => setDoctorPassword(e.target.value)}
                      required
                      disabled={loading}
                    />
                  </div>
                  <Button
                    type="submit"
                    variant="medical"
                    className="w-full"
                    disabled={loading}
                  >
                    {loading ? "Autentificare..." : "Autentificare ca Doctor"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>

            {/* Security Notice */}
            <div className="mt-6 p-4 rounded-medical">
              <div className="flex items-start gap-3">
                <Shield className="h-5 w-5 text-primary mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-primary">
                    Conexiune Securizată
                  </p>
                  <p className="text-muted-foreground mt-1">
                    Informațiile tale medicale sunt protejate cu securitate și
                    criptare de nivel enterprise.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
