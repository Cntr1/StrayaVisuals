// src/Homepage/HomePageItems.jsx
import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js"; 
// No need to import Link since the embedded nav is removed

const StrayaVisualsHome = () => {
  return (
    // Removed bg-light and inline gradient; the universal background from App.jsx applies
    <div className="min-vh-100">
      {/* Hero Section */}
      <div className="position-relative w-100" style={{ height: "75vh" }}>
        <video autoPlay loop muted className="position-relative w-100 h-100" style={{ objectFit: "cover" }}>
          <source src="/HeroVideo1.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="position-absolute top-0 start-0 w-100 h-100 custom-overlay"></div>

        <div className="position-absolute top-50 start-50 translate-middle text-center">
          <h1 className="text-white display-4 fw-bold">Straya Visuals</h1>
          <p className="text-white lead">Capturing Moments, Creating Memories</p>
        </div>
      </div>

      {/* About Section */}
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className="bg-white p-4 rounded-4 shadow-sm border">
              <img src="/StrayaVisualsLogo.jpg" alt="Straya Visuals Logo" className="mb-4 mx-auto d-block" style={{ width: "180px" }} />
              <p className="text-dark text-center">
                With over [X years] of experience in the world of videography, we specialize in capturing compelling stories through the lens.
                Our passion lies in creating visually stunning and emotionally engaging content that resonates with audiences. Whether it's a
                corporate video, a wedding, a documentary, or a creative short film, we bring a unique blend of technical expertise, artistic
                vision, and attention to detail to every project.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Picture Blocks */}
      <div className="container py-5">
        <div className="row justify-content-center g-4">
          {/* Picture Block 1 */}
          <div className="col-md-6 col-lg-5">
            <div
              className="bg-white rounded-4 shadow-sm overflow-hidden hover-scale"
              style={{ aspectRatio: "1/1" }}
            >
              <img
                src="https://tinyurl.com/image2121" // Replace with actual image URL
                alt="Picture 1"
                className="img-fluid w-100 h-100"
                style={{ objectFit: "cover" }}
              />
            </div>
          </div>

          {/* Picture Block 2 */}
          <div className="col-md-6 col-lg-5">
            <div
              className="bg-white rounded-4 shadow-sm overflow-hidden hover-scale"
              style={{ aspectRatio: "1/1" }}
            >
              <img
                src="https://tinyurl.com/image2122" // Replace with actual image URL
                alt="Picture 2"
                className="img-fluid w-100 h-100"
                style={{ objectFit: "cover" }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Client Reviews */}
      <div className="bg-warning py-5" style={{ background: 'linear-gradient(to right, #e9ab40, #ccb089)' }}>
        <div className="container">
          <h2 className="fw-bold text-center mb-4">CLIENT REVIEWS</h2>
          <div id="clientReviewsCarousel" className="carousel slide" data-bs-ride="carousel">
            <div className="carousel-inner">
              {/* Review 1 */}
              <div className="carousel-item active">
                <div className="bg-white p-4 rounded-4 shadow-sm text-center mx-auto" style={{ maxWidth: "800px" }}>
                  <p className="fst-italic fs-5">"Slinky were very professional, on-time, knowledgeable and worked hard to make sure the production was a success."</p>
                  <p className="text-muted">- Occupancy Unknown</p>
                </div>
              </div>

              {/* Review 2 */}
              <div className="carousel-item">
                <div className="bg-white p-4 rounded-4 shadow-sm text-center mx-auto" style={{ maxWidth: "800px" }}>
                  <p className="fst-italic fs-5">"Amazing work! The team was very creative and delivered beyond our expectations."</p>
                  <p className="text-muted">- Happy Client</p>
                </div>
              </div>

              {/* Review 3 */}
              <div className="carousel-item">
                <div className="bg-white p-4 rounded-4 shadow-sm text-center mx-auto" style={{ maxWidth: "800px" }}>
                  <p className="fst-italic fs-5">"Highly recommend StrayaVisuals for their professionalism and attention to detail."</p>
                  <p className="text-muted">- Satisfied Customer</p>
                </div>
              </div>
            </div>

            {/* Reviews next/prev Buttons */}
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
    </div>
  );
};

export default StrayaVisualsHome;
