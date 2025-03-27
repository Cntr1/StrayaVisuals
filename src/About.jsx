// src/About.jsx
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, Button, Container, Row, Col, Nav } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "./portfolio.css"; // Custom CSS for styling
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {  faYoutube,  faVimeoV,  faInstagram,} from "@fortawesome/free-brands-svg-icons";

const HeroSection = () => {
  return (
    <div className="hero-section">
      <motion.div
        className="hero-content"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1>CINEMATIC STORYTELLING</h1>
        <h2>Through the Lens of Innovation</h2>
        <p>FPV Specialist • Drone Operator • CASA-Licensed</p>
        <Button variant="outline-light" className="hero-button">
          Discover Our Work
        </Button>
      </motion.div>
      <div className="hero-overlay"></div>
      <video className="hero-video" autoPlay loop muted playsInline>
        <source src="../assets/v2.mp4" type="video/mp4" />
      </video>
    </div>
  );
};

const About = () => {
  // You can rename the Portfolio component to About if it's serving as your about page.
  // For demonstration, assume the remaining content is your main About page content.
  // Remove the Header and Footer blocks that were originally in this file.
  const [activeCard, setActiveCard] = useState(null);
  const [scrollPosition, setScrollPosition] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.scrollY);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const sections = [
    {
      title: "Meet Your UGC Creators",
      content:
        "Welcome to STRAYA VISUALS.... The Creative hub for high-quality videography and content creation! ...",
      image: "../assets/im1.png",
      category: "about",
    },
    {
      title: "With Breathtaking Bird's Eye View Captures",
      content:
        "With a deep passion for storytelling and cutting-edge video techniques, ...",
      image: "../assets/im2.jpg",
      category: "drone",
    },
    {
      title: "Working on FPV Build",
      content:
        "Over the past few weeks, I’ve been working on my first FPV build ...",
      video: "../assets/v2.mp4",
      category: "fpv",
    },
    {
      title: "Elevating Real Estate with Dynamic Videography",
      content: "Bringing spaces to life through immersive visuals, ...",
      video: "../assets/v3.mp4",
      category: "real-estate",
    },
  ];

  const [filter, setFilter] = useState("all");
  const filteredSections =
    filter === "all"
      ? sections
      : sections.filter((section) => section.category === filter);

  return (
    <div className="portfolio-container">
      <HeroSection />
      <Container fluid className="content-container">
        <motion.div
          className="section-title"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2>Our Work</h2>
          <div className="glowing-line"></div>
        </motion.div>
        <div className="filter-container">
          <Button
            variant={filter === "all" ? "glow" : "outline-light"}
            onClick={() => setFilter("all")}
            className="filter-button"
          >
            All
          </Button>
          <Button
            variant={filter === "drone" ? "glow" : "outline-light"}
            onClick={() => setFilter("drone")}
            className="filter-button"
          >
            Drone
          </Button>
          <Button
            variant={filter === "fpv" ? "glow" : "outline-light"}
            onClick={() => setFilter("fpv")}
            className="filter-button"
          >
            FPV
          </Button>
          <Button
            variant={filter === "real-estate" ? "glow" : "outline-light"}
            onClick={() => setFilter("real-estate")}
            className="filter-button"
          >
            Real Estate
          </Button>
        </div>
        <Row className="portfolio-grid">
          <AnimatePresence>
            {filteredSections.map((section, index) => (
              <motion.div
                key={index}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4 }}
                className="col-md-6 mb-4"
              >
                <motion.div
                  className="portfolio-card"
                  whileHover={{
                    y: -10,
                    boxShadow: "0 15px 30px rgba(0, 200, 255, 0.2)",
                  }}
                  onClick={() =>
                    setActiveCard(activeCard === index ? null : index)
                  }
                >
                  <div className="card-media">
                    {section.image && (
                      <img
                        src={section.image}
                        alt={section.title}
                        className="card-image"
                      />
                    )}
                    {section.video && (
                      <video
                        className="card-video"
                        loop
                        muted
                        autoPlay
                        playsInline
                      >
                        <source src={section.video} type="video/mp4" />
                      </video>
                    )}
                    <div className="card-overlay"></div>
                  </div>
                  <div className="card-content">
                    <h3>{section.title}</h3>
                    <p className={activeCard === index ? "expanded" : ""}>
                      {section.content}
                    </p>
                    <div className="card-category">{section.category}</div>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </AnimatePresence>
        </Row>
      </Container>
      <div className="cta-section">
        <motion.div
          className="cta-content"
          initial={{ opacity: 0 }}
          animate={{
            opacity: 1,
            y: scrollPosition > 300 ? 0 : 50,
          }}
          transition={{ duration: 0.6 }}
        >
          <h2>Ready to Elevate Your Brand?</h2>
          <p>Let's create cinematic stories that captivate your audience</p>
          <Button variant="glow" size="lg" className="cta-button">
            Start Your Project
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default About;
