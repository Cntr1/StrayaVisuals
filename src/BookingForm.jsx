// src/BookingForm.jsx
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { app } from './firebase-config.jsx';
import { useNavigate } from 'react-router-dom';

const db = getFirestore(app);

const BookingForm = () => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  // Calculate tomorrow's date (YYYY-MM-DD format) for validation
  const getTomorrowDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  // Custom validation for ensuring the selected date is from tomorrow onward
  const validateFutureDate = (value) => {
    const selectedDate = new Date(value);
    const tomorrow = new Date(getTomorrowDate());
    return selectedDate >= tomorrow || "Please select a date from tomorrow onward.";
  };

  const onSubmit = async (data) => {
    try {
      await addDoc(collection(db, 'bookings'), {
        ...data,
        createdAt: new Date(),
        status: 'pending',
      });
      // Show a pop-up message
      window.alert("Thank you for your booking!");
      // Reset the form fields
      reset();
      // Redirect to the Home Page
      navigate("/");
    } catch (error) {
      console.error("Error submitting booking:", error);
      setErrorMessage("There was an error submitting your booking. Please try again.");
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md mt-8">
      <h2 className="text-2xl font-semibold mb-6 text-center">Book Our Service</h2>
      {errorMessage && <p className="mb-4 text-center text-red-600">{errorMessage}</p>}
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Name Field */}
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            placeholder="Your Name"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300"
            {...register("name", { required: "Name is required." })}
          />
          {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name.message}</p>}
        </div>
        {/* Email Field */}
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            placeholder="you@example.com"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300"
            {...register("email", {
              required: "Email is required.",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Invalid email address.",
              },
            })}
          />
          {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email.message}</p>}
        </div>
        {/* Service Dropdown */}
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="service">Service Type</label>
          <select
            id="service"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300"
            {...register("service", { required: "Service type is required." })}
          >
            <option value="">Select a Service</option>
            <option value="wedding">Wedding Videography</option>
            <option value="corporate">Corporate Videography</option>
            <option value="documentary">Documentary</option>
            <option value="event">Event Coverage</option>
          </select>
          {errors.service && <p className="text-red-600 text-sm mt-1">{errors.service.message}</p>}
        </div>
        {/* Date Field */}
        <div className="mb-6">
          <label className="block text-gray-700 mb-2" htmlFor="date">Date</label>
          <input
            type="date"
            id="date"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300"
            {...register("date", { required: "Date is required.", validate: validateFutureDate })}
            min={getTomorrowDate()}
          />
          {errors.date && <p className="text-red-600 text-sm mt-1">{errors.date.message}</p>}
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-colors"
        >
          Submit Booking
        </button>
      </form>
    </div>
  );
};

export default BookingForm;
