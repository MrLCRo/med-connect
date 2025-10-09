import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Heart, Shield, UserCheck, Stethoscope } from "lucide-react";

type UserType = "patient" | "doctor";

interface LoginProps {
  onLogin: (type: UserType) => void;
}

const Login = ({ onLogin }: LoginProps) => {
  const [patientCNP, setPatientCNP] = useState("");
  const [patientPassword, setPatientPassword] = useState("");
  const [doctorEmail, setDoctorEmail] = useState("");
  const [doctorPassword, setDoctorPassword] = useState("");

  const handlePatientLogin = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Patient login:", { cnp: patientCNP, password: patientPassword });
    onLogin("patient");
  };

  const handleDoctorLogin = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Doctor login:", { email: doctorEmail, password: doctorPassword });
    onLogin("doctor");
  };

  return (
    <div className="min-h-screen bg-gradient-clinical flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="flex items-center gap-2 text-primary">
              <Heart className="h-8 w-8" />
              <span className="text-2xl font-bold font-medical">MedConnect</span>
            </div>
          </div>
          <p className="text-muted-foreground">
            Secure access to your electronic health records
          </p>
        </div>

        {/* Login Card */}
        <Card className="shadow-medical border-0">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-medical">Sign In</CardTitle>
            <CardDescription>
              Choose your account type to continue
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="patient" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="patient" className="flex items-center gap-2">
                  <UserCheck className="h-4 w-4" />
                  Patient
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
                    <Label htmlFor="cnp">CNP (Personal Numeric Code)</Label>
                    <Input
                      id="cnp"
                      type="text"
                      placeholder="1234567890123"
                      value={patientCNP}
                      onChange={(e) => setPatientCNP(e.target.value)}
                      className="font-medical"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="patient-password">Password</Label>
                    <Input
                      id="patient-password"
                      type="password"
                      value={patientPassword}
                      onChange={(e) => setPatientPassword(e.target.value)}
                      required
                    />
                  </div>
                  <Button type="submit" variant="medical" className="w-full">
                    Sign In as Patient
                  </Button>
                </form>
              </TabsContent>

              {/* Doctor Login */}
              <TabsContent value="doctor">
                <form onSubmit={handleDoctorLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="doctor@medconnect.com"
                      value={doctorEmail}
                      onChange={(e) => setDoctorEmail(e.target.value)}
                      className="font-medical"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="doctor-password">Password</Label>
                    <Input
                      id="doctor-password"
                      type="password"
                      value={doctorPassword}
                      onChange={(e) => setDoctorPassword(e.target.value)}
                      required
                    />
                  </div>
                  <Button type="submit" variant="medical" className="w-full">
                    Sign In as Doctor
                  </Button>
                </form>
              </TabsContent>
            </Tabs>

            {/* Security Notice */}
            <div className="mt-6 p-4 bg-medical-blue-light rounded-medical">
              <div className="flex items-start gap-3">
                <Shield className="h-5 w-5 text-primary mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-primary">Secure Connection</p>
                  <p className="text-muted-foreground mt-1">
                    Your health information is protected with enterprise-grade security and encryption.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-6 text-sm text-muted-foreground">
          <p>Need help? Contact your healthcare provider</p>
        </div>
      </div>
    </div>
  );
};

export default Login;