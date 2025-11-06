// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getAuth} from "firebase/auth"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBsZI1vHEKf4NEB95K_S0pyNHiTkPVqhbE",
  authDomain: "finance-3f570.firebaseapp.com",
  projectId: "finance-3f570",
  storageBucket: "finance-3f570.firebasestorage.app",
  messagingSenderId: "178306118867",
  appId: "1:178306118867:web:e56986efd278a4babe5026",
  measurementId: "G-MWK5V1763B"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);

export {app , analytics , auth};