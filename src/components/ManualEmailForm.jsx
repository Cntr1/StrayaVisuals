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
    <div className="bg-[#1c1505] p-6 rounded-lg text-white shadow-lg mb-8 max-w-2xl mx-auto">
      <h3 className="text-xl font-bold mb-4 text-center">✉️ Send Email Manually</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 text-sm font-semibold">Recipient Email</label>
          <input
            type="email"
            name="to"
            value={formData.to}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-[#2a1f0b] text-white rounded"
            placeholder="Enter recipient email"
            required
          />
        </div>
        <div>
          <label className="block mb-1 text-sm font-semibold">Subject</label>
          <input
            type="text"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-[#2a1f0b] text-white rounded"
            placeholder="Enter email subject"
            required
          />
        </div>
        <div>
          <label className="block mb-1 text-sm font-semibold">Message</label>
          <textarea
            name="message"
            rows="6"
            value={formData.message}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-[#2a1f0b] text-white rounded resize-none"
            placeholder="Enter your message..."
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-700 py-2 rounded font-semibold"
        >
          Send Email
        </button>
        {statusMessage && (
          <p className="mt-2 text-center text-sm">
            {statusMessage}
          </p>
        )}
      </form>
    </div>
  );
};

export default ManualEmailForm;
