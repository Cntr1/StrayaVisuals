// src/firebase-config.jsx
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage"; // Import getStorage

// Your Firebase config object
const firebaseConfig = {
  apiKey: "AIzaSyC9q000WhsYE8HNddxbxenxFDLscbFOj60",
  authDomain: "straya-visuals.firebaseapp.com",
  projectId: "straya-visuals",
  storageBucket: "straya-visuals.firebasestorage.app",
  messagingSenderId: "1071214991411",
  appId: "1:1071214991411:web:120b118b26faeacac1ab46",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app); // Initialize Firebase Storage

// Export the initialized app along with db, auth, and storage
export { app, db, auth, storage };
