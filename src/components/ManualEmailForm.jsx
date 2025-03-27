import React, { useState } from 'react';
import { collection, addDoc, getFirestore } from 'firebase/firestore';

const db = getFirestore();

const ManualEmailForm = () => {
  const [formData, setFormData] = useState({
    to: '',
    subject: '',
    message: '',
  });

  const [status, setStatus] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSend = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "manualEmails"), {
        ...formData,
        sentAt: new Date(),
      });
      setStatus("✅ Email sent successfully!");
      setFormData({ to: '', subject: '', message: '' });
    } catch (error) {
      console.error("Error sending email:", error);
      setStatus("❌ Failed to send email.");
    }
  };

  return (
    <div className="bg-[#1c1505] p-6 rounded-lg text-white shadow-lg mb-6 max-w-2xl mx-auto">
      <h3 className="text-xl font-bold mb-4 text-center">📧 Send Manual Email</h3>
      <form onSubmit={handleSend} className="space-y-4">
        <input
          type="email"
          name="to"
          placeholder="Recipient Email"
          className="w-full px-4 py-2 rounded text-black"
          value={formData.to}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="subject"
          placeholder="Subject"
          className="w-full px-4 py-2 rounded text-black"
          value={formData.subject}
          onChange={handleChange}
          required
        />
        <textarea
          name="message"
          placeholder="Message"
          className="w-full px-4 py-2 rounded text-black h-32 resize-none"
          value={formData.message}
          onChange={handleChange}
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 py-2 rounded font-semibold"
        >
          Send Email
        </button>
      </form>
      {status && <p className="mt-2 text-center">{status}</p>}
    </div>
  );
};

export default ManualEmailForm;
