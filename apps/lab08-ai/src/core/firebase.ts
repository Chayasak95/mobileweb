import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA1_7pS6SB2IpSdsZWfCsMC59jnZYmCh7c",
  authDomain: "mobileweb-d629a.firebaseapp.com",
  projectId: "mobileweb-d629a",
  storageBucket: "mobileweb-d629a.firebasestorage.app",
  messagingSenderId: "328965104982",
  appId: "1:328965104982:web:6ea2dd555dcde67b4d62f7",
  measurementId: "G-3RBCGJPCF9"
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);