// src/BookingFancy.jsx
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  query,
  where,
  collection,
  getDocs,
} from "firebase/firestore";
import { app } from "./firebase-config.jsx";
import { useNavigate } from "react-router-dom";
import "./booking.css";

const db = getFirestore(app);

const BookingFancy = () => {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm();

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [bookedSlots, setBookedSlots] = useState([]);

  const navigate = useNavigate();
  const watchDate = watch("date");

  const getTomorrowDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split("T")[0];
  };

  const formatDateAsYYYYMMDD = (dateStr) => dateStr.replace(/-/g, "");

  const convertTo24Hour = (str) => {
    const [timePart, ampm] = str.split(" ");
    let [hour, minute] = timePart.split(":");
    hour = parseInt(hour, 10);
    if (ampm === "PM" && hour < 12) hour += 12;
    if (ampm === "AM" && hour === 12) hour = 0;
    return String(hour).padStart(2, "0") + minute.padStart(2, "0");
  };

  const parseTimeSlot = (timeSlotStr) => {
    const [startStr, endStr] = timeSlotStr.split(" - ");
    const start24 = convertTo24Hour(startStr);
    const end24 = convertTo24Hour(endStr);
    return { start24, end24 };
  };

  const timeSlots = [
    "9:00 AM - 10:00 AM",
    "10:00 AM - 11:00 AM",
    "11:00 AM - 12:00 PM",
    "12:00 PM - 1:00 PM",
    "1:00 PM - 2:00 PM",
    "2:00 PM - 3:00 PM",
    "3:00 PM - 4:00 PM",
    "4:00 PM - 5:00 PM",
  ];

  useEffect(() => {
    const fetchBookedSlots = async () => {
      if (!watchDate) return;
      const q = query(collection(db, "bookings"), where("date", "==", watchDate));
      const snapshot = await getDocs(q);
      const slots = snapshot.docs.map((doc) => doc.data().timeSlot);
      setBookedSlots(slots);
    };
    fetchBookedSlots();
  }, [watchDate]);

  const onSubmit = async (data) => {
    try {
      const formattedDate = formatDateAsYYYYMMDD(data.date);
      const { start24, end24 } = parseTimeSlot(data.timeSlot);
      const docId = `${formattedDate}_${start24}_${end24}`;

      const bookingRef = doc(db, "bookings", docId);
      const existingSnap = await getDoc(bookingRef);
      if (existingSnap.exists()) {
        setErrorMessage("That time slot is already booked. Please pick a different one.");
        return;
      }

      await setDoc(bookingRef, {
        ...data,
        createdAt: new Date(),
        status: "pending",
      });

      setSuccessMessage("Thank you for your booking!");
      setTimeout(() => setSuccessMessage(""), 3000);
      reset();
    } catch (error) {
      console.error("Booking error:", error);
      setErrorMessage("There was an error. Please try again.");
    }
  };

  return (
    <>
      {/* Header Image at the very top */}
      <div className="header-wrapper">
  <img src="/DroneHeader.png" alt="Header" className="form-header-image" />
  <div className="header-heading">
    <div className="header-heading1">Your Vision, Our Lens</div>
    <div className="header-heading2">Schedule Your Shoot Today</div>
  </div>
</div>


  
      {/* Main Section with videos + form */}
      <section className="video-form-wrapper">
        {/* Left Video */}
        <div className="video-box">
          <video
            src="/videos/left.mp4"
            autoPlay
            loop
            muted
            playsInline
            className="video-player"
          />
        </div>

  
        <form
  className="contact-form-contact w-full max-w-[900px] px-6 mx-auto mt-6 space-y-6 text-center"
  onSubmit={handleSubmit(onSubmit)}
>

  {/* NAME */}
  <div className="form-item">
    <label htmlFor="name" className="form-label">Your Name</label>
    <input
      id="name"
      type="text"
      placeholder="Enter your name"
      className="form-input"
      {...register("name", { required: "Name is required." })}
    />
    {errors.name && <p className="text-red-600 text-sm">{errors.name.message}</p>}
  </div>

  {/* EMAIL */}
  <div className="form-item">
    <label htmlFor="email" className="form-label">Your Email</label>
    <input
      id="email"
      type="email"
      placeholder="Enter your email"
      className="form-input"
      {...register("email", {
        required: "Email is required.",
        pattern: {
          value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
          message: "Invalid email address.",
        },
      })}
    />
    {errors.email && <p className="text-red-600 text-sm">{errors.email.message}</p>}
  </div>

  {/* SERVICE TYPE */}
  <div className="form-item">
    <label htmlFor="serviceType" className="form-label">Type of Service</label>
    <select
      className="form-input"
      {...register("serviceType", { required: "Service type is required." })}
    >
      <option value="">Select the type of service</option>
      <option value="wedding">Wedding Coverage</option>
      <option value="corporate">Corporate Video</option>
      <option value="documentary">Documentary</option>
      <option value="event">Event Coverage</option>
      <option value="other">Other</option>
    </select>
    {errors.serviceType && <p className="text-red-600 text-sm">{errors.serviceType.message}</p>}
  </div>

  {/* DATE */}
  <div className="form-item">
    <label htmlFor="date" className="form-label">Date of Service</label>
    <input
      type="date"
      min={getTomorrowDate()}
      className="form-input"
      {...register("date", { required: "Date is required." })}
    />
    {errors.date && <p className="text-red-600 text-sm">{errors.date.message}</p>}
  </div>

  {/* TIME SLOT */}
  <div className="form-item">
    <label htmlFor="timeSlot" className="form-label">Time Slot</label>
    <select
      className="form-input"
      {...register("timeSlot", { required: "Time slot is required." })}
    >
      <option value="">Select a Time Slot</option>
      {timeSlots.map((slot) => (
        <option key={slot} value={slot} disabled={bookedSlots.includes(slot)}>
          {slot} {bookedSlots.includes(slot) ? "(Booked)" : ""}
        </option>
      ))}
    </select>
    {errors.timeSlot && <p className="text-red-600 text-sm">{errors.timeSlot.message}</p>}
  </div>

  {/* LOCATION */}
  <div className="form-item">
    <label htmlFor="bookingLocation" className="form-label">Location</label>
    <input
      id="bookingLocation"
      type="text"
      placeholder="Enter location"
      className="form-input"
      {...register("bookingLocation", { required: "Location is required." })}
    />
    {errors.bookingLocation && <p className="text-red-600 text-sm">{errors.bookingLocation.message}</p>}
  </div>

  {/* BUDGET */}
  <div className="form-item">
    <label htmlFor="budget" className="form-label">Your Budget</label>
    <input
      id="budget"
      type="number"
      placeholder="Enter your approximate budget"
      className="form-input"
      {...register("budget", { required: "Budget is required." })}
    />
    {errors.budget && <p className="text-red-600 text-sm">{errors.budget.message}</p>}
  </div>

  {/* SPECIAL REQUESTS */}
  <div className="form-item">
    <label htmlFor="specialRequests" className="form-label">Anything Else?</label>
    <textarea
      id="specialRequests"
      placeholder="Please let us know if you have additional requirements."
      className="form-input h-32 resize-none"
      {...register("specialRequests")}
    />
  </div>

  {/* SUBMIT */}
  <button
    type="submit"
    className="send-button-contact w-full max-w-lg mx-auto bg-black text-white py-3 rounded hover:bg-opacity-80"
  >
    Submit Booking <i className="fa fa-send ml-2"></i>
  </button>

  {/* STATUS MESSAGES */}
  {errorMessage && <p className="text-red-600 text-sm">{errorMessage}</p>}
  {successMessage && <p className="text-green-600 text-sm">{successMessage}</p>}
</form>


  {/* Right Video */}
<div className="video-box-2">
  <video
    src="/videos/right.mp4"
    autoPlay
    loop
    muted
    playsInline
    className="video-player"
  />
</div>
    </section>
  </>

);
}

export default BookingFancy;
