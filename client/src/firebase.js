// firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// import { getAnalytics } from "firebase/analytics"; // use somente em produção

const firebaseConfig = {
  apiKey: "AIzaSyDqgFByMYfSnUxmDqcDbECKd5fsnapR9KA",
  authDomain: "storesync-a0b9f.firebaseapp.com",
  projectId: "storesync-a0b9f",
  storageBucket: "storesync-a0b9f.appspot.com", // corrigido: estava .app (errado)
  messagingSenderId: "11987239901",
  appId: "1:11987239901:web:8d9cfc3af83a7e78332c34",
  measurementId: "G-R7FYMW7HVB"
};

const app = initializeApp(firebaseConfig);

// Serviços que você vai usar
const auth = getAuth(app);
const db = getFirestore(app);

// Exporte o que for necessário
export { app, auth, db };
