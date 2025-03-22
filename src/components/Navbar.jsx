// src/components/Navbar.jsx
import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="position-absolute top-0 w-100 p-3 d-flex justify-content-between align-items-center" style={{ zIndex: 1000 }}>
      <div>
        <img
          src="/StrayaVisualsLogo.jpg"
          alt="Straya Visuals Logo"
          style={{ width: "80px" }}
          className="ms-3"
        />
      </div>
      <div className="d-flex">
        <Link to="/" className="text-white mx-3 text-decoration-none hover-underline">Home</Link>
        <Link to="/about" className="text-white mx-3 text-decoration-none hover-underline">About</Link>
        <Link to="/portfolio" className="text-white mx-3 text-decoration-none hover-underline">Portfolio</Link>
        <Link to="/admin" className="text-white mx-3 text-decoration-none hover-underline">Dashboard</Link>
        <Link to="/booking" className="text-white mx-3 text-decoration-none hover-underline">Bookings</Link>
        <Link to="/social" className="text-white mx-3 text-decoration-none hover-underline">Social</Link>
      </div>
    </nav>
  );
};

export default Navbar;
