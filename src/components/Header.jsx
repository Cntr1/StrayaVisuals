// src/components/Header.jsx
import React from "react";
import { NavLink } from "react-router-dom";
import logo from "/images/logo.jpeg"; // Ensure your logo is located in public/images/

// Import the CSS used by your Contact page header (if needed)
import "../css/contact/base.css";
import "../css/contact/font-awesome.min.css";
import "../css/footer/style.css";

const Header = () => {
  return (
    <nav className="nav-contact">
      <ul>
        <div className="nav-left">
          <li>
            {/* Wrap the logo in a NavLink that routes to /admin */}
            <NavLink to="/admin">
              <img src={logo} alt="Logo" className="nav-logo" />
            </NavLink>
          </li>
        </div>
        <div className="nav-center">
          <li>
            <NavLink 
              to="/" 
              data-discover="true" 
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              Home
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/booking" 
              data-discover="true" 
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              Booking
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/equipment" 
              data-discover="true" 
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              Equipment
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/about" 
              data-discover="true" 
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              About
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/contact" 
              data-discover="true" 
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              Contact Us
            </NavLink>
          </li>
        </div>
        <div className="nav-profile">
          <li>
            <a href="#">
              <i className="fa fa-user"></i>
            </a>
          </li>
        </div>
      </ul>
    </nav>
  );
};

export default Header;
