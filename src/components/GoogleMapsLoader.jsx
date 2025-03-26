// src/components/GoogleMapsLoader.jsx
import { useEffect } from "react";

const GoogleMapsLoader = ({ onLoad }) => {
  useEffect(() => {
    if (window.google && window.google.maps && window.google.maps.places) {
      onLoad();
      return;
    }

    const existingScript = document.getElementById("google-maps-script");
    if (existingScript) {
      existingScript.addEventListener("load", onLoad);
      return;
    }

    const script = document.createElement("script");
    script.id = "google-maps-script";
    script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyC9q000WhsYE8HNddxbxenxFDLscbFOj60&libraries=places`;
    script.async = true;
    script.defer = true;

    script.onload = () => {
      console.log("✅ Google Maps script loaded");
      onLoad();
    };

    document.body.appendChild(script);
  }, [onLoad]);

  return null;
};

export default GoogleMapsLoader;
