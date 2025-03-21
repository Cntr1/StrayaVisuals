// src/App.jsx
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { db, auth } from './firebase-config';  // Import Firebase config
import { onAuthStateChanged } from 'firebase/auth';
import { collection, onSnapshot } from 'firebase/firestore';
import AdminDashboard from './AdminDashboard';
import LoginPage from './LoginPage';
import BookingForm from './BookingForm';

// Define a dummy HomePage component since you don't have one yet.
const HomePage = () => (
  <div className="text-center mt-8">
    <h2>Home Page</h2>
    <p>Coming soon...</p>
  </div>
);

// Import the ProtectedRoute component
import ProtectedRoute from './ProtectedRoute';

const App = () => {
  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);

  // Listen for Firebase authentication state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

    // Fetch bookings data from Firestore (assuming collection is "bookings")
  useEffect(() => {
    if (!user) return;
  
    const unsubscribe = onSnapshot(
      collection(db, 'bookings'),
      (snapshot) => {
        const bookingsList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setBookings(bookingsList);
      },
      (error) => {
        console.error('Error getting real-time bookings:', error);
      }
    );
  
    return () => unsubscribe();
  }, [user]);

  return (
    <Router>
      <div>
        <h1>Welcome to Straya Visuals</h1>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/booking" element={<BookingForm />} />
          {/* Wrap the admin route in ProtectedRoute */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminDashboard bookings={bookings} />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
