// src/BookingForm.jsx
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { getFirestore, doc, getDoc, setDoc, query, where, collection, getDocs } from 'firebase/firestore';
import { app } from './firebase-config.jsx';
import { useNavigate } from 'react-router-dom';

const db = getFirestore(app);

const BookingForm = () => {
  const { register, handleSubmit, formState: { errors }, reset, watch } = useForm();
  const [errorMessage, setErrorMessage] = useState('');
  const [bookedSlots, setBookedSlots] = useState([]);
  const navigate = useNavigate();
  const watchDate = watch('date');

  const getTomorrowDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  const validateFutureDate = (value) => {
    const selectedDate = new Date(value);
    const tomorrow = new Date(getTomorrowDate());
    return selectedDate >= tomorrow || "Please select a date from tomorrow onward.";
  };

  const formatDateAsYYYYMMDD = (dateStr) => dateStr.replace(/-/g, '');

  const convertTo24Hour = (str) => {
    const [timePart, ampm] = str.split(" ");
    let [hour, minute] = timePart.split(":");
    hour = parseInt(hour, 10);
    if (ampm === 'PM' && hour < 12) hour += 12;
    if (ampm === 'AM' && hour === 12) hour = 0;
    return String(hour).padStart(2, '0') + minute.padStart(2, '0');
  };

  const parseTimeSlot = (timeSlotStr) => {
    const [startStr, endStr] = timeSlotStr.split(' - ');
    const start24 = convertTo24Hour(startStr);
    const end24 = convertTo24Hour(endStr);
    return { start24, end24 };
  };

  useEffect(() => {
    const fetchBookedSlots = async () => {
      if (!watchDate) return;
      const q = query(collection(db, 'bookings'), where('date', '==', watchDate));
      const snapshot = await getDocs(q);
      const slots = snapshot.docs.map(doc => doc.data().timeSlot);
      setBookedSlots(slots);
    };

    fetchBookedSlots();
  }, [watchDate]);

  const onSubmit = async (data) => {
    try {
      const formattedDate = formatDateAsYYYYMMDD(data.date);
      const { start24, end24 } = parseTimeSlot(data.timeSlot);
      const docId = `${formattedDate}_${start24}_${end24}`;

      const bookingRef = doc(db, 'bookings', docId);
      const existingSnap = await getDoc(bookingRef);
      if (existingSnap.exists()) {
        setErrorMessage("That time slot is already booked. Please pick a different one.");
        return;
      }

      await setDoc(bookingRef, {
        ...data,
        createdAt: new Date(),
        status: 'pending',
      });

      window.alert("Thank you for your booking!");
      reset();
      navigate("/");
    } catch (error) {
      console.error("Error submitting booking:", error);
      setErrorMessage("There was an error. Please try again.");
    }
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

  return (
    // Updated container class: using a semi-transparent white background for readability
    <div className="max-w-md mx-auto p-6 bg-white bg-opacity-75 rounded-lg shadow-md mt-8">
      <h2 className="text-2xl font-semibold mb-6 text-center">Book Our Service</h2>
      {errorMessage && <p className="mb-4 text-center text-red-600">{errorMessage}</p>}
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Name</label>
          <input type="text" {...register("name", { required: "Name is required." })} className="w-full px-3 py-2 border rounded" />
          {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name.message}</p>}
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Email</label>
          <input type="email" {...register("email", {
            required: "Email is required.",
            pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Invalid email." },
          })} className="w-full px-3 py-2 border rounded" />
          {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email.message}</p>}
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Service Type</label>
          <select {...register("service", { required: "Service is required." })} className="w-full px-3 py-2 border rounded">
            <option value="">Select a Service</option>
            <option value="wedding">Wedding Videography</option>
            <option value="corporate">Corporate Videography</option>
            <option value="documentary">Documentary</option>
            <option value="event">Event Coverage</option>
          </select>
          {errors.service && <p className="text-red-600 text-sm mt-1">{errors.service.message}</p>}
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Date</label>
          <input type="date" {...register("date", {
            required: "Date is required.",
            validate: validateFutureDate,
          })} className="w-full px-3 py-2 border rounded" min={getTomorrowDate()} />
          {errors.date && <p className="text-red-600 text-sm mt-1">{errors.date.message}</p>}
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 mb-2">Time Slot</label>
          <select {...register("timeSlot", { required: "Time slot is required." })} className="w-full px-3 py-2 border rounded">
            <option value="">Select a Time Slot</option>
            {timeSlots.map(slot => (
              <option key={slot} value={slot} disabled={bookedSlots.includes(slot)}>
                {slot} {bookedSlots.includes(slot) ? '(Booked)' : ''}
              </option>
            ))}
          </select>
          {errors.timeSlot && <p className="text-red-600 text-sm mt-1">{errors.timeSlot.message}</p>}
        </div>

        <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600">
          Submit Booking
        </button>
      </form>
    </div>
  );
};

export default BookingForm;
