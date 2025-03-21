// src/AdminDashboard.jsx
import React, { useEffect, useState } from 'react';
import { db } from './firebase-config';
import { collection, onSnapshot, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const auth = getAuth();

  // Listen for authentication state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        navigate('/login');
      }
    });
    return () => unsubscribe();
  }, [auth, navigate]);

  // Use onSnapshot for real-time updates to the bookings collection
  useEffect(() => {
    if (!user) return;

    setLoading(true);
    const unsubscribe = onSnapshot(
      collection(db, 'bookings'),
      (snapshot) => {
        const bookingsList = snapshot.docs.map((docSnap) => ({
          id: docSnap.id,
          ...docSnap.data(),
        }));
        setBookings(bookingsList);
        setLoading(false);
      },
      (error) => {
        console.error('Error getting real-time bookings:', error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user]);

  // Update booking status
  const updateStatus = async (id, newStatus) => {
    try {
      await updateDoc(doc(db, 'bookings', id), { status: newStatus });
      // Local state will be updated automatically by onSnapshot
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  // Delete a booking
  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, 'bookings', id));
      // Local state will be updated automatically by onSnapshot
    } catch (error) {
      console.error('Error deleting booking:', error);
    }
  };

  // Logout handler
  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>
      <h2 className="text-2xl font-semibold mb-2">Bookings</h2>
      {(() => {
        if (loading) {
          return <p>Loading bookings...</p>;
        }
        if (bookings.length === 0) {
          return <p>No bookings found.</p>;
        }
        return (
          <table className="table-auto w-full border-collapse">
            <thead>
              <tr className="bg-gray-200">
                <th className="border px-4 py-2">Name</th>
                <th className="border px-4 py-2">Email</th>
                <th className="border px-4 py-2">Service Date</th>
                <th className="border px-4 py-2">Service Type</th>
                <th className="border px-4 py-2">Status</th>
                <th className="border px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => (
                <tr key={booking.id}>
                  <td className="border px-4 py-2">{booking.name}</td>
                  <td className="border px-4 py-2">{booking.email}</td>
                  <td className="border px-4 py-2">
                    {booking.serviceDate || booking.date || 'N/A'}
                  </td>
                  <td className="border px-4 py-2">
                    {booking.serviceType || booking.service || 'N/A'}
                  </td>
                  <td className="border px-4 py-2">{booking.status || 'pending'}</td>
                  <td className="border px-4 py-2 space-x-2">
                    <button
                      onClick={() => updateStatus(booking.id, 'approved')}
                      className="px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleDelete(booking.id)}
                      className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        );
      })()}
    </div>
  );
};

export default AdminDashboard;
