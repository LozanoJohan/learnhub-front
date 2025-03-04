// Import the functions you need from the SDKs you need
import { initializeApp, type FirebaseOptions } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {

  apiKey: "AIzaSyCrlPEK57vY9yeq9i56diLaMJ4BFxbOFDI",

  authDomain: "learnhub-de24f.firebaseapp.com",

  projectId: "learnhub-de24f",

  storageBucket: "learnhub-de24f.firebasestorage.app",

  messagingSenderId: "77781134375",

  appId: "1:77781134375:web:4b946c77c2df14f8dcb202",

  measurementId: "G-6GYGZHYETF"

};

// Si no hay appId o está en formato incorrecto, hubo un problema con la configuración
if (!firebaseConfig.appId || !firebaseConfig.apiKey) {
  console.error('Firebase initialization error: Missing required configuration');
}

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);

// Usar emuladores en desarrollo si está configurado
// Comentado hasta que se configure correctamente
// if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
//   connectAuthEmulator(auth, 'http://localhost:9099');
//   console.log('Using Firebase Auth Emulator');
// }

// Initialize Analytics only in the browser environment
let analytics;
if (typeof window !== 'undefined') {
  try {
    analytics = getAnalytics(app);
  } catch (error) {
    console.error('Firebase Analytics initialization failed:', error);
  }
}
export { analytics }; 