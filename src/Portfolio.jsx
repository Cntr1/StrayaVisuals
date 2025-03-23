// src/Portfolio.jsx
import React, { useContext, useEffect, useState, useRef } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { VideoContext } from "./VideoContext";
import { Link } from "react-router-dom";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "./firebase-config";

// VideoPlayer component for playing videos
const VideoPlayer = ({ src, poster }) => {
  const videoRef = useRef(null);
  const [isMuted, setIsMuted] = useState(true);

  // Function to toggle mute/unmute
  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  };

  return (
    <div>
      <video
        ref={videoRef}
        src={src}
        poster={poster || "default-poster.jpg"} // Fallback to a default poster if thumbnail is empty
        className="card-img-top rounded-top"
        controls
        autoPlay
        muted
        loop
        style={{ aspectRatio: "16/9" }}
      >
        Your browser does not support the video tag.
      </video>
      <button onClick={toggleMute} className="btn btn-secondary mt-2">
        {isMuted ? "Unmute" : "Mute"}
      </button>
    </div>
  );
};

const FeaturedFilms = () => {
  const { videos, setVideos } = useContext(VideoContext);
  const [loading, setLoading] = useState(true);

  // Fetch videos from Firestore in real time
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "videos"), (snapshot) => {
      const fetchedVideos = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setVideos(fetchedVideos);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [setVideos]);

  if (loading) {
    return <div className="text-center py-5">Loading videos...</div>;
  }

  return (
    <div style={{ background: 'linear-gradient(to right, #f8f8f8, #ffeb99)', minHeight: '100vh' }}>
      <div className="container text-center py-5">
        <h2 className="mb-4 fw-bold">FEATURED FILMS</h2>
        <div className="row g-4">
          {videos.map((film, index) => (
            <div key={index} className="col-md-6">
              <div className="card border-0 shadow-sm">
                <VideoPlayer src={film.videoUrl} poster={film.thumbnail} />
                <div className="card-body">
                  <p className="card-title fw-bold fs-5">{film.title}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        {/* <button className="btn btn-success mt-4 px-4 py-2 fw-bold">Book Your Reservation</button> */}
      </div>
    </div>
  );
};

export default FeaturedFilms;
