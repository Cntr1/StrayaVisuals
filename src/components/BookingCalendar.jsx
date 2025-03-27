// src/components/BookingCalendar.jsx
import React, { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { collection, getDocs, getFirestore } from "firebase/firestore";
import Modal from "react-modal";
import "./calendar.css"; // optional for custom styling

const db = getFirestore();

const BookingCalendar = () => {
  const [bookings, setBookings] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);

  useEffect(() => {
    const fetchBookings = async () => {
      const snapshot = await getDocs(collection(db, "bookings"));
      const data = snapshot.docs.map((doc) => {
        const booking = doc.data();
        const [startTime, endTime] = booking.timeSlot.split(" - ");
        const start = new Date(`${booking.date} ${startTime}`);
        const end = new Date(`${booking.date} ${endTime}`);

        return {
          id: doc.id,
          title: `${booking.name} (${booking.serviceType})`,
          start,
          end,
          extendedProps: booking,
          backgroundColor:
            booking.status === "approved"
              ? "#4caf50"
              : booking.status === "pending"
              ? "#ff9800"
              : "#f44336",
        };
      });
      setBookings(data);
    };

    fetchBookings();
  }, []);

  const handleEventClick = ({ event }) => {
    setSelectedBooking(event.extendedProps);
    setModalIsOpen(true);
  };

  return (
    <div>
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        events={bookings}
        eventClick={handleEventClick}
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,timeGridWeek,timeGridDay",
        }}
        height="auto"
      />

      {/* Modal */}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        contentLabel="Booking Details"
        ariaHideApp={false}
        className="calendar-modal"
      >
        {selectedBooking && (
          <div>
            <h2>{selectedBooking.name}</h2>
            <p><strong>Email:</strong> {selectedBooking.email}</p>
            <p><strong>Service:</strong> {selectedBooking.serviceType}</p>
            <p><strong>Date:</strong> {selectedBooking.date}</p>
            <p><strong>Time:</strong> {selectedBooking.timeSlot}</p>
            <p><strong>Location:</strong> {selectedBooking.bookingLocation}</p>
            <p><strong>Budget:</strong> ${selectedBooking.budget}</p>
            <p><strong>Requests:</strong> {selectedBooking.specialRequests || "None"}</p>
            <p><strong>Status:</strong> {selectedBooking.status}</p>
            <button
              onClick={() => setModalIsOpen(false)}
              className="bg-red-500 text-white px-4 py-2 mt-4 rounded"
            >
              Close
            </button>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default BookingCalendar;
