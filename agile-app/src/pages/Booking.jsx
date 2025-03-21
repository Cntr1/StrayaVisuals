import React from "react";
import { Link } from "react-router-dom";
import "./Booking.css";
import logo from './images/logo.jpeg'

const Booking = () => {
  return (
      <div>
        {/* Navigation Bar */}
        <nav className="nav-contact">
          <ul>
            <div className="nav-left">
              <li>
                <img src={logo} alt="Logo" className="nav-logo"/>
              </li>
            </div>
            <div className="nav-center">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/booking" id="selected">Booking</Link></li>
              <li><Link to="/equipment">Equipment</Link></li>
              <li><Link to="/about">About</Link></li>
              <li><Link to="/contact" >Contact Us</Link></li>
            </div>
            <div className="nav-profile">
              <li><Link to="/profile"><i className="fa fa-user"></i></Link></li>
            </div>
          </ul>
        </nav>
      </div>
  );
};

export default Booking;
