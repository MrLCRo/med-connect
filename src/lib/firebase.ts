import { initializeApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";
import { getStorage, FirebaseStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAvAjg0s8kH9hNmaTyWnZb95wCIjf3Hd08",
  authDomain: "medconnect-dca9b.firebaseapp.com",
  projectId: "medconnect-dca9b",
  storageBucket: "medconnect-dca9b.firebasestorage.app",
  messagingSenderId: "488614218633",
  appId: "1:488614218633:web:7d0cb2a493cc276cecaf58",
  measurementId: "G-BDS53Z0WQW",
};

const app = initializeApp(firebaseConfig);

export const auth: Auth = getAuth(app);
export const db: Firestore = getFirestore(app);
export const storage: FirebaseStorage = getStorage(app);
