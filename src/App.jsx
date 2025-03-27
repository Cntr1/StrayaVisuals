import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { db, auth } from "./firebase-config";
import { onAuthStateChanged } from "firebase/auth";
import { collection, getDocs, onSnapshot } from "firebase/firestore";
import AdminDashboard from "./AdminDashboard";
import LoginPage from "./LoginPage";
import BookingFancy from "./BookingFancy";
import HomePage from "./HomePage/HomePage";
import ProtectedRoute from "./ProtectedRoute";
import Header from "./components/Header";
import Footer from "./components/Footer";
import VideoDashboard from "./components/VideoDashboard";
import FeaturedFilms from "./Portfolio";
import Contact from "./Contact";
import EquipmentFront from "./EquipmentFront";
import { VideoContext } from "./VideoContext";
import About from "./About";
import "./App.css";
import ContactDashboard from "./components/ContactDashboard.jsx";
import Modal from "react-modal";

Modal.setAppElement("#root");

const App = () => {
  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [videos, setVideos] = useState([]);
  const [packagesData, setPackagesData] = useState(null);
  const [contactMessages, setContactMessages] = useState(null);
  const [socials, setSocials] = useState([]);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const packageSnapshot = await getDocs(collection(db, "packages"));
        const packageOrder = [
          "bsNLepR9f1Gj9yFenTbm",
          "q7MT2hanXirpRTUVMmDQ",
          "66r7pumc0E12VaXWXDfP",
        ];
        const packagesList = packageSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        const sortedPackages = packageOrder
          .map((id) => packagesList.find((pkg) => pkg.id === id))
          .filter(Boolean);
        setPackagesData(sortedPackages);

        const contactSnapshot = await getDocs(
          collection(db, "contactMessages"),
        );
        const contactList = contactSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setContactMessages(contactList);

        const socialsSnapshot = await getDocs(collection(db, "socials"));
        const socialOrder = [
          "xBU1afPDPfOroSUZBWp6",
          "Ehiy8FCG10N0NzB4E5cQ",
          "JtTNf3dWfmQnzoutV0as",
        ];
        const socialsData = socialsSnapshot.docs.map((doc) => ({
          originalId: doc.id,
          ...doc.data(),
        }));

        const sortedSocials = socialOrder
          .map((id) => socialsData.find((social) => social.originalId === id))
          .filter((social) => social !== undefined)
          .map((social, index) => ({
            id: ["fbbox", "instbox", "twtbox"][index] || social.originalId,
            originalId: social.originalId,
            platform: ["Facebook", "Instagram", "Twitter"][index] || "Unknown",
            username: social.username || "N/A",
            link: social.socialLink || "#",
            icon: social.socialIcon || "/fallback-icon.png",
            cover: social.socialCover || "/fallback-cover.jpg",
            profile: social.socialProfile || "/fallback-profile.jpg",
          }));

        setSocials(sortedSocials);
      } catch (error) {
        console.error("Error fetching data:", error);
        setPackagesData([]);
        setContactMessages([]);
        setSocials([]);
      }
    };

    fetchInitialData();
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) return;
    const unsubscribe = onSnapshot(
      collection(db, "bookings"),
      (snapshot) => {
        const bookingsList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setBookings(bookingsList);
      },
      (error) => {
        console.error("Error getting real-time bookings:", error);
      },
    );
    return () => unsubscribe();
  }, [user]);

  return (
    <Router>
      <VideoContext.Provider value={{ videos, setVideos }}>
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
                <Route
                  path="/contact"
                  element={
                    <Contact packages={packagesData} socials={socials} />
                  }
                />
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
                <Route
                  path="/admin/contact/update"
                  element={
                    <ProtectedRoute>
                      <ContactDashboard
                        packages={packagesData}
                        contactMessages={contactMessages}
                        socials={socials}
                      />
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
