// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
export const firebaseConfig = {
  apiKey: "AIzaSyCwzLsY77z7swVowlZuhHuW5omkEiGh5n8",
  authDomain: "goooglefribase.firebaseapp.com",
  databaseURL: "https://goooglefribase.firebaseio.com",
  projectId: "goooglefribase",
  storageBucket: "goooglefribase.firebasestorage.app",
  messagingSenderId: "368561356235",
  appId: "1:368561356235:web:129f9e2e0d8bb46dce8a4e"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);