// src/components/ManualBookingForm.jsx
import React from "react";
import { useForm } from "react-hook-form";
import { getFirestore, setDoc, doc } from "firebase/firestore";
import "../booking.css"; // adjust path based on your folder structure


const db = getFirestore();

const ManualBookingForm = ({ onSuccess }) => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    try {
      const docId = `${data.date.replace(/-/g, "")}_${data.timeSlot.replace(/[^0-9]/g, "")}`;
      await setDoc(doc(db, "bookings", docId), {
        ...data,
        createdAt: new Date(),
        status: "approved",
      });
      onSuccess("✅ Booking added successfully!");
      reset();
    } catch (error) {
      onSuccess("❌ Error: " + error.message);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="contact-form-contact w-full max-w-[900px] px-6 mx-auto mt-6 space-y-6 text-center"
    >
      {/* Name */}
      <div className="form-item">
        <label htmlFor="name" className="form-label">Your Name</label>
        <input
          id="name"
          type="text"
          placeholder="Enter your name"
          className="form-input"
          {...register("name", { required: "Name is required." })}
        />
        {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
      </div>

      {/* Email */}
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
        {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
      </div>

      {/* Service Type */}
      <div className="form-item">
        <label htmlFor="serviceType" className="form-label">Type of Service</label>
        <select
          id="serviceType"
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
        {errors.serviceType && <p className="text-red-500 text-sm">{errors.serviceType.message}</p>}
      </div>

      {/* Date */}
      <div className="form-item">
        <label htmlFor="date" className="form-label">Date of Service</label>
        <input
          id="date"
          type="date"
          className="form-input"
          {...register("date", { required: "Date is required." })}
        />
        {errors.date && <p className="text-red-500 text-sm">{errors.date.message}</p>}
      </div>

      {/* Time Slot */}
      <div className="form-item">
        <label htmlFor="timeSlot" className="form-label">Time Slot</label>
        <input
          id="timeSlot"
          type="text"
          placeholder="e.g. 2:00 PM - 3:00 PM"
          className="form-input"
          {...register("timeSlot", { required: "Time slot is required." })}
        />
        {errors.timeSlot && <p className="text-red-500 text-sm">{errors.timeSlot.message}</p>}
      </div>

      {/* Location */}
      <div className="form-item">
        <label htmlFor="bookingLocation" className="form-label">Location</label>
        <input
          id="manual-booking-location"
          type="text"
          placeholder="Start typing your address or postcode"
          className="form-input"
          {...register("bookingLocation", { required: "Location is required." })}
        />
        {errors.bookingLocation && <p className="text-red-500 text-sm">{errors.bookingLocation.message}</p>}
      </div>

      {/* Budget */}
      <div className="form-item">
        <label htmlFor="budget" className="form-label">Your Budget</label>
        <input
          id="budget"
          type="number"
          placeholder="Enter your approximate budget"
          className="form-input"
          {...register("budget", { required: "Budget is required." })}
        />
        {errors.budget && <p className="text-red-500 text-sm">{errors.budget.message}</p>}
      </div>

      {/* Special Requests */}
      <div className="form-item">
        <label htmlFor="specialRequests" className="form-label">Anything Else?</label>
        <textarea
          id="specialRequests"
          placeholder="Please let us know if you have additional requirements."
          className="form-input h-32 resize-none"
          {...register("specialRequests")}
        />
      </div>

      {/* Submit */}
      <button
        type="submit"
        className="send-button-contact w-full max-w-lg mx-auto bg-green-600 text-white py-3 rounded hover:bg-green-700"
      >
        Save Booking <i className="fa fa-check ml-2"></i>
      </button>
    </form>
  );
};

export default ManualBookingForm;
