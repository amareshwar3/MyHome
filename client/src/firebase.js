// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-project-fa5d0.firebaseapp.com",
  projectId: "mern-project-fa5d0",
  storageBucket: "mern-project-fa5d0.appspot.com",
  messagingSenderId: "190344990534",
  appId: "1:190344990534:web:601a4b1561e4af6bc99f47"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);