// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDq1uf8-26shOusnrW1Cy4h-OZGsLWOdmo",
  authDomain: "bookmyservice-faffa.firebaseapp.com",
  projectId: "bookmyservice-faffa",
  storageBucket: "bookmyservice-faffa.firebasestorage.app",
  messagingSenderId: "1060444078332",
  appId: "1:1060444078332:web:a67ca4734552ff85f15779",
  measurementId: "G-ZTZBPRNH73"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);