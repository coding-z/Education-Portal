// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD2-i4Y6z_WHIKlAyg7rN_at2AdYA5QFzY",
  authDomain: "education-portal-project.firebaseapp.com",
  projectId: "education-portal-project",
  storageBucket: "education-portal-project.appspot.com",
  messagingSenderId: "919390365301",
  appId: "1:919390365301:web:da3ecad2e05d66560c3a3c"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialise Authentication
export const auth = getAuth(app);
