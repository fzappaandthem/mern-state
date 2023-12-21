// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-estate-35d89.firebaseapp.com",
  projectId: "mern-estate-35d89",
  storageBucket: "mern-estate-35d89.appspot.com",
  messagingSenderId: "816644194324",
  appId: "1:816644194324:web:60fab4a8ff198b9020e701"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);