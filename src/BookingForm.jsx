import { useState } from 'react';
import { db } from './firebase-config'; // Updated import for Firebase configuration
import { collection, addDoc } from 'firebase/firestore';

const BookingForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    serviceDate: '',
    serviceType: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Add booking data to Firestore
      await addDoc(collection(db, 'bookings'), formData);
      alert('Booking submitted successfully!');
      setFormData({
        name: '',
        email: '',
        phone: '',
        serviceDate: '',
        serviceType: ''
      });
    } catch (error) {
      console.error("Error submitting booking: ", error);
      alert('Error submitting booking');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="name"
        value={formData.name}
        onChange={handleChange}
        placeholder="Full Name"
        required
      />
      <input
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        placeholder="Email"
        required
      />
      <input
        type="tel"
        name="phone"
        value={formData.phone}
        onChange={handleChange}
        placeholder="Phone"
        required
      />
      <input
        type="date"
        name="serviceDate"
        value={formData.serviceDate}
        onChange={handleChange}
        required
      />
      <select
        name="serviceType"
        value={formData.serviceType}
        onChange={handleChange}
        required
      >
        <option value="">Select Service Type</option>
        <option value="Wedding">Wedding</option>
        <option value="Event">Event</option>
        <option value="Corporate">Corporate</option>
      </select>
      <button type="submit">Submit Booking</button>
    </form>
  );
};

export default BookingForm;
