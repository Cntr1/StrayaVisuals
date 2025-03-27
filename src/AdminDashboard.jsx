import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import {  collection,  onSnapshot,  updateDoc,  doc,  deleteDoc,  setDoc,} from "firebase/firestore";
import { db } from "./firebase-config";
import styles from "./AdminDashboard.module.css";
import BookingCalendar from "./components/BookingCalendar";
import ServiceAnalytics from "./components/ServiceAnalytics";
import GoogleMapsLoader from "./components/GoogleMapsLoader";
import ManualEmailForm from "./components/ManualEmailForm";
import ManualBookingForm from "./components/ManualBookingForm";
import Modal from "react-modal";



const AdminDashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [filter, setFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [showCalendar, setShowCalendar] = useState(false); 
  const [showAnalytics, setShowAnalytics] = useState(false);
  const bookingsPerPage = 10;
  const navigate = useNavigate();
  const auth = getAuth();
  const [showManualForm, setShowManualForm] = useState(false);
  const [showEmailForm, setShowEmailForm] = useState(false);
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
        <h1 className={styles.dashboardTitle}>
  Straya Visuals Admin Panel
</h1>

<div className={styles.headerActions}>
  <div className={styles.buttonGroup}>

          <button
  onClick={() => setShowAnalytics(true)}
  className={`${styles.button} ${styles.dark}`}
>
  📊 Analytics
</button>
          <button onClick={() => navigate("/admin/contact/update")} className={`${styles.button} ${styles.brown}`}>
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

        {/* Button Group Row: Send Email | Calendar | Add Booking */}
<div className="flex flex-wrap justify-center gap-4 mt-6 mb-8">
  <button
    onClick={() => setShowEmailForm(!showEmailForm)}
    className={`${styles.button} ${styles.dark}`}
  >
    {showEmailForm ? "Hide Email Form" : "✉️ Send Email"}
  </button>

  <button
    onClick={() => setShowCalendar(!showCalendar)}
    className={`${styles.button} ${styles.dark}`}
  >
    {showCalendar ? "Hide Calendar View" : "📅 Calendar View"}
  </button>

  <button
    onClick={() => setShowManualForm(!showManualForm)}
    className={`${styles.button} ${styles.blue}`}
  >
    {showManualForm ? "Hide Booking Form" : "➕ Add Booking"}
  </button>
</div>
      

        {/* Manual Booking Form */}
        <Modal
  isOpen={showManualForm}
  onRequestClose={() => setShowManualForm(false)}
  contentLabel="Manual Booking Form"
  className="ReactModal__Content"
  overlayClassName="ReactModal__Overlay"
>
  {/* Close Button */}
  <button
    onClick={() => setShowManualForm(false)}
    className="absolute top-4 right-4 text-2xl font-bold text-gray-600 hover:text-red-600"
  >
    &times;
  </button>

  {/* Google Maps Autocomplete Loader */}
  <GoogleMapsLoader
    onLoad={() => {
      setTimeout(() => {
        const input = document.getElementById("manual-booking-location");
        if (!input) return;
        const autocomplete = new window.google.maps.places.Autocomplete(input, {
          types: ["geocode"],
          componentRestrictions: { country: "au" },
        });
        autocomplete.addListener("place_changed", () => {
          const place = autocomplete.getPlace();
          if (place?.formatted_address) {
            input.value = place.formatted_address;
          }
        });
      }, 200);
    }}
  />

  {/* Manual Booking Form */}
  <ManualBookingForm
    onSuccess={(msg) => {
      alert(msg);
      setShowManualForm(false);
    }}
  />
</Modal>


{/* Manual Email Form Component */}
<Modal
  isOpen={showEmailForm}
  onRequestClose={() => setShowEmailForm(false)}
  contentLabel="Manual Email Form"
  className="ReactModal__Content"
  overlayClassName="ReactModal__Overlay"
>
  <button
    onClick={() => setShowEmailForm(false)}
    className="absolute top-4 right-4 text-2xl font-bold text-gray-600 hover:text-red-600"
  >
    &times;
  </button>

  <ManualEmailForm
    onSuccess={(msg) => {
      alert(msg);
      setShowEmailForm(false);
    }}
  />
</Modal>


{/* Booking Calendar View */}
{showCalendar && (
  <div className="mb-10">
    <BookingCalendar key="calendar-visible" />
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
          <div className="flex flex-col lg:flex-row gap-6 justify-center items-start mt-6 w-full px-4">
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
          {/* Analytics Widget */}
          <Modal
  isOpen={showAnalytics}
  onRequestClose={() => setShowAnalytics(false)}
  contentLabel="Service Analytics Chart"
  className="ReactModal__Content"
  overlayClassName="ReactModal__Overlay"
>
  <button
    onClick={() => setShowAnalytics(false)}
    className="absolute top-4 right-4 text-2xl font-bold text-gray-600 hover:text-red-600"
  >
    &times;
  </button>

  <ServiceAnalytics />
</Modal>

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
