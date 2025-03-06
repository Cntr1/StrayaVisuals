// src/App.jsx
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { db, auth } from './firebase-config';  // Import Firebase config
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { collection, getDocs } from 'firebase/firestore';

// Components (You'll create these components later)
import AdminDashboard from './AdminDashboard';
import HomePage from './HomePage';
import LoginPage from './LoginPage';

const App = () => {
  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);

  // Handle Firebase authentication state change
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  // Fetch bookings data from Firestore (assuming collection is "bookings")
  useEffect(() => {
    const fetchBookings = async () => {
      const bookingsCollection = collection(db, 'bookings');
      const bookingSnapshot = await getDocs(bookingsCollection);
      const bookingList = bookingSnapshot.docs.map(doc => doc.data());
      setBookings(bookingList);
    };

    if (user) {
      fetchBookings();
    }
  }, [user]);

  return (
    <Router>
      <div>
        <h1>Welcome to Straya Visuals</h1>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/admin" element={<AdminDashboard bookings={bookings} />} />
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
