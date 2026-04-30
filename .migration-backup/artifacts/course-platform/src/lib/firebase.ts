import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase } from "firebase/database";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBG2fEAYA24AB7LhMmhd99LnESKd5_SXlQ",
  authDomain: "business-agent-a90a7.firebaseapp.com",
  databaseURL: "https://business-agent-a90a7-default-rtdb.firebaseio.com",
  projectId: "business-agent-a90a7",
  storageBucket: "business-agent-a90a7.firebasestorage.app",
  messagingSenderId: "478363515355",
  appId: "1:478363515355:web:2d8e652a3f880e2a648ffe",
  measurementId: "G-9NYBNJCR54",
};

export const app = initializeApp(firebaseConfig);
export const rtdb = getDatabase(app);
export const db = getFirestore(app);

if (typeof window !== "undefined") {
  try { getAnalytics(app); } catch { /* analytics optional */ }
}
