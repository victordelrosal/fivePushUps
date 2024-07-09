// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-app.js";
import { getFirestore, doc, setDoc, getDocs, deleteDoc, collection } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-firestore.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAtg-_5eLD-Prs74zTnCj4HjQQfnssdfP8",
  authDomain: "fivepushups-d5d82.firebaseapp.com",
  projectId: "fivepushups-d5d82",
  storageBucket: "fivepushups-d5d82.appspot.com",
  messagingSenderId: "472818589501",
  appId: "1:472818589501:web:ef6402c4e19842c0e86f54",
  measurementId: "G-TJ5VSMC86Y"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
console.log("Firebase initialized");

// ... Shared functions ...

export { db, toggleCheck, confirmCheck, generateTable, disableFutureDates, markMissedDates, generateDateRange, loadData };
