// src/Contact.jsx
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { db } from "./firebase-config"; // Ensure this points to your Firestore config
import { collection, addDoc } from "firebase/firestore";

import "./css/footer/fonts/ionicons/css/ionicons.min.css";
import "./css/footer/style.css";
import "./css/footer/ionicons.min.css";
import "./css/footer/bootstrap.min.css";
import "./css/contact/bootstrap.min.css";
import "./css/contact/base.css";
import "./css/contact/fonticons.css";
import "./css/contact/font-awesome.min.css";
import facebookIcon from "/images/contact/socials/facebook-icon.png";
import facebookCover from "/images/contact/socials/facebook-cover.jpg";
import facebookProfile from "/images/contact/socials/facebook-profile.jpeg";
import twitterIcon from "/images/contact/socials/twitter-icon.png";
import twitterCover from "/images/contact/socials/twitter-cover.jpg";
import twitterProfile from "/images/contact/socials/twitter-profile.jpeg";
import instagramIcon from "/images/contact/socials/instagram-icon.png";
import instagramCover from "/images/contact/socials/instagram-cover.jpg";
import instagramProfile from "/images/contact/socials/instagram-profile.jpeg";
import logo from '/images/logo.jpeg';

import video1 from "/images/contact/1.mp4";
import video2 from "/images/contact/2.mp4";
import video3 from "/images/contact/3.mp4";

const socialData = [
  {
    id: "fbbox",
    platform: "Facebook",
    username: "@Straya Visuals",
    link: "https://www.facebook.com/StrayaVisuals",
    icon: facebookIcon,
    cover: facebookCover,
    profile: facebookProfile,
  },
  {
    id: "instbox",
    platform: "Instagram",
    username: "@Straya_Visuals",
    link: "https://www.instagram.com/StrayaVisuals",
    icon: instagramIcon,
    cover: instagramCover,
    profile: instagramProfile,
  },
  {
    id: "twtbox",
    platform: "Twitter",
    username: "@Straya Visuals AU",
    link: "https://www.x.com/StrayaVisuals",
    icon: twitterIcon,
    cover: twitterCover,
    profile: twitterProfile,
  },
];

const Contact = () => {
  const videos = [video1, video2, video3];
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [slideDirection, setSlideDirection] = useState("next");
  const [isFading, setIsFading] = useState(false);
  const videoRefs = useRef([]);
  const observerRef = useRef(null);
  const intervalRef = useRef(null);

  const startAutoPlay = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      changeVideo((prevIndex) => (prevIndex + 1) % videos.length, "next");
    }, 6000);
  }, []);

  const changeVideo = useCallback((index, direction, resetTimer = true) => {
    setIsFading(true);
    setTimeout(() => {
      setSlideDirection(direction);
      setCurrentVideoIndex(index);
      setIsFading(false);
      if (resetTimer) {
        startAutoPlay();
      }
    }, 500);
  }, [startAutoPlay]);

  useEffect(() => {
    startAutoPlay();
    return () => clearInterval(intervalRef.current);
  }, [startAutoPlay]);

  const handleDotClick = (index) => {
    clearInterval(intervalRef.current);
    changeVideo(index, index > currentVideoIndex ? "next" : "prev", false);
    setTimeout(() => {
      startAutoPlay();
    }, 100);
  };

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            entry.target.pause();
          } else {
            entry.target.play();
          }
        });
      },
      { threshold: 0.1 }
    );

    videoRefs.current.forEach((video) => {
      if (video) observerRef.current.observe(video);
    });

    return () => {
      videoRefs.current.forEach((video) => {
        if (video) observerRef.current.unobserve(video);
      });
    };
  }, [currentVideoIndex]);

  const [eventType, setEventType] = useState("");
  const [otherEvent, setOtherEvent] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    eventDate: "",
    eventTime: "",
    eventLocation: "",
    eventBudget: "",
    specialRequests: "",
  });

  const dateInputRef = useRef(null);
  const timeInputRef = useRef(null);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEventTypeChange = (e) => {
    setEventType(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const newFormData = {
      ...formData,
      eventType,
      otherEvent,
      submittedAt: new Date().toLocaleString()
    };

    try {
      // Add a new document to Firestore in the "contactMessages" collection
      await addDoc(collection(db, "contactMessages"), newFormData);

      

      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 3000);
      alert("Form submitted successfully!");

      setFormData({
        name: "",
        email: "",
        eventDate: "",
        eventTime: "",
        eventLocation: "",
        eventBudget: "",
        specialRequests: "",
      });
      setEventType("");
      setOtherEvent("");
    } catch (error) {
      console.error("Error submitting form: ", error);
      alert("Submission failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (dateInputRef.current) {
      dateInputRef.current.addEventListener("click", () => {
        dateInputRef.current.showPicker();
      });
    }

    if (timeInputRef.current) {
      timeInputRef.current.addEventListener("click", () => {
        timeInputRef.current.showPicker();
      });
    }
  }, []);

  useEffect(() => {
    const ratesSection = document.querySelector('.rates-section-contact');
    const ratesObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.8 });

    if (ratesSection) {
      ratesObserver.observe(ratesSection);
    }

    const socialsSection = document.querySelector('.socials-container-contact');

    if (!socialsSection) return;

    const socialObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            requestAnimationFrame(() => {
              entry.target.classList.add('in-view');
            });
            socialObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.4 }
    );

    socialObserver.observe(socialsSection);

    return () => {
      socialObserver.disconnect();
    };
  }, []);

  return (
    <div>      
      <div className="image-container-contact">
        <div className="video-wrapper">
          <video
            ref={(el) => (videoRefs.current[currentVideoIndex] = el)}
            src={videos[currentVideoIndex]}
            autoPlay
            muted
            loop
            playsInline
            className={`carousel-video ${slideDirection === "next" ? "slide-next" : "slide-prev"} ${
              isFading ? "fade-out" : "fade-in"
            }`}
          />
        </div>
        <div className="image-text-contact">
          Recording your memories, preserving them forever.
        </div>
        <div className="video-indicators">
          {videos.map((_, index) => (
            <div
              key={index}
              className={`dot ${currentVideoIndex === index ? "active" : ""}`}
              onClick={() => handleDotClick(index)}
            />
          ))}
        </div>
      </div>

      <div className="textbox-header-contact">Why Choose Us?</div>

      <div id="quality-container" className="container" style={{ marginTop: "45px", minWidth: "1440px" }}>
        <div className="row text-center">
          {[
            { icon: "fa-money", text: "Affordable Packages" },
            { icon: "fa-clock", text: "Fast Turnaround Time" },
            { icon: "fa-certificate", text: "Experienced Team" },
          ].map((item, index) => (
            <div key={index} className="col-sm-4" style={{ marginBottom: "10px" }}>
              <div>
                <div>
                  <i id="quality-icons" className={`fa ${item.icon}`}></i>
                </div>
                <h3 id="quality-points">{item.text}</h3>
              </div>
            </div>
          ))}
        </div>
        <div className="row text-center" style={{ marginTop: "30px" }}>
          {[
            { icon: "fa-star", text: "High-Quality Videography" },
            { icon: "fa-pencil-square", text: "Professional Editing" },
            { icon: "fa-video-camera", text: "Class-Leading Equipments" },
          ].map((item, index) => (
            <div key={index} className="col-sm-4">
              <div>
                <div>
                  <i id="quality-icons" className={`fa ${item.icon}`}></i>
                </div>
                <h3 id="quality-points">{item.text}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>

      <section className="rates-section-contact">
        <div className="rates-title-contact">Our Starting Rates</div>
        <div className="vertical-line-contact"></div>
        <div className="rates-list-contact">
          <p>Photography - From AUD 1,000 Onwards</p>
          <p>Event Films - From AUD 1,500 Onwards</p>
          <p>Photo + Video - From AUD 2,500 Onwards</p>
        </div>
      </section>

      <div className="cta-container-contact">
        <div className="line-contact"></div>
        <div className="cta-text-contact">Any Questions? Feel free to ask us below, our team will get in touch with you as soon as we can!</div>
        <div className="line-contact"></div>
      </div>

      <section className="contact-form-section-contact">
        <form className="contact-form-contact" onSubmit={handleSubmit}>
          <label htmlFor="name">Your Name *</label>
          <input type="text" id="name" name="name" placeholder="Enter your name" value={formData.name}
                 onChange={handleInputChange} required/>

          <label htmlFor="email">Your Email *</label>
          <input type="email" id="email" name="email" placeholder="Enter your email" value={formData.email}
                 onChange={handleInputChange} required/>

          {/* <label htmlFor="event-type">Type of Your Event *</label>
          <select id="event-type" name="event-type" value={eventType} onChange={handleEventTypeChange} required>
            <option value="" disabled>Select the type of your event</option>
            <option value="wedding">Wedding</option>
            <option value="birthday">Birthday</option>
            <option value="engagement">Engagement</option>
            <option value="gender-reveal">Gender Reveal</option>
            <option value="concert">Concert</option>
            <option value="get-together">Get Together</option>
            <option value="convocation">Convocation</option>
            <option value="school-event">School Event</option>
            <option value="office-event">Office Event</option>
            <option value="other">Other</option>
          </select>

          {eventType === "other" && (
              <div id="other-event-container">
                <label htmlFor="other-event">Please Specify</label>
                <input type="text" id="other-event" name="other-event" placeholder="Specify your event"
                       value={otherEvent} onChange={(e) => setOtherEvent(e.target.value)} required/>
              </div>
          )}

          <div className="date-time-container-contact">
            <div>
              <label htmlFor="event-date">Date of the Event *</label>
              <input ref={dateInputRef} type="date" id="event-date" name="eventDate" value={formData.eventDate}
                     onChange={handleInputChange} required/>
            </div>
            <div>
              <label htmlFor="event-time">Time of the Event *</label>
              <input ref={timeInputRef} type="time" id="event-time" name="eventTime" value={formData.eventTime}
                     onChange={handleInputChange} required/>
            </div>
          </div>

          <div className="location-budget-container-contact">
            <div>
              <label htmlFor="event-location">Location of the Event *</label>
              <input type="text" id="event-location" name="eventLocation" placeholder="Enter location"
                     value={formData.eventLocation} onChange={handleInputChange} required/>
            </div>
            <div>
              <label htmlFor="event-budget">Your Budget *</label>
              <input type="number" id="event-budget" name="eventBudget" placeholder="Enter your approximate budget"
                     min="0" value={formData.eventBudget} onChange={handleInputChange} required/>
            </div>
          </div> */}

          <label htmlFor="special-requests">What do you have in mind?</label>
          <textarea id="special-requests" name="specialRequests"
                    placeholder="Don’t hesitate to ask, We’ll do our best to fulfill your wishes!"
                    value={formData.specialRequests} onChange={handleInputChange}></textarea>

          <button type="submit" className="send-button-contact" disabled={loading}>
            {loading ? (
                <>
                  Sending <i className="fa fa-spinner fa-spin" style={{marginLeft: "10px"}}></i>
                </>
            ) : (
                <>
                  Send Now <i className="fa fa-send" style={{marginLeft: "10px"}}></i>
                </>
            )}
          </button>

          {submitted && <p className="success-message">Your message has been sent!</p>}
        </form>
      </section>

      <div className="socials-header-contact">
        <div className="line-social-contact"></div>
        <div className="socials-text-contact">Contact Us on Socials</div>
        <div className="line-social-contact"></div>
      </div>

      <div className="socials-container-contact">
        {socialData.map((social, index) => (
            <div key={index} id={social.id} className="social-box-contact"
                 onClick={() => window.open(social.link, "_blank")}>
              <img className="social-icon-contact" src={social.icon} alt={`${social.platform} Icon`}/>
              <div className="social-content-contact">
                <img className="landscape-image-contact" src={social.cover} alt={`${social.platform} Cover`}/>
                <img className="profile-image-contact" src={social.profile} alt={`${social.platform} Profile`}/>
              </div>
              <div className="social-username-contact">{social.username}</div>
            </div>
        ))}
      </div>      
    </div>
  );
};

export default Contact;