// Import the functions you need from the SDKs you need
import { getAnalytics } from "firebase/analytics";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// ? This file is safe to be public as it does not contain any sensitive information
// ? The Firebase API key is not a secret and can be safely exposed in the client-side code
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyARKyzdwc2fgeTpwkqTrOKIB0qpRNz_n4c",
  authDomain: "pokedle-online.firebaseapp.com",
  databaseURL:
    "https://pokedle-online-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "pokedle-online",
  storageBucket: "pokedle-online.firebasestorage.app",
  messagingSenderId: "646061032717",
  appId: "1:646061032717:web:ec60998529d152730a5c44",
  measurementId: "G-P79DBQDTC8",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);

export { analytics, app, auth };
