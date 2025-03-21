import React from "react";
import { Link } from "react-router-dom";
import "./About.css";
import logo from './images/logo.jpeg'


const About = () => {
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
              <li><Link to="/booking">Booking</Link></li>
              <li><Link to="/equipment">Equipment</Link></li>
              <li><Link to="/about" id="selected">About</Link></li>
              <li><Link to="/contact">Contact Us</Link></li>
            </div>
            <div className="nav-profile">
              <li><a href="#"><i className="fa fa-user"></i></a></li>
            </div>
          </ul>
        </nav>


      </div>
  );
};

export default About;

