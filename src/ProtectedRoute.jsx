// src/ProtectedRoute.jsx
import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { getAuth } from 'firebase/auth';

const ADMIN_EMAIL = 'noreply.strayavisuals@gmail.com'; // Replace with your admin's email

const ProtectedRoute = ({ children }) => {
  const auth = getAuth();
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      // If there's a logged in user and their email matches the admin email, authorize.
      if (user && user.email === ADMIN_EMAIL) {
        setAuthorized(true);
      } else {
        setAuthorized(false);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [auth]);

  if (loading) return <p>Loading...</p>;

  // If not authorized, redirect to the login page.
  if (!authorized) {
    return <Navigate to="/login" replace />;
  }

  // Otherwise, render the protected component.
  return children;
};

export default ProtectedRoute;
