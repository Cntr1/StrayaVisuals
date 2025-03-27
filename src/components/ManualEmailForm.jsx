import React, { useState } from "react";
import { getFirestore, collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase-config";

const ManualEmailForm = () => {
  const [formData, setFormData] = useState({
    to: "",
    subject: "",
    message: "",
  });

  const [statusMessage, setStatusMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "manualEmails"), {
        ...formData,
        createdAt: serverTimestamp(),
        status: "pending",
      });
      setFormData({ to: "", subject: "", message: "" });
      setStatusMessage("✅ Email scheduled to be sent.");
    } catch (err) {
      console.error("Error:", err);
      setStatusMessage("❌ Failed to send email.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-[900px] px-6 mx-auto mt-6 space-y-6 text-black">
      <h3 className="text-2xl font-bold text-center">✉️ Send Manual Email</h3>
  
      {/* Recipient */}
      <div className="form-item">
        <label htmlFor="to" className="form-label">Recipient Email</label>
        <input
          id="to"
          name="to"
          type="email"
          className="form-input"
          placeholder="Enter recipient email"
          value={formData.to}
          onChange={handleChange}
          required
        />
      </div>
  
      {/* Subject */}
      <div className="form-item">
        <label htmlFor="subject" className="form-label">Subject</label>
        <input
          id="subject"
          name="subject"
          type="text"
          className="form-input"
          placeholder="Enter subject"
          value={formData.subject}
          onChange={handleChange}
          required
        />
      </div>
  
      {/* Message */}
      <div className="form-item">
        <label htmlFor="message" className="form-label">Message</label>
        <textarea
          id="message"
          name="message"
          rows="6"
          className="form-input resize-none"
          placeholder="Type your message here..."
          value={formData.message}
          onChange={handleChange}
          required
        />
      </div>
  
      {/* Submit */}
      <button
        type="submit"
        className="send-button-contact w-full max-w-lg mx-auto bg-green-600 text-white py-3 rounded hover:bg-green-700"
      >
        Send Email
      </button>
  
      {/* Status */}
      {statusMessage && (
        <p className="text-center text-sm mt-2">{statusMessage}</p>
      )}
    </form>
  );
  
};

export default ManualEmailForm;
