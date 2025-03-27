import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import {  collection,  onSnapshot,  updateDoc,  doc,  deleteDoc,  setDoc,} from "firebase/firestore";
import { db } from "./firebase-config";
import styles from "./AdminDashboard.module.css";
import BookingCalendar from "./components/BookingCalendar";
import ServiceAnalytics from "./components/ServiceAnalytics";
import GoogleMapsLoader from "./components/GoogleMapsLoader";


const AdminDashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [filter, setFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [showCalendar, setShowCalendar] = useState(false); // ✅ NEW
  const bookingsPerPage = 10;
  const navigate = useNavigate();
  const auth = getAuth();
  const [showManualForm, setShowManualForm] = useState(false);
  const [manualData, setManualData] = useState({
    name: "",
    email: "",
    date: "",
    timeSlot: "",
    serviceType: "",
    bookingLocation: "",
    budget: "",
    specialRequests: "",
  });

  const handleManualBookingSubmit = async (e) => {
    e.preventDefault();
    try {
      const formattedDate = manualData.date.replace(/-/g, "");
      const [start, end] = manualData.timeSlot.split(" - ");
      const convertTo24 = (t) => {
        const [time, period] = t.trim().split(" ");
        let [h, m] = time.split(":").map(Number);
        if (period === "PM" && h !== 12) h += 12;
        if (period === "AM" && h === 12) h = 0;
        return `${h.toString().padStart(2, "0")}${m.toString().padStart(2, "0")}`;
      };
      const docId = `${formattedDate}_${convertTo24(start)}_${convertTo24(end)}`;
      await setDoc(doc(db, "bookings", docId), {
        ...manualData,
        createdAt: new Date(),
        status: "approved",
      });
      setManualData({
        name: "",
        email: "",
        date: "",
        timeSlot: "",
        serviceType: "",
        bookingLocation: "",
        budget: "",
        specialRequests: "",
      });
      alert("✅ Booking added successfully!");
    } catch (err) {
      console.error("Error creating booking:", err);
      alert("❌ Failed to add booking.");
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        navigate("/login");
      } else {
        setUser(currentUser);
      }
    });
    return () => unsubscribe();
  }, [auth, navigate]);

  useEffect(() => {
    if (!user) return;
    const unsubscribe = onSnapshot(collection(db, "bookings"), (snapshot) => {
      const bookingData = snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
      }));
      setBookings(bookingData);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [user]);

  const updateStatus = async (bookingId, newStatus) => {
    try {
      await updateDoc(doc(db, "bookings", bookingId), { status: newStatus });
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const deleteBooking = async (bookingId) => {
    try {
      await deleteDoc(doc(db, "bookings", bookingId));
    } catch (error) {
      console.error("Error deleting booking:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const filteredBookings =
    filter === "all"
      ? bookings
      : bookings.filter((b) => (b.status || "pending") === filter);

  const totalPages = Math.ceil(filteredBookings.length / bookingsPerPage);
  const paginatedBookings = filteredBookings.slice(
    (currentPage - 1) * bookingsPerPage,
    currentPage * bookingsPerPage,
  );

  return (
    <section className={styles.dashboardContainer}>
      <div className={styles.innerWrapper}>
        {/* Header */}
        <div className={styles.headerActions}>
          <h1 className="text-3xl font-bold mb-4 md:mb-0 text-center text-white mx-auto">
            Straya Visuals Admin Panel
          </h1>
          <div className={styles.buttonGroup}>
          <button onClick={() => navigate("/admin/contact/update")} className={`${styles.button} ${styles.blue}`}>
              Contact Dashboard
            </button>
            <button
              onClick={() => navigate("/admin/videos")}
              className={`${styles.button} ${styles.blue}`}
            >
              Video Dashboard
            </button>
            <button
              onClick={handleLogout}
              className={`${styles.button} ${styles.red}`}
            >
              Logout
            </button>
          </div>
        </div>

        {/* Calendar Toggle Button */}
        <div className="flex justify-center mb-6">
          <button
            onClick={() => setShowCalendar(!showCalendar)}
            className={`${styles.button} ${styles.dark}`}
          >
            {showCalendar ? "Hide Calendar View" : "Show Calendar View"}
          </button>
        </div>

        <div className="flex flex-wrap gap-4 justify-center mb-6"></div>
        {/* Calendar View */}
        {showCalendar && (
          <div className="mb-10">
            <BookingCalendar />
          </div>
        )}

<div className="flex flex-wrap justify-center mb-6">
          <ServiceAnalytics />
        </div>

        {/* Manual Booking Toggle Button */}
        <div className="mb-4">
          <button
            onClick={() => setShowManualForm(!showManualForm)}
            className={`${styles.button} ${styles.blue}`}
          >
            {showManualForm
              ? "Hide Manual Booking Form"
              : "➕ Add Booking Manually"}
          </button>
        </div>          

        {/* Manual Booking Form */}
{showManualForm && (
  <div className="bg-[#1c1505] p-6 rounded-lg text-white shadow-lg mb-6 max-w-2xl mx-auto">
    <h3 className="text-xl font-bold mb-6 text-center">Manual Booking</h3>

    {/* Load Google Maps Autocomplete */}
    <GoogleMapsLoader
      onLoad={() => {
        const input = document.getElementById("manual-booking-location");
        if (!input) return;
        const autocomplete = new window.google.maps.places.Autocomplete(input, {
          types: ["geocode"],
          componentRestrictions: { country: "au" },
        });
        autocomplete.addListener("place_changed", () => {
          const place = autocomplete.getPlace();
          if (place && place.formatted_address) {
            setManualData((prev) => ({
              ...prev,
              bookingLocation: place.formatted_address,
            }));
          }
        });
      }}
    />

<form  onSubmit={handleManualBookingSubmit} className="flex flex-col gap-4 text-black w-full max-w-md mx-auto" >
      <div>
        <label className="block mb-1 text-white">Name</label>
        <input
          type="text"
          value={manualData.name}
          onChange={(e) => setManualData({ ...manualData, name: e.target.value })}
          className="w-full px-4 py-2 rounded bg-white"
          required
        />
      </div>

      <div>
        <label className="block mb-1 text-white">Email</label>
        <input
          type="email"
          value={manualData.email}
          onChange={(e) => setManualData({ ...manualData, email: e.target.value })}
          className="w-full px-4 py-2 rounded bg-white"
          required
        />
      </div>

      <div>
        <label className="block mb-1 text-white">Date</label>
        <input
          type="date"
          value={manualData.date}
          onChange={(e) => setManualData({ ...manualData, date: e.target.value })}
          className="w-full px-4 py-2 rounded bg-white"
          required
        />
      </div>

      <div>
        <label className="block mb-1 text-white">Time Slot</label>
        <select
          value={manualData.timeSlot}
          onChange={(e) => setManualData({ ...manualData, timeSlot: e.target.value })}
          className="w-full px-4 py-2 rounded bg-white"
          required
        >
          <option value="">Select Time Slot</option>
          {[
            "9:00 AM - 10:00 AM",
            "10:00 AM - 11:00 AM",
            "11:00 AM - 12:00 PM",
            "12:00 PM - 1:00 PM",
            "1:00 PM - 2:00 PM",
            "2:00 PM - 3:00 PM",
            "3:00 PM - 4:00 PM",
            "4:00 PM - 5:00 PM",
          ].map((slot) => (
            <option key={slot} value={slot}>
              {slot}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block mb-1 text-white">Service Type</label>
        <select
          value={manualData.serviceType}
          onChange={(e) => setManualData({ ...manualData, serviceType: e.target.value })}
          className="w-full px-4 py-2 rounded bg-white"
          required
        >
          <option value="">Select Service</option>
          <option value="wedding">Wedding</option>
          <option value="corporate">Corporate</option>
          <option value="documentary">Documentary</option>
          <option value="event">Event</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div>
        <label className="block mb-1 text-white">Location</label>
        <input
          id="manual-booking-location"
          type="text"
          value={manualData.bookingLocation}
          onChange={(e) => setManualData({ ...manualData, bookingLocation: e.target.value })}
          className="w-full px-4 py-2 rounded bg-white"
        />
      </div>

      <div>
        <label className="block mb-1 text-white">Budget</label>
        <input
          type="number"
          value={manualData.budget}
          onChange={(e) => setManualData({ ...manualData, budget: e.target.value })}
          className="w-full px-4 py-2 rounded bg-white"
        />
      </div>

      <div>
        <label className="block mb-1 text-white">Special Requests</label>
        <textarea
          value={manualData.specialRequests}
          onChange={(e) => setManualData({ ...manualData, specialRequests: e.target.value })}
          rows={3}
          className="w-full px-4 py-2 rounded bg-white"
        />
      </div>

      <button
        type="submit"
        className="w-full bg-green-600 hover:bg-green-700 py-2 text-white rounded font-semibold"
      >
        Save Booking
      </button>
    </form>
  </div>
)}




        {/* Filter Buttons */}
        <div className="flex flex-wrap gap-3 mb-4">
          {["pending", "approved", "cancelled", "all"].map((status) => (
            <button
              key={status}
              onClick={() => {
                setFilter(status);
                setCurrentPage(1);
              }}
              className={`${styles.filterButton} ${
                filter === status ? styles.activeFilter : styles.inactiveFilter
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>      

        {/* Table */}
        {!loading && bookings.length > 0 && (
          <div className="w-full max-w-6xl mx-auto overflow-x-auto mt-6">
            <table className="w-full border-collapse bg-[#1c1505] text-white shadow-lg rounded-lg overflow-hidden">
              <thead className="bg-[#241901] text-white uppercase text-sm sticky top-0 z-10">
                <tr>
                  <th className="border px-4 py-3">Name</th>
                  <th className="border px-4 py-3">Status</th>
                  <th className="border px-4 py-3">
                    <i className="fa fa-envelope mr-2" />
                    Email
                  </th>
                  <th className="border px-4 py-3">
                    <i className="fa fa-calendar mr-2" />
                    Date
                  </th>
                  <th className="border px-4 py-3">
                    <i className="fa fa-clock-o mr-2" />
                    Time
                  </th>
                  <th className="border px-4 py-3">
                    <i className="fa fa-video-camera mr-2" />
                    Service
                  </th>
                  <th className="border px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedBookings.map((booking) => (
                  <tr
                    key={booking.id}
                    className="hover:bg-[#3a2e1a] transition duration-200 ease-in-out"
                  >
                    <td className="border px-4 py-3">{booking.name}</td>
                    <td className="border px-4 py-3">
                      <span
                        className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${
                          booking.status === "approved"
                            ? "bg-green-200 text-green-800"
                            : booking.status === "cancelled"
                              ? "bg-red-200 text-red-800"
                              : "bg-yellow-200 text-yellow-800"
                        }`}
                      >
                        {booking.status || "pending"}
                      </span>
                    </td>
                    <td className="border px-4 py-3">{booking.email}</td>
                    <td className="border px-4 py-3">
                      {booking.date || booking.serviceDate}
                    </td>
                    <td className="border px-4 py-3">
                      {booking.timeSlot || "N/A"}
                    </td>
                    <td className="border px-4 py-3">
                      {booking.serviceType || booking.service}
                    </td>
                    <td className="border px-4 py-3 flex flex-wrap gap-2 justify-center">
                      {booking.status !== "approved" && (
                        <button
                          onClick={() => updateStatus(booking.id, "approved")}
                          className={styles.approveButton}
                        >
                          Approve
                        </button>
                      )}
                      {booking.status === "approved" && (
                        <button
                          onClick={() => updateStatus(booking.id, "cancelled")}
                          className={`${styles.button} ${styles.red} text-xs`}
                        >
                          Cancel
                        </button>
                      )}
                      <button
                        onClick={() => deleteBooking(booking.id)}
                        className={`${styles.button} ${styles.gray} text-xs`}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-6 space-x-4">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={`${styles.button} ${styles.dark}`}
            >
              Previous
            </button>
            <span className="text-sm mt-2">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className={`${styles.button} ${styles.dark}`}
            >
              Next
            </button>
          </div>
        )}

        {/* Fallback */}
        {loading && <p className="mt-6">Loading bookings...</p>}
        {!loading && bookings.length === 0 && (
          <p className="mt-6">No bookings found.</p>
        )}
      </div>
    </section>
  );
};

export default AdminDashboard;
