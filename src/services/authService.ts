import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../lib/firebase";

export type LoginResult =
  | { success: true; userType: "patient" | "doctor" }
  | { success: false; error: string };

export const loginPatient = async (
  email: string,
  password: string
): Promise<LoginResult> => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    const userId = userCredential.user.uid;

    const patientDoc = await getDoc(doc(db, "patients", userId));

    if (!patientDoc.exists()) {
      await signOut(auth);
      return {
        success: false,
        error: "Acest cont nu este înregistrat ca pacient.",
      };
    }

    return { success: true, userType: "patient" };
  } catch (error: any) {
    if (error.code === "auth/invalid-credential") {
      return { success: false, error: "Invalid email or password" };
    }
    return { success: false, error: "An error occurred. Please try again." };
  }
};

export const loginDoctor = async (
  email: string,
  password: string
): Promise<LoginResult> => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    const userId = userCredential.user.uid;

    const doctorDoc = await getDoc(doc(db, "doctors", userId));

    if (!doctorDoc.exists()) {
      await signOut(auth);
      return {
        success: false,
        error: "Acest cont nu este înregistrat ca doctor.",
      };
    }

    return { success: true, userType: "doctor" };
  } catch (error: any) {
    if (error.code === "auth/invalid-credential") {
      return { success: false, error: "Email sau parolă incorectă" };
    }
    return {
      success: false,
      error: "A apărut o eroare. Te rugăm să încerci din nou.",
    };
  }
};

export const logout = async (): Promise<void> => {
  await signOut(auth);
};
