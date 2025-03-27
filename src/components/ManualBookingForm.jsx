// src/components/ManualBookingForm.jsx
import React from "react";
import { useForm } from "react-hook-form";
import { getFirestore, setDoc, doc } from "firebase/firestore";
import { format } from "date-fns";
import "./manualBooking.css"; // Optional styling

const db = getFirestore();

const ManualBookingForm = ({ onSuccess }) => {
  const { register, handleSubmit, reset } = useForm();

  const onSubmit = async (data) => {
    try {
      const docId = `${data.date.replace(/-/g, "")}_${data.timeSlot.replace(/[^0-9]/g, "")}`;
      await setDoc(doc(db, "bookings", docId), {
        ...data,
        createdAt: new Date(),
        status: "approved", // Admin-created = pre-approved
      });
      onSuccess("Booking added!");
      reset();
    } catch (error) {
      onSuccess("Error: " + error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="manual-booking-form bg-[#241901] text-white p-6 rounded-lg mt-4">
      <h2 className="text-lg font-bold mb-4">📝 Create Manual Booking</h2>

      <input {...register("name", { required: true })} placeholder="Name" className="form-input mb-2" />
      <input {...register("email", { required: true })} placeholder="Email" className="form-input mb-2" />
      <input {...register("serviceType", { required: true })} placeholder="Service Type" className="form-input mb-2" />
      <input {...register("date", { required: true })} type="date" className="form-input mb-2" />
      <input {...register("timeSlot", { required: true })} placeholder="Time Slot (e.g. 2:00 PM - 3:00 PM)" className="form-input mb-2" />
      <input {...register("bookingLocation")} placeholder="Location" className="form-input mb-2" />
      <input {...register("budget")} placeholder="Budget" className="form-input mb-2" />
      <textarea {...register("specialRequests")} placeholder="Special Requests" className="form-input mb-2"></textarea>

      <button type="submit" className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded">
        Create Booking
      </button>
    </form>
  );
};

export default ManualBookingForm;
