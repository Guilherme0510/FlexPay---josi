import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_APP_ID,
  measurementId: process.env.REACT_APP_MEASUREMENT_ID
  // apiKey: "AIzaSyDZiHty5tjD370jUQUuxuGEgbnzIrNt284",
  // authDomain: "teste-flexpay.firebaseapp.com",
  // projectId: "teste-flexpay",
  // storageBucket: "teste-flexpay.firebasestorage.app",
  // messagingSenderId: "662344477333",
  // appId: "1:662344477333:web:8a807f0d54830866c2899c",
  // measurementId: "G-Q1RPKX5DHT"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

