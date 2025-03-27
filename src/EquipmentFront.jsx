import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import "./css/footer/ionicons.min.css";
import "./css/footer/bootstrap.min.css";
import "./css/footer/style.css";
import "./css/footer/fonts/ionicons/css/ionicons.min.css";
import "./EquipmentFront.css";
import logo from "/images/logo.jpeg";

const EquipmentFront = () => {
  const [videoMuteStates, setVideoMuteStates] = useState(
    Array(5).fill(true), // Initially, all videos are muted
  );

  const toggleMute = (index) => {
    setVideoMuteStates((prevState) => {
      const updatedStates = [...prevState];
      updatedStates[index] = !updatedStates[index]; // Toggle mute state
      return updatedStates;
    });
  };

  const handleMouseEnter = (event, index) => {
    event.target.muted = videoMuteStates[index]; // Apply mute state dynamically
    event.target.play();
  };

  const handleMouseLeave = (event) => {
    event.target.pause();
    event.target.currentTime = 0;
  };

  const videos = [
    { src: "/VID-1.mp4", overlay: "Sony FX6 - Dynamic 4K Cinematic Shots" },
    { src: "/VID-2.mp4", overlay: "DJI Ronin 4D - Smooth Gimbal Footage" },
    { src: "/VID-3.mp4", overlay: "RED Komodo - Ultimate 6K Resolution" },
    { src: "/VID-5.mp4", overlay: "Blackmagic 6K - Pro Filmmaking" },
    { src: "/VID-6.mp4", overlay: "Aputure 600d - Professional Lighting" },
  ];

  const brands = [
    { name: "Sony", logo: "/brand-1.png" },
    { name: "DJI", logo: "/brand-3.png" },
    { name: "Canon", logo: "/brand-4.png" },
    { name: "Manfrotto", logo: "brand-2.webp" },
    { name: "Rode", logo: "/brand-7.jpg" },

    { name: "Aputure", logo: "/brand-5.jpg" },
    { name: "Zhiyun", logo: "/brand-6.jpg" },
    { name: "Sony", logo: "/brand-1.png" },
    { name: "DJI", logo: "/brand-3.png" },
    { name: "Canon", logo: "/brand-4.png" },
    { name: "Manfrotto", logo: "brand-2.webp" },
    { name: "Rode", logo: "/brand-7.jpg" },

    { name: "Aputure", logo: "/brand-5.jpg" },
    { name: "Zhiyun", logo: "/brand-6.jpg" },
  ];

  // Equipment posts data
  const equipmentPosts = [
    {
      img: "/img-12.jpg",
      title: "Manfrotto 504X Tripod System",
      caption: "Stability meets flexibility.",
      details:
        "Heavy-duty tripod with smooth fluid head for professional video production.",
      specs: "Max Height 173cm | Load Capacity 12kg | Fluid Drag System",
      category: "Tripods",
      weight: "6.2 kg",
    },
    {
      img: "/img-1.jpg",
      title: "Sony FX6 Cinema Camera",
      caption: "Carry less. Capture more.",
      details:
        "Compact 4K cinema camera with exceptional low-light performance.",
      specs: "4K 120fps | Full-Frame Sensor | 15+ Stops Dynamic Range",
      category: "Cameras",
      weight: "0.89 kg",
    },
    {
      img: "/2-img.jpg",
      title: "DJI Ronin 4D",
      caption: "Steady shots, cinematic perfection.",
      details:
        "Advanced gimbal camera with 4-axis stabilization for smooth footage.",
      specs: "Full-Frame 6K | LiDAR Focusing | 4-Axis Stabilization",
      category: "Stabilizers",
      weight: "1.3 kg",
    },
    {
      img: "/img-3.jpg",
      title: "Canon EOS R5 C",
      caption: "Shoot. Create. Elevate.",
      details:
        "Hybrid cinema and photography camera with 8K RAW video support.",
      specs: "8K 30fps RAW | Dual Pixel Autofocus | Active Cooling System",
      category: "Cameras",
      weight: "0.77 kg",
    },
    {
      img: "/img-4.webp",
      title: "Aputure LS 600d Pro",
      caption: "Shine brighter, shoot better.",
      details: "High-power LED light for professional video production.",
      specs: "600W Output | 5600K Daylight | Weather-Resistant",
      category: "Lighting",
      weight: "4.5 kg",
    },
    {
      img: "/img-5.avif",
      title: "Sennheiser MKE 600",
      caption: "Hear every word, capture every moment.",
      details:
        "Directional shotgun microphone for crystal-clear audio recording.",
      specs: "Supercardioid | Low-Cut Filter | 150 Hz - 20 kHz",
      category: "Audio",
      weight: "128 g",
    },
    {
      img: "/img-6.jpg",
      title: "Blackmagic Pocket 6K Pro",
      caption: "Powerful cinematic imaging in your hands.",
      details: "Compact and feature-packed cinema camera with 6K resolution.",
      specs: "6K 50fps | Super 35 Sensor | Built-in ND Filters",
      category: "Cameras",
      weight: "1.2 kg",
    },
    {
      img: "/img-7.jpg",
      title: "Zhiyun Crane 3S",
      caption: "Strong, Smooth, Smart.",
      details: "Heavy-duty gimbal designed for professional cinema cameras.",
      specs: "Payload 6.5kg | Extendable Arm | SmartSling Handle",
      category: "Stabilizers",
      weight: "2.4 kg",
    },
    {
      img: "/img-8.webp",
      title: "Nanlite Forza 500",
      caption: "Bright ideas, brilliant lighting.",
      details: "Portable LED light with high power output and color accuracy.",
      specs: "500W Output | 5600K Daylight | CRI 98",
      category: "Lighting",
      weight: "2.6 kg",
    },
    {
      img: "/img-9.webp",
      title: "Zoom H6 Handy Recorder",
      caption: "Capture every sound, everywhere.",
      details: "Versatile audio recorder with interchangeable mic capsules.",
      specs: "6-Track Recording | X/Y & Mid-Side Mics | 24-bit/96kHz",
      category: "Audio",
      weight: "280 g",
    },
    {
      img: "/img-10.webp",
      title: "Sony G Master 24-70mm f/2.8",
      caption: "Ultimate sharpness, exceptional versatility.",
      details:
        "Professional zoom lens for high-resolution photography and video.",
      specs: "24-70mm | f/2.8 Constant Aperture | Nano AR Coating",
      category: "Lenses",
      weight: "886 g",
    },
    {
      img: "/img-11.png",
      title: "Rode NTG3 Shotgun Microphone",
      caption: "Broadcast-quality sound, anytime, anywhere.",
      details: "Directional shotgun microphone with superior audio clarity.",
      specs: "Supercardioid | RF-Bias Technology | 40 Hz - 20 kHz",
      category: "Audio",
      weight: "163 g",
    },
  ];

  const [currentPost, setCurrentPost] = useState(0);
  const prevPost = () =>
    setCurrentPost((prev) =>
      prev === 0 ? equipmentPosts.length - 1 : prev - 1,
    );
  const nextPost = () =>
    setCurrentPost((prev) =>
      prev === equipmentPosts.length - 1 ? 0 : prev + 1,
    );

  const [selectedEquipment, setSelectedEquipment] = useState(null);
  const handleImageClick = (index) =>
    setSelectedEquipment(equipmentPosts[index]);

  const brandContainerRef = useRef(null);

  const scrollBrands = (direction) => {
    if (brandContainerRef.current) {
      const scrollAmount = 200; // Adjust this value for smooth scrolling
      brandContainerRef.current.scrollLeft +=
        direction === "left" ? -scrollAmount : scrollAmount;
    }
  };

  return (
    <div className="content-container">
      <div
        className="content-box"
        style={{
          marginTop: "0px",
          marginRight: "auto",
          marginLeft: "auto",
          paddingRight: "50px",
          paddingLeft: "50px",
          width: "100%",
        }}
      >
        <h1 className="main-title">
          Discover the <br />
          <span className="highlight">Best Equipment</span> for Your <br /> Next
          Shoot
        </h1>
        <h2 className="sub-title">
          High-quality gear <br />
          for professional video production
        </h2>
      </div>

      {/* Equipment Section (No Changes Here) */}
      <div className="equipment-section">
        <button className="equipment-nav left" onClick={prevPost}>
          ❮
        </button>
        <div className="equipment-post">
          <div className="equipment-image-container">
            <img
              src={equipmentPosts[currentPost].img}
              alt={equipmentPosts[currentPost].title}
              className="equipment-img"
            />
          </div>
          <div className="equipment-details-container">
            <h3 className="equipment-title">
              {equipmentPosts[currentPost].title}
            </h3>
            <p className="equipment-caption">
              "{equipmentPosts[currentPost].caption}"
            </p>
            <p className="equipment-details">
              {equipmentPosts[currentPost].details}
            </p>
          </div>
        </div>
        <button className="equipment-nav right" onClick={nextPost}>
          ❯
        </button>
      </div>

      {/* Equipment Gallery Section with More Details */}
      <div className="equipment-gallery">
        <h2 className="gallery-title">Explore Our Equipment Collection</h2>
        <div
          className="gallery-container"
          style={{ width: "95%", marginRight: "auto", marginLeft: "auto" }}
        >
          {equipmentPosts.map((post, index) => (
            <div
              key={index}
              className="gallery-item"
              onClick={() => handleImageClick(index)}
            >
              <img src={post.img} alt={post.title} className="gallery-image" />
              <div className="gallery-info">
                <h4>{post.title}</h4>
                <p>{post.details}</p>
              </div>
            </div>
          ))}
        </div>

        {selectedEquipment && (
          <div className="equipment-details-modal">
            <h3 className="equipment-title">{selectedEquipment.title}</h3>
            <p className="equipment-caption">"{selectedEquipment.caption}"</p>
            <p className="equipment-details">{selectedEquipment.details}</p>
            <p className="equipment-specs">
              <strong>Specifications:</strong> {selectedEquipment.specs}
            </p>
            <p className="equipment-category">
              <strong>Category:</strong> {selectedEquipment.category}
            </p>
            <p className="equipment-weight">
              <strong>Weight:</strong> {selectedEquipment.weight}
            </p>
            <button
              onClick={() => setSelectedEquipment(null)}
              className="close-modal"
            >
              Close
            </button>
          </div>
        )}

        {/* 🔥 Creative Video Section */}
        <div className="video-header" style={{ marginTop: "30px" }}>
          <h2 style={{ marginTop: "20px" }}>Experience Cinematic Brilliance</h2>
          <p>Explore high-quality video equipment and see them in action.</p>
        </div>

        <div className="video-section">
          <div className="video-container-equipment">
            {videos.map((video, index) => (
              <div className="video-card" key={index}>
                <button
                  className="mute-button"
                  onClick={() => toggleMute(index)}
                >
                  {videoMuteStates[index] ? "🔇 Mute" : "🔊 Unmute"}
                </button>
                <video
                  src={video.src}
                  loop
                  muted={videoMuteStates[index]}
                  onMouseEnter={(event) => handleMouseEnter(event, index)}
                  onMouseLeave={handleMouseLeave}
                ></video>

                <div className="video-overlay">{video.overlay}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Brands Section */}
        <div className="brands-section">
          <h2 className="brands-title">
            Explore Our Trusted Brands – Quality Equipment for Your Perfect Shot
          </h2>
          <div className="brands-wrapper">
            <button
              className="brand-nav left"
              onClick={() => scrollBrands("left")}
            >
              &#10094;
            </button>
            <div className="brands-container" ref={brandContainerRef}>
              {brands.map((brand, index) => (
                <div key={index} className="brand-card">
                  <img
                    src={brand.logo}
                    alt={brand.name}
                    className="brand-logo"
                  />
                </div>
              ))}
            </div>
            <button
              className="brand-nav right"
              onClick={() => scrollBrands("right")}
            >
              &#10095;
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EquipmentFront;
