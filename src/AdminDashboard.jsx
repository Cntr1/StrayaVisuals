// src/AdminDashboard.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { collection, onSnapshot, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { db } from './firebase-config';

const AdminDashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const auth = getAuth();

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        navigate('/login');
      } else {
        setUser(currentUser);
      }
    });
    return () => unsubscribe();
  }, [auth, navigate]);

  // Real-time snapshot of bookings
  useEffect(() => {
    if (!user) return;

    const unsubscribe = onSnapshot(
      collection(db, 'bookings'),
      (snapshot) => {
        const bookingData = snapshot.docs.map((docSnap) => ({
          id: docSnap.id,
          ...docSnap.data(),
        }));
        setBookings(bookingData);
        setLoading(false);
      },
      (error) => {
        console.error('Error fetching bookings:', error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user]);

  // Update booking status (approve/cancel)
  const updateStatus = async (bookingId, newStatus) => {
    try {
      await updateDoc(doc(db, 'bookings', bookingId), { status: newStatus });
      // onSnapshot automatically updates local state
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  // Delete a booking
  const deleteBooking = async (bookingId) => {
    try {
      await deleteDoc(doc(db, 'bookings', bookingId));
      // onSnapshot will remove from local state
    } catch (error) {
      console.error('Error deleting booking:', error);
    }
  };

  // Logout
  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  // Render function for each booking row
  const renderBookingRow = (booking) => {
    return (
      <tr key={booking.id}>
        <td className="border px-3 py-2">{booking.name}</td>
        <td className="border px-3 py-2">{booking.status || 'pending'}</td>
        <td className="border px-3 py-2">{booking.email}</td>
        <td className="border px-3 py-2">{booking.serviceDate || booking.date || 'N/A'}</td>
        {/* NEW Time Slot Column */}
        <td className="border px-3 py-2">{booking.timeSlot || 'N/A'}</td>
        <td className="border px-3 py-2">
          {booking.serviceType || booking.service || 'N/A'}
        </td>
        <td className="border px-3 py-2 flex flex-col space-y-2 md:space-x-2 md:space-y-0 md:flex-row">
          {booking.status !== 'approved' && (
            <button
              onClick={() => updateStatus(booking.id, 'approved')}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Approve
            </button>
          )}
          {booking.status === 'approved' && (
            <button
              onClick={() => updateStatus(booking.id, 'cancelled')}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Cancel
            </button>
          )}
          <button
            onClick={() => deleteBooking(booking.id)}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            Delete
          </button>
        </td>
      </tr>
    );
  };

  return (
    <section className="w-full flex justify-center px-4 py-10 bg-gray-100 min-h-screen">
      <div className="w-full max-w-6xl flex flex-col items-center text-center">
        {/* Header */}
        <div className="w-full flex flex-col md:flex-row justify-between items-center mb-6">
          <h1 className="text-3xl font-bold mb-4 md:mb-0">Straya Visuals Admin Panel</h1>
          <div className="flex space-x-4">
            <button
              onClick={() => navigate("/admin/videos")}
              className="px-5 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Video Dashboard
            </button>
            <button
              onClick={handleLogout}
              className="px-5 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Logout
            </button>
          </div>
        </div>
  
        <h2 className="text-2xl font-semibold mb-4">All Bookings</h2>
  
        {loading && <p className="mb-4">Loading bookings...</p>}
  
        {!loading && bookings.length === 0 && (
          <p className="mb-4">No bookings found.</p>
        )}
  
        {!loading && bookings.length > 0 && (
          <div className="w-full overflow-x-auto mt-6">
            <table className="w-full max-w-5xl mx-auto border-collapse bg-white shadow-lg">
              <thead className="bg-gray-200">
                <tr>
                  <th className="border px-3 py-2">Name</th>
                  <th className="border px-3 py-2">Status</th>
                  <th className="border px-3 py-2">Email</th>
                  <th className="border px-3 py-2">Service Date</th>
                  <th className="border px-3 py-2">Time Slot</th>
                  <th className="border px-3 py-2">Service Type</th>
                  <th className="border px-3 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map(renderBookingRow)}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
  
  
  
};

export default AdminDashboard;
