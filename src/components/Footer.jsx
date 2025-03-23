// src/components/Footer.jsx
import React from "react";
// If you have a dedicated footer style file, import it here:
import "../css/footer/style.css";

const Footer = () => {
  return (
    <footer className="footer-10" style={{ minHeight: "654px" }}>
      <div className="container" style={{ minWidth: "1440px" }}>
        {/* First row of contact info */}
        <div className="row mb-5 pb-3 no-gutters" style={{ marginTop: "30px" }}>
          <div className="col-md-4 mb-md-0 mb-4 d-flex">
            <div className="con con-1 w-100 py-5">
              <div className="con-info w-100 text-center">
                <div className="icon d-flex align-items-center justify-content-center">
                  <span className="fa fa-phone" style={{ color: "lightgray" }}></span>
                </div>
                <div className="text">
                  <span
                    style={{
                      color: "lightgray",
                      fontWeight: "1000",
                      fontSize: "15px",
                    }}
                  >
                    +(61) 451 782 030 | +(61) 451 782 982
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-4 mb-md-0 mb-4 d-flex">
            <div className="con con-2 w-100 py-5">
              <div className="con-info w-100 text-center">
                <div className="icon d-flex align-items-center justify-content-center">
                  <span
                    className="fa fa-location-arrow"
                    style={{ color: "lightgray" }}
                  ></span>
                </div>
                <div className="text">
                  <span
                    style={{
                      color: "lightgray",
                      fontWeight: "1000",
                      fontSize: "15px",
                    }}
                  >
                    4 Karabil Close, Scoresby, Melbourne
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-4 mb-md-0 mb-4 d-flex">
            <div className="con con-3 w-100 py-5">
              <div className="con-info w-100 text-center">
                <div className="icon d-flex align-items-center justify-content-center">
                  <span className="fa fa-inbox" style={{ color: "lightgray" }}></span>
                </div>
                <div className="text">
                  <span
                    style={{
                      color: "lightgray",
                      fontWeight: "1000",
                      fontSize: "15px",
                    }}
                  >
                    strayavisuals@email.com
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Second row of links and subscription form */}
        <div className="row">
          <div className="col-md-7">
            <div className="row" style={{ marginTop: "30px" }}>
              {/* Quick Links */}
              <div className="col-md-4 mb-md-0 mb-4">
                <h2 className="footer-heading">Quick Links</h2>
                <ul className="list-unstyled" style={{ marginBottom: "35px" }}>
                  <li style={{ marginBottom: "10px" }}>
                    <a href="#" className="d-block">
                      Home
                    </a>
                  </li>
                  <li style={{ marginBottom: "10px" }}>
                    <a href="#" className="d-block">
                      Booking
                    </a>
                  </li>
                  <li style={{ marginBottom: "10px" }}>
                    <a href="#" className="d-block">
                      Equipments
                    </a>
                  </li>
                  <li style={{ marginBottom: "10px" }}>
                    <a href="#" className="d-block">
                      About
                    </a>
                  </li>
                  <li style={{ marginBottom: "10px" }}>
                    <a href="#" className="d-block">
                      Contact Us
                    </a>
                  </li>
                </ul>
              </div>

              {/* Packages */}
              <div className="col-md-4 mb-md-0 mb-4">
                <h2 className="footer-heading">Packages</h2>
                <ul className="list-unstyled" style={{ marginBottom: "35px" }}>
                  <li style={{ marginBottom: "10px" }}>
                    <a href="#" className="d-block">
                      Promotional Videos
                    </a>
                  </li>
                  <li style={{ marginBottom: "10px" }}>
                    <a href="#" className="d-block">
                      Music Videos
                    </a>
                  </li>
                  <li style={{ marginBottom: "10px" }}>
                    <a href="#" className="d-block">
                      FHD Videography
                    </a>
                  </li>
                  <li style={{ marginBottom: "10px" }}>
                    <a href="#" className="d-block">
                      Drone Footage
                    </a>
                  </li>
                </ul>
              </div>

              {/* Our Work */}
              <div className="col-md-4 mb-md-0 mb-4">
                <h2 className="footer-heading">Our Work</h2>
                <ul className="list-unstyled" style={{ marginBottom: "35px" }}>
                  <li style={{ marginBottom: "10px" }}>
                    <a href="#" className="d-block">
                      Gallery
                    </a>
                  </li>
                  <li style={{ marginBottom: "10px" }}>
                    <a href="#" className="d-block">
                      Blog
                    </a>
                  </li>
                  <li style={{ marginBottom: "10px" }}>
                    <a href="#" className="d-block">
                      Testimonials
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Subscribe Form */}
          <div className="col-md-5 mb-md-0 mb-4" style={{ marginTop: "30px" }}>
            <h2 className="footer-heading" style={{ marginLeft: "93px" }}>
              Subscribe to Our News Letter
            </h2>
            <form action="#" className="subscribe-form">
              <div className="form-group d-flex" style={{ marginLeft: "95px" }}>
                <input
                  style={{ height: "52px" }}
                  type="text"
                  className="form-control rounded-left"
                  placeholder="Enter your email address"
                />
                <button
                  type="submit"
                  className="form-control submit rounded-right"
                  style={{ width: "180px" }}
                >
                  Subscribe
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Third row: copyright & social links */}
        <div className="row mt-5 pt-4 border-top">
          <div className="col-md-6 col-lg-8 mb-md-0 mb-4">
            <p className="copyright mb-0" style={{ textAlign: "left" }}>
              Copyright © {new Date().getFullYear()} StrayaVisuals |
              All rights reserved.
            </p>
          </div>
          <div className="col-md-6 col-lg-4 text-md-right">
            <ul className="ftco-footer-social p-0">
              <li id="fbi" className="ftco-animate">
                <a
                  data-toggle="tooltip"
                  data-placement="top"
                  title="Facebook"
                  onClick={() =>
                    window.open("https://www.facebook.com/StrayaVisuals", "_blank")
                  }
                >
                  <span className="bi bi-facebook"></span>
                </a>
              </li>
              <li id="ini" className="ftco-animate">
                <a
                  data-toggle="tooltip"
                  data-placement="top"
                  title="Instagram"
                  onClick={() =>
                    window.open("https://www.instagram.com/StrayaVisuals", "_blank")
                  }
                >
                  <span className="bi bi-instagram"></span>
                </a>
              </li>
              <li id="twi" className="ftco-animate">
                <a
                  data-toggle="tooltip"
                  data-placement="top"
                  title="Twitter"
                  onClick={() =>
                    window.open("https://www.x.com/StrayaVisuals", "_blank")
                  }
                >
                  <span className="bi bi-twitter"></span>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
