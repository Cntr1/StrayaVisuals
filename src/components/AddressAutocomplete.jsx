// src/components/AddressAutocomplete.jsx
import React, { useRef, useEffect, useState } from "react";

const AddressAutocomplete = ({ value, onChange }) => {
  const inputRef = useRef(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      if (
        window.google &&
        window.google.maps &&
        window.google.maps.places
      ) {
        clearInterval(interval);
        setIsReady(true);
        console.log("✅ Google Maps is ready in AddressAutocomplete");
      }
    }, 300);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!isReady || !inputRef.current) return;

    const autocomplete = new window.google.maps.places.Autocomplete(
      inputRef.current,
      {
        types: ["geocode"],
        componentRestrictions: { country: "au" },
        fields: ["formatted_address"],
      }
    );

    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();
      if (place?.formatted_address) {
        onChange(place.formatted_address);
      }
    });
  }, [isReady]);

  return (
    <input
      ref={inputRef}
      id="bookingLocation"
      name="bookingLocation"
      placeholder="Start typing address or postcode"
      className="form-input"
      type="text"
      autoComplete="off"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );
};

export default AddressAutocomplete;
