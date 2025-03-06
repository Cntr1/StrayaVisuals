// src/AdminDashboard.js
import { useEffect, useState } from 'react';
import { db } from './firebase-config';
import { collection, getDocs } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  
  const auth = getAuth();

  useEffect(() => {
    // Check if user is authenticated
    onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        navigate('/'); // Redirect to homepage if not authenticated
      }
    });

    const fetchBookings = async () => {
      const querySnapshot = await getDocs(collection(db, 'bookings'));
      const bookingsList = querySnapshot.docs.map(doc => doc.data());
      setBookings(bookingsList);
    };

    if (user) fetchBookings();
  }, [auth, user, navigate, db]);

  return (
    <div>
      <h1>Admin Dashboard</h1>
      <h2>Bookings</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Service Date</th>
            <th>Service Type</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((booking, index) => (
            <tr key={index}>
              <td>{booking.name}</td>
              <td>{booking.email}</td>
              <td>{booking.phone}</td>
              <td>{booking.serviceDate}</td>
              <td>{booking.serviceType}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminDashboard;
