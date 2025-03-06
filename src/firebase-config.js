// src/firebase-config.js

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your Firebase config object
const firebaseConfig = {
    apiKey: "AIzaSyC9q000WhsYE8HNddxbxenxFDLscbFOj60",  
    authDomain: "straya-visuals.firebaseapp.com",  
    projectId: "straya-visuals",  
    storageBucket: "straya-visuals.firebasestorage.app",  
    messagingSenderId: "1071214991411",  
    appId: "1:1071214991411:web:120b118b26faeacac1ab46"  
  };
  

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);

export { db };
