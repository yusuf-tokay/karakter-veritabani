import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDDX-cc30STbaAWpo5Ach_EIjwV_N6ao_U",
  authDomain: "karakterozelikleri.firebaseapp.com",
  projectId: "karakterozelikleri",
  storageBucket: "karakterozelikleri.firebasestorage.app",
  messagingSenderId: "561430374008",
  appId: "1:561430374008:web:314cad50712f5471062f8d",
  measurementId: "G-5997DKLEJ8"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth }; 