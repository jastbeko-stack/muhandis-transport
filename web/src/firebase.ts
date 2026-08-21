import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA0ZBWdVspj_cBQ_NB7SggQY0kz-IytueA",
  authDomain: "muhandis-transport.firebaseapp.com",
  projectId: "muhandis-transport",
  storageBucket: "muhandis-transport.firebasestorage.app",
  messagingSenderId: "352331552999",
  appId: "1:352331552999:web:c97e574181c9ab16c4ea42"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);