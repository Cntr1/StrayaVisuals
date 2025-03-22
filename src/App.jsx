// src/App.jsx
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { db, auth } from './firebase-config';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, onSnapshot } from 'firebase/firestore';
import AdminDashboard from './AdminDashboard';
import LoginPage from './LoginPage';
import BookingForm from './BookingForm';

// Import HomePage from the Homepage folder
import HomePage from './Homepage/HomePage';

// Import the ProtectedRoute component (for /admin)
import ProtectedRoute from './ProtectedRoute';

// Import Footer and the new Navbar components
import Footer from './components/Footer';
import Navbar from './components/Navbar';

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
        <Navbar /> {/* Global Navbar now uses the home page navigation style */}
        <Routes>
          <Route path="/" element={<HomePage />} />  {/* HomePage route */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/booking" element={<BookingForm />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminDashboard bookings={bookings} />
              </ProtectedRoute>
            }
          />
        </Routes>
        <Footer /> {/* Global Footer */}
      </div>
    </Router>
  );
};

export default App;
