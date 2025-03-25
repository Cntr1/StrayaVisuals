// src/App.jsx
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { db, auth } from './firebase-config';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, onSnapshot } from 'firebase/firestore';
import AdminDashboard from './AdminDashboard';
import LoginPage from './LoginPage';
import BookingFancy from "./BookingFancy";
import HomePage from './Homepage/HomePage';
import ProtectedRoute from './ProtectedRoute';
import Header from './components/Header';
import Footer from './components/Footer';
import VideoDashboard from './components/VideoDashboard';
import FeaturedFilms from './Portfolio';
import Contact from './Contact';
import EquipmentFront from "./EquipmentFront";
import { VideoContext } from './VideoContext';
import About from './About';
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
        {/* 🔥 Add global background wrapper here */}
        <div className="global-background">
          <div className="app-container">
            <Header />
            <div className="content-container">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/booking" element={<BookingFancy />} />
                <Route path="/portfolio" element={<FeaturedFilms />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/equipment" element={<EquipmentFront />} />
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
        </div>
      </VideoContext.Provider>
    </Router>
  );
};

export default App;
