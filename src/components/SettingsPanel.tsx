import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Moon, Sun, Lock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useTheme } from "next-themes";
import { auth } from "@/lib/firebase";
import {
  updatePassword,
  EmailAuthProvider,
  reauthenticateWithCredential,
} from "firebase/auth";

const SettingsPanel = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { theme, setTheme } = useTheme();

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast({
        variant: "destructive",
        title: "Eroare",
        description: "Noile parole nu coincid",
      });
      return;
    }

    if (newPassword.length < 8) {
      toast({
        variant: "destructive",
        title: "Eroare",
        description: "Parola trebuie să aibă cel puțin 8 caractere",
      });
      return;
    }

    setLoading(true);

    try {
      const user = auth.currentUser;
      if (!user || !user.email) {
        toast({
          variant: "destructive",
          title: "Eroare",
          description: "Niciun utilizator autentificat",
        });
        setLoading(false);
        return;
      }

      const credential = EmailAuthProvider.credential(
        user.email,
        currentPassword
      );
      await reauthenticateWithCredential(user, credential);

      await updatePassword(user, newPassword);

      toast({
        title: "Succes",
        description: "Parola a fost schimbată cu succes",
      });

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error: any) {
      console.error("Eroare la schimbarea parolei:", error);

      if (
        error.code === "auth/wrong-password" ||
        error.code === "auth/invalid-credential"
      ) {
        toast({
          variant: "destructive",
          title: "Eroare",
          description: "Parola curentă este incorectă",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Eroare",
          description: "Schimbarea parolei a eșuat. Încearcă din nou.",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold font-medical text-foreground">
          Setări
        </h1>
        <p className="text-muted-foreground mt-1">
          Gestionează preferințele contului tău
        </p>
      </div>

      {/* Theme Toggle */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {theme === "dark" ? (
              <Moon className="h-5 w-5" />
            ) : (
              <Sun className="h-5 w-5" />
            )}
            Aspect
          </CardTitle>
          <CardDescription>Alege tema preferată</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="theme-toggle" className="text-base">
                Mod întunecat
              </Label>
              <p className="text-sm text-muted-foreground">
                Comută între tema deschisă și tema închisă
              </p>
            </div>
            <Switch
              id="theme-toggle"
              checked={theme === "dark"}
              onCheckedChange={(checked) =>
                setTheme(checked ? "dark" : "light")
              }
            />
          </div>
        </CardContent>
      </Card>

      {/* Change Password */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5" />
            Schimbă parola
          </CardTitle>
          <CardDescription>
            Actualizează parola pentru a-ți proteja contul
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="current-password">Parola curentă</Label>
              <Input
                id="current-password"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Introdu parola curentă"
                required
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="new-password">Parola nouă</Label>
              <Input
                id="new-password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Introdu parola nouă"
                required
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirmă parola nouă </Label>
              <Input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirmă parola nouă"
                required
                disabled={loading}
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Se actualizează..." : "Actualizează parola"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsPanel;
