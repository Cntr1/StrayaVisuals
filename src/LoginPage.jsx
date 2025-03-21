// src/LoginPage.jsx
import React, { useEffect, useState } from 'react';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

const ADMIN_EMAIL = 'noreply.strayavisuals@gmail.com'; // Replace with your admin email

const LoginPage = () => {
  const auth = getAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Listen for auth state changes.
  // If a user is already logged in, check if they're the admin.
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        if (user.email === ADMIN_EMAIL) {
          navigate('/admin');
        } else {
          // Not the admin; sign out and display an error.
          signOut(auth);
          setError('Access Denied. You are not authorized to access this page.');
        }
      }
    });
    return () => unsubscribe();
  }, [auth, navigate]);

  const handleGoogleLogin = async () => {
    setError('');
    setLoading(true);
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      // Check if the signed-in user is the admin.
      if (user.email === ADMIN_EMAIL) {
        navigate('/admin');
      } else {
        await signOut(auth);
        setError('Access Denied. You are not authorized to access this page.');
      }
    } catch (err) {
      console.error('Error during Google sign-in:', err);
      setError('Failed to sign in with Google.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md text-center">
        <h1 className="text-2xl font-bold mb-4">Admin Login</h1>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition-colors"
        >
          {loading ? 'Logging in...' : 'Login with Google'}
        </button>
      </div>
    </div>
  );
};

export default LoginPage;
