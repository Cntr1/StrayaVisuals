// src/App.jsx (wrap your app with VideoContext.Provider)
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
import VideoDashboard from './components/VideoDashboard';
import FeaturedFilms from './Portfolio';
import { VideoContext } from './VideoContext'; // Import VideoContext
import './app.css';

const App = () => {
  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [videos, setVideos] = useState([]);

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
      <VideoContext.Provider value={{ videos, setVideos }}>
        <div className="app-container global-background">
          <Navbar />
          <div className="content-container">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/booking" element={<BookingForm />} />
              <Route path="/portfolio" element={<FeaturedFilms />} />
              <Route
                path="/admin"
                element={
                  <ProtectedRoute>
                    <AdminDashboard bookings={bookings} />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/videos"
                element={
                  <ProtectedRoute>
                    <VideoDashboard />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </div>
          <Footer />
        </div>
      </VideoContext.Provider>
    </Router>
  );
};

export default App;
