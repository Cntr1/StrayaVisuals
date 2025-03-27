// src/LoginPage.jsx
import React, { useEffect, useState } from "react";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";
import "./LoginPage.css";

const ADMIN_EMAIL = "noreply.strayavisuals@gmail.com";

const LoginPage = () => {
  const auth = getAuth();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        if (user.email === ADMIN_EMAIL) {
          navigate("/admin");
        } else {
          signOut(auth);
          setError(
            "Access Denied. You are not authorized to access this page.",
          );
        }
      }
    });
    return () => unsubscribe();
  }, [auth, navigate]);

  const handleGoogleLogin = async () => {
    setError("");
    setLoading(true);
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      if (user.email === ADMIN_EMAIL) {
        navigate("/admin");
      } else {
        await signOut(auth);
        setError("Access Denied. You are not authorized to access this page.");
      }
    } catch (err) {
      console.error("Error during Google sign-in:", err);
      setError("Failed to sign in with Google.");
    }
    setLoading(false);
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1 className="login-title">Admin Login</h1>
        {error && <p className="login-error">{error}</p>}
        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          className="login-button"
        >
          {loading ? "Logging in..." : "Login with Google"}
        </button>
      </div>
    </div>
  );
};

export default LoginPage;
