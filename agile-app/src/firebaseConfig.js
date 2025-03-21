// Import Firebase SDK
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBaJiyPf-Ex7F4Fc6vF_AOUkpWrWrqxiy4",
    authDomain: "svproject-d036d.firebaseapp.com",
    databaseURL: "https://svproject-d036d-default-rtdb.firebaseio.com",
    projectId: "svproject-d036d",
    storageBucket: "svproject-d036d.firebasestorage.app",
    messagingSenderId: "621233260270",
    appId: "1:621233260270:web:beef5e6699c07f2ee915ff"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export { database };

