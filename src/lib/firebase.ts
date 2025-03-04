import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCrlPEK57vY9yeq9i56diLaMJ4BFxbOFDI",
  authDomain: "learnhub-de24f.firebaseapp.com",
  projectId: "learnhub-de24f",
  storageBucket: "learnhub-de24f.firebasestorage.app",
  messagingSenderId: "77781134375",
  appId: "1:77781134375:web:4b946c77c2df14f8dcb202",
  measurementId: "G-6GYGZHYETF"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app); 