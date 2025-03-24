// src/BookingFancy.jsx
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { getFirestore, doc, getDoc, setDoc, query, where, collection, getDocs } from "firebase/firestore";
import { app } from "./firebase-config.jsx";
import { useNavigate } from "react-router-dom";

// CSS imports
import "./css/footer/fonts/ionicons/css/ionicons.min.css";
import "./css/footer/style.css";
import "./css/footer/ionicons.min.css";
import "./css/footer/bootstrap.min.css";
import "./css/contact/bootstrap.min.css";
import "./css/contact/base.css";
import "./css/contact/fonticons.css";
import "./css/contact/font-awesome.min.css";

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

  const formatDateAsYYYYMMDD = (dateStr) => dateStr.replace(/-/g, '');

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

  // Fetch booked slots when the selected date changes
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
    <section className="contact-form-section-contact w-full flex justify-center px-4">
      <div className="w-full flex flex-col items-center">
        {/* CTA Container */}
        <div className="cta-container-contact text-center w-full">
          <div className="line-contact"></div>
          <div className="cta-text-contact">
            Ready to record your memories? Let's book an appointment!
          </div>
          <div className="line-contact"></div>
        </div>

        {/* Booking Form */}
        <form
          className="contact-form-contact w-full mx-auto mt-6 space-y-6 text-center"
          onSubmit={handleSubmit(onSubmit)}
        >
          <label htmlFor="name">Your Name *</label>
          <input
            id="name"
            placeholder="Enter your name"
            type="text"
            {...register("name", { required: "Name is required." })}
          />
          {errors.name && <p className="text-red-600 text-sm">{errors.name.message}</p>}

          <label htmlFor="email">Your Email *</label>
          <input
            id="email"
            placeholder="Enter your email"
            type="email"
            {...register("email", {
              required: "Email is required.",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Invalid email address.",
              },
            })}
          />
          {errors.email && <p className="text-red-600 text-sm">{errors.email.message}</p>}

          <label htmlFor="service-type">Type of Service *</label>
          <select {...register("serviceType", { required: "Service type is required." })}>
            <option value="" disabled>Select the type of service</option>
            <option value="wedding">Wedding Coverage</option>
            <option value="corporate">Corporate Video</option>
            <option value="documentary">Documentary</option>
            <option value="event">Event Coverage</option>
            <option value="other">Other</option>
          </select>
          {errors.serviceType && <p className="text-red-600 text-sm">{errors.serviceType.message}</p>}

          <label htmlFor="date">Date of Service *</label>
          <input
            type="date"
            min={getTomorrowDate()}
            {...register("date", { required: "Date is required." })}
          />
          {errors.date && <p className="text-red-600 text-sm">{errors.date.message}</p>}

          <label htmlFor="timeSlot">Time Slot *</label>
          <select {...register("timeSlot", { required: "Time slot is required." })}>
            <option value="">Select a Time Slot</option>
            {timeSlots.map((slot) => (
              <option key={slot} value={slot} disabled={bookedSlots.includes(slot)}>
                {slot} {bookedSlots.includes(slot) ? "(Booked)" : ""}
              </option>
            ))}
          </select>
          {errors.timeSlot && <p className="text-red-600 text-sm">{errors.timeSlot.message}</p>}

          <label htmlFor="bookingLocation">Location *</label>
          <input
            id="bookingLocation"
            type="text"
            placeholder="Enter location"
            {...register("bookingLocation", { required: "Location is required." })}
          />
          {errors.bookingLocation && <p className="text-red-600 text-sm">{errors.bookingLocation.message}</p>}

          <label htmlFor="budget">Your Budget *</label>
          <input
            id="budget"
            type="number"
            placeholder="Enter your approximate budget"
            min="0"
            {...register("budget", { required: "Budget is required." })}
          />
          {errors.budget && <p className="text-red-600 text-sm">{errors.budget.message}</p>}

          <label htmlFor="specialRequests">Any Special Requests?</label>
          <textarea
            id="specialRequests"
            placeholder="We’ll do our best to fulfill your wishes!"
            {...register("specialRequests")}
          />

          <button type="submit" className="send-button-contact">
            Submit Booking <i className="fa fa-send" style={{ marginLeft: "10px" }}></i>
          </button>

          {errorMessage && <p className="text-red-600 text-sm">{errorMessage}</p>}
          {successMessage && <p className="text-green-600 text-sm">{successMessage}</p>}
        </form>
      </div>
    </section>
  );
};

export default BookingFancy;
