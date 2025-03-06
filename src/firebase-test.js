// firebase-test.js

import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc } from "firebase/firestore";

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

// Function to add data
const addTestData = async () => {
  try {
    // Add a new document with test data
    const docRef = await addDoc(collection(db, "testCollection"), {
      name: "Test Name",
      age: 25,
      city: "Sydney"
    });
    console.log("Document written with ID: ", docRef.id);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
};

// Call the function to add data
addTestData();
