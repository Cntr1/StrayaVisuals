import React from "react";
import { Routes, Route } from "react-router-dom"; // No need to import Router here
import EquipmentFront from "./pages/EquipmentFront"; // Import EquipmentFront
import Home from "./pages/Home"; // Example of another page, adjust as needed
import Booking from "./pages/Booking"; // Example of another page, adjust as needed
import About from "./pages/About"; // Example of another page, adjust as needed
import Contact from "./pages/Contact"; // Example of another page, adjust as needed
import Profile from "./pages/Profile"; // Example of Profile page

function App() {
  return (
    <Routes>
      {/* Define all routes here */}
      <Route path="/" element={<Home />} /> {/* Home page */}
      <Route path="/booking" element={<Booking />} /> {/* Booking page */}
      <Route path="/equipment" element={<EquipmentFront />} /> {/* Equipment page */}
      <Route path="/about" element={<About />} /> {/* About page */}
      <Route path="/contact" element={<Contact />} /> {/* Contact page */}
      <Route path="/profile" element={<Profile />} /> {/* Profile page */}
    </Routes>
  );
}

export default App;



