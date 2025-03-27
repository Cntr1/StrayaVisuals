import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import logo from "/images/logo.jpeg";
import "../css/contact/base.css";
import "../css/contact/font-awesome.min.css";
import "../css/footer/style.css";
import "./Header.css";

const Header = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={`nav-contact ${scrolled ? "scrolled" : ""}`}>
      <ul className="nav-flex">
        <div className="nav-left">
          <li>
            <NavLink to="/admin">
              <img src={logo} alt="Logo" className="nav-logo" />
            </NavLink>
          </li>
        </div>

        <div className="nav-center">
          <li><NavLink to="/" className={({ isActive }) => isActive ? "active nav-link" : "nav-link"}>Home</NavLink></li>
          <li><NavLink to="/portfolio" className={({ isActive }) => isActive ? "active nav-link" : "nav-link"}>Portfolio</NavLink></li>
          <li><NavLink to="/booking" className={({ isActive }) => isActive ? "active nav-link" : "nav-link"}>Booking</NavLink></li>
          <li><NavLink to="/equipment" className={({ isActive }) => isActive ? "active nav-link" : "nav-link"}>Equipment</NavLink></li>
          <li><NavLink to="/about" className={({ isActive }) => isActive ? "active nav-link" : "nav-link"}>About</NavLink></li>
          <li><NavLink to="/contact" className={({ isActive }) => isActive ? "active nav-link" : "nav-link"}>Contact Us</NavLink></li>
        </div>

        <div className="nav-profile" style={{ visibility: "hidden" }}>
          <li>
            <a href="#"><i className="fa fa-user"></i></a>
          </li>
        </div>
      </ul>
    </nav>
  );
};

export default Header;
