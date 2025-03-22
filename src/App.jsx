// src/App.jsx
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { db, auth } from './firebase-config';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, onSnapshot } from 'firebase/firestore';
import AdminDashboard from './AdminDashboard';
import LoginPage from './LoginPage';
import BookingForm from './BookingForm';
import HomePage from './Homepage/HomePage';
import ProtectedRoute from './ProtectedRoute';
import Footer from './components/Footer';
import Navbar from './components/Navbar';
import './app.css';

const App = () => {
  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

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
      <div className="app-container global-background">
        <Navbar />
        {/* Main content container */}
        <div className="content-container">
          <Routes>
            <Route path="/" element={<HomePage />} />
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
        </div>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
