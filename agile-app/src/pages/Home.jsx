import React from "react";
import { Link } from "react-router-dom";
import "./Home.css";
import logo from './images/logo.jpeg'

const Home = () => {
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
              <li><Link to="/" id="selected">Home</Link></li>
              <li><Link to="/booking">Booking</Link></li>
              <li><Link to="/equipment">Equipment</Link></li>
              <li><Link to="/about">About</Link></li>
              <li><Link to="/contact">Contact Us</Link></li>
            </div>
            <div className="nav-profile">
              <li><Link to="/profile"><i className="fa fa-user"></i></Link></li>
            </div>
          </ul>
        </nav>

        <div className="container py-5">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <div className="bg-white p-4 rounded-4 shadow-sm border">
                <img src="/logo.jpeg" alt="Straya Visuals Logo" className="mb-4 mx-auto d-block"
                     style={{width: "180px"}}/>
                <p className="text-dark text-center">
                  With over [X years] of experience in the world of videography, we specialize in capturing compelling
                  stories through the lens.
                  Our passion lies in creating visually stunning and emotionally engaging content that resonates with
                  audiences. Whether it's a
                  corporate video, a wedding, a documentary, or a creative short film, we bring a unique blend of
                  technical expertise, artistic
                  vision, and attention to detail to every project.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Picture Blocks Section */}
        <div className="container py-5">
          <div className="row justify-content-center g-4">
            {/* First Picture Block */}
            <div className="col-md-6 col-lg-5">
              <div
                  className="bg-white rounded-4 shadow-sm overflow-hidden hover-scale"
                  style={{aspectRatio: "1/1"}}
              >
                <img
                    src="https://tinyurl.com/image2121"
                    alt="Picture 1"
                    className="img-fluid w-100 h-100"
                    style={{objectFit: "cover"}}
                />
              </div>
            </div>

            {/* Second Picture Block */}
            <div className="col-md-6 col-lg-5">
              <div
                  className="bg-white rounded-4 shadow-sm overflow-hidden hover-scale"
                  style={{aspectRatio: "1/1"}}
              >
                <img
                    src="https://tinyurl.com/image2122"
                    alt="Picture 2"
                    className="img-fluid w-100 h-100"
                    style={{objectFit: "cover"}}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Client Reviews Carousel */}
        <div className="bg-warning py-5" style={{background: 'linear-gradient(to right, #e9ab40, #ccb089)'}}>
          <div className="container">
            <h2 className="fw-bold text-center mb-4">CLIENT REVIEWS</h2>
            <div id="clientReviewsCarousel" className="carousel slide" data-bs-ride="carousel">
              <div className="carousel-inner">
                {/* Review 1 */}
                <div className="carousel-item active">
                  <div className="bg-white p-4 rounded-4 shadow-sm text-center mx-auto" style={{maxWidth: "800px"}}>
                    <p className="fst-italic fs-5">"Slinky were very professional, on-time, knowledgeable and worked
                      hard to make sure the production was a success."</p>
                    <p className="text-muted">- Occupancy Unknown</p>
                  </div>
                </div>

                {/* Review 2 */}
                <div className="carousel-item">
                  <div className="bg-white p-4 rounded-4 shadow-sm text-center mx-auto" style={{maxWidth: "800px"}}>
                    <p className="fst-italic fs-5">"Amazing work! The team was very creative and delivered beyond our
                      expectations."</p>
                    <p className="text-muted">- Happy Client</p>
                  </div>
                </div>

                {/* Review 3 */}
                <div className="carousel-item">
                  <div className="bg-white p-4 rounded-4 shadow-sm text-center mx-auto" style={{maxWidth: "800px"}}>
                    <p className="fst-italic fs-5">"Highly recommend StrayaVisuals for their professionalism and
                      attention to detail."</p>
                    <p className="text-muted">- Satisfied Customer</p>
                  </div>
                </div>
              </div>

              {/* Carousel Controls */}
              <button
                  className="carousel-control-prev"
                  type="button"
                  data-bs-target="#clientReviewsCarousel"
                  data-bs-slide="prev"
              >
                <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                <span className="visually-hidden">Previous</span>
              </button>
              <button
                  className="carousel-control-next"
                  type="button"
                  data-bs-target="#clientReviewsCarousel"
                  data-bs-slide="next"
              >
                <span className="carousel-control-next-icon" aria-hidden="true"></span>
                <span className="visually-hidden">Next</span>
              </button>
            </div>
          </div>
        </div>

        <footer className="footer-10" style={{minHeight: "654px"}}>
          <div className="container" style={{minWidth: "1440px"}}>
            <div className="row mb-5 pb-3 no-gutters" style={{marginTop: "30px"}}>
              {[
                {icon: "fa-phone", text: "+(61) 451 782 030 | +(61) 451 782 982"},
                {icon: "fa-location-arrow", text: "4 Karabil Close, Scoresby, Melbourne"},
                {icon: "fa-inbox", text: "strayavisuals@email.com"}
              ].map((item, index) => (
                  <div key={index} className="col-md-4 mb-md-0 mb-4 d-flex">
                    <div className={`con con-${index + 1} w-100 py-5`}>
                      <div className="con-info w-100 text-center">
                        <div className="icon d-flex align-items-center justify-content-center">
                          <span className={`fa ${item.icon}`} style={{color: "lightgray"}}></span>
                        </div>
                        <div className="text">
                          <span style={{color: "lightgray", fontWeight: "1000", fontSize: "15px"}}>{item.text}</span>
                        </div>
                      </div>
                    </div>
                  </div>
              ))}
            </div>

            <div className="row">
              <div className="col-md-7">
                <div className="row" style={{marginTop: "30px"}}>
                  {[
                    {heading: "Quick Links", links: ["Home", "Booking", "Equipments", "About", "Contact Us"]},
                    {
                      heading: "Packages",
                      links: ["Promotional Videos", "Music Videos", "FHD Videography", "Drone Footage"]
                    },
                    {heading: "Our Work", links: ["Gallery", "Blog", "Testimonials"]}
                  ].map((section, index) => (
                      <div key={index} className="col-md-4 mb-md-0 mb-4">
                        <h2 className="footer-heading">{section.heading}</h2>
                        <ul className="list-unstyled" style={{marginBottom: "35px"}}>
                          {section.links.map((link, idx) => (
                              <li style={{marginBottom: "10px"}} key={idx}><a href="#" className="d-block">{link}</a>
                              </li>
                          ))}
                        </ul>
                      </div>
                  ))}
                </div>
              </div>

              <div className="col-md-5 mb-md-0 mb-4" style={{marginTop: "30px"}}>
                <h2 className="footer-heading" style={{marginLeft: "93px"}}>Subscribe to Our News Letter</h2>
                <form action="#" className="subscribe-form">
                  <div className="form-group d-flex" style={{marginLeft: "95px"}}>
                    <input style={{height: "52px"}} type="text" className="form-control rounded-left"
                           placeholder="Enter your email address"/>
                    <button type="submit" className="form-control submit rounded-right"
                            style={{width: "180px"}}>Subscribe
                    </button>
                  </div>
                </form>
              </div>
            </div>

            <div className="row mt-5 pt-4 border-top">
              <div className="col-md-6 col-lg-8 mb-md-0 mb-4">
                <p className="copyright mb-0" style={{textAlign: "left"}}>
                  Copyright &copy; {new Date().getFullYear()} StrayaVisuals | All rights reserved.
                </p>
              </div>
              <div className="col-md-6 col-lg-4 text-md-right">
                <ul className="ftco-footer-social p-0">
                  {[
                    {
                      id: "fbi",
                      platform: "Facebook",
                      link: "https://www.facebook.com/StrayaVisuals",
                      icon: "bi-facebook"
                    },
                    {
                      id: "ini",
                      platform: "Instagram",
                      link: "https://www.instagram.com/StrayaVisuals",
                      icon: "bi-instagram"
                    },
                    {id: "twi", platform: "Twitter", link: "https://www.x.com/StrayaVisuals", icon: "bi-twitter"}
                  ].map((social, index) => (
                      <li key={index} id={social.id} className="ftco-animate">
                        <a onClick={() => window.open(social.link, "_blank")} data-toggle="tooltip"
                           data-placement="top" title={social.platform}>
                          <span className={`bi ${social.icon}`}></span>
                        </a>
                      </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </footer>
      </div>
  );
};

export default Home;

