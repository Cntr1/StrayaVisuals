import {
  onDocumentCreated,
  onDocumentUpdated,
} from "firebase-functions/v2/firestore";
import { defineSecret } from "firebase-functions/params";
import { initializeApp } from "firebase-admin/app";
import nodemailer from "nodemailer";
import { OAuth2Client } from "google-auth-library";
import { google } from 'googleapis';

// Initialize Firebase Admin SDK
initializeApp();

// Define secrets
const GMAIL_EMAIL = defineSecret("GMAIL_EMAIL");
const GMAIL_CLIENT_ID = defineSecret("GMAIL_CLIENT_ID");
const GMAIL_CLIENT_SECRET = defineSecret("GMAIL_CLIENT_SECRET");
const GMAIL_REFRESH_TOKEN = defineSecret("GMAIL_REFRESH_TOKEN");

// Function to create OAuth2 client and transporter
async function createTransporter() {
  const gmailEmail = GMAIL_EMAIL.value();
  const clientId = GMAIL_CLIENT_ID.value();
  const clientSecret = GMAIL_CLIENT_SECRET.value();
  const refreshToken = GMAIL_REFRESH_TOKEN.value();

  const oauth2Client = new OAuth2Client(
    clientId,
    clientSecret,
    "https://developers.google.com/oauthplayground",
  );
  oauth2Client.setCredentials({ refresh_token: refreshToken });

  const accessTokenResponse = await oauth2Client.getAccessToken();
  const accessToken = accessTokenResponse.token;

  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      type: "OAuth2",
      user: gmailEmail,
      clientId,
      clientSecret,
      refreshToken,
      accessToken,
    },
  });
}

// Function to send email
async function sendEmail(to, subject, text, html) {
  const transporter = await createTransporter();
  const mailOptions = {
    from: GMAIL_EMAIL.value(),
    to,
    cc: GMAIL_EMAIL.value(), // CC to yourself
    subject,
    text,
    html,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`${subject} email sent to:`, to);
  } catch (error) {
    console.error(`Failed to send ${subject} email:`, error);
  }
}

// ===============
// 1) Booking Request Confirmation (onCreate)
// ===============
export const sendBookingConfirmation = onDocumentCreated(
  {
    document: "bookings/{bookingId}",
    region: "us-central1",
    secrets: [
      GMAIL_EMAIL,
      GMAIL_CLIENT_ID,
      GMAIL_CLIENT_SECRET,
      GMAIL_REFRESH_TOKEN,
    ],
  },
  async (event) => {
    const snap = event.data;
    if (!snap) return;

    const booking = snap.data();
    console.log("📦 Booking data:", booking); // ← add this
    const bookingId = event.params.bookingId;


    const subject = "Booking Request - Straya Visuals";
    const text = `Hello ${booking.name},

Thank you for your booking request. Here are the details:

Name: ${booking.name}
Email: ${booking.email}
Type of Service: ${booking.serviceType}
Date of Service: ${booking.date}
Time Slot: ${booking.timeSlot}
Location: ${booking.bookingLocation}
Your Budget: ${booking.budget}
Any Special Requests: ${booking.specialRequests || "None"}

Your booking ID is ${bookingId}.

Best regards,
Straya Visuals Team`;

    const html = `<div style="font-family: Arial, sans-serif; line-height: 1.6;">
      <img src="https://straya-visuals.web.app/images/logo.jpeg" alt="Straya Visuals Logo" style="max-width: 200px;"/>
      <p>Hello ${booking.name},</p>
      <p>Thank you for your booking request. Here are the details:</p>
      <ul>
        <li><strong>Name:</strong> ${booking.name}</li>
        <li><strong>Email:</strong> ${booking.email}</li>
        <li><strong>Type of Service:</strong> ${booking.serviceType}</li>
        <li><strong>Date of Service:</strong> ${booking.date}</li>
        <li><strong>Time Slot:</strong> ${booking.timeSlot}</li>
        <li><strong>Location:</strong> ${booking.bookingLocation}</li>
        <li><strong>Your Budget:</strong> ${booking.budget}</li>
        <li><strong>Any Special Requests:</strong> ${booking.specialRequests || "None"}</li>
      </ul>
      <p>Your booking ID is <strong>${bookingId}</strong>.</p>      
      <p>Best regards,<br/>Straya Visuals Team</p>
    </div>`;

    await sendEmail(booking.email, subject, text, html);

    // ---------------------
    // Google Calendar Event
    // ---------------------
    const gmailEmail = GMAIL_EMAIL.value();
    const clientId = GMAIL_CLIENT_ID.value();
    const clientSecret = GMAIL_CLIENT_SECRET.value();
    const refreshToken = GMAIL_REFRESH_TOKEN.value();

    const oauth2Client = new OAuth2Client(clientId, clientSecret, 'https://developers.google.com/oauthplayground');
    oauth2Client.setCredentials({ refresh_token: refreshToken });

    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

    // Parse time slot (e.g., "2:00 PM - 3:00 PM")
    const [startStr, endStr] = booking.timeSlot.split(" - ");
    const eventDate = booking.date; // e.g., "2025-04-15"

    function formatToRFC3339(dateStr, timeStr) {
      const [hour, minute, period] = timeStr.match(/(\d+):(\d+)\s?(AM|PM)/i).slice(1);
      let h = parseInt(hour);
      if (period.toUpperCase() === 'PM' && h !== 12) h += 12;
      if (period.toUpperCase() === 'AM' && h === 12) h = 0;
      return `${dateStr}T${h.toString().padStart(2, '0')}:${minute.padStart(2, '0')}:00`;
    }

    const startTime = formatToRFC3339(eventDate, startStr);
    const endTime = formatToRFC3339(eventDate, endStr);

    const calendarEvent = {
      summary: `Booking: ${booking.name} (${booking.serviceType})`,
      description: `Booking ID: ${bookingId}\nLocation: ${booking.bookingLocation}\nSpecial Requests: ${booking.specialRequests || 'None'}`,
      start: {
        dateTime: startTime,
        timeZone: 'Australia/Sydney', // Adjust if needed
      },
      end: {
        dateTime: endTime,
        timeZone: 'Australia/Sydney',
      },
      attendees: [
        { email: booking.email },
        { email: gmailEmail } // Sends to yourself
      ]
    };

    try {
      await calendar.events.insert({
        calendarId: 'primary',
        resource: calendarEvent,
      });
      console.log("📅 Google Calendar event created.");
    } catch (err) {
      console.error("❌ Failed to create calendar event:", err);
    }
  }
);

// ===============
// 2) Approval Email (onUpdate -> status = "approved")
// ===============
export const sendApprovalEmail = onDocumentUpdated(
  {
    document: "bookings/{bookingId}",
    region: "us-central1",
    secrets: [
      GMAIL_EMAIL,
      GMAIL_CLIENT_ID,
      GMAIL_CLIENT_SECRET,
      GMAIL_REFRESH_TOKEN,
    ],
  },
  async (event) => {
    const before = event.data?.before;
    const after = event.data?.after;
    if (!after?.exists) return;

    const oldStatus = before?.data()?.status;
    const newStatus = after.data().status;
    if (oldStatus === newStatus || newStatus !== "approved") return;

    const booking = after.data();
    const bookingId = event.params.bookingId;

    const subject = "Booking Approved - Straya Visuals";
    const text = `Hello ${booking.name},

Great news! Your booking has been approved. Here are the details:

Name: ${booking.name}
Email: ${booking.email}
Type of Service: ${booking.serviceType}
Date of Service: ${booking.date}
Time Slot: ${booking.timeSlot}
Location: ${booking.bookingLocation}
Your Budget: ${booking.budget}
Any Special Requests: ${booking.specialRequests || "None"}

Your booking ID is ${bookingId}.

Best regards,
Straya Visuals Team`;

    const html = `<div style="font-family: Arial, sans-serif; line-height: 1.6;">
      <img src="https://straya-visuals.web.app/images/logo.jpeg" alt="Straya Visuals Logo" style="max-width: 200px;"/>
      <p>Hello ${booking.name},</p>
      <p><strong>Great news!</strong> Your booking has been <strong>approved</strong>. Here are the details:</p>
      <ul>
        <li><strong>Name:</strong> ${booking.name}</li>
        <li><strong>Email:</strong> ${booking.email}</li>
        <li><strong>Type of Service:</strong> ${booking.serviceType}</li>
        <li><strong>Date of Service:</strong> ${booking.date}</li>
        <li><strong>Time Slot:</strong> ${booking.timeSlot}</li>
        <li><strong>Location:</strong> ${booking.bookingLocation}</li>
        <li><strong>Your Budget:</strong> ${booking.budget}</li>
        <li><strong>Any Special Requests:</strong> ${booking.specialRequests || "None"}</li>
      </ul>
      <p>Your booking ID is <strong>${bookingId}</strong>.</p>      
      <p>Best regards,<br/>Straya Visuals Team</p>
    </div>`;

    await sendEmail(booking.email, subject, text, html);
  },
);

export const sendCancellationEmail = onDocumentUpdated(
  {
    document: "bookings/{bookingId}",
    region: "us-central1",
    secrets: [
      GMAIL_EMAIL,
      GMAIL_CLIENT_ID,
      GMAIL_CLIENT_SECRET,
      GMAIL_REFRESH_TOKEN,
    ],
  },
  async (event) => {
    const before = event.data?.before;
    const after = event.data?.after;
    if (!after?.exists) return;

    const oldStatus = before?.data()?.status;
    const newStatus = after.data().status;
    if (oldStatus === newStatus || newStatus !== "cancelled") return;

    const booking = after.data();
    const bookingId = event.params.bookingId;

    const subject = "Booking Cancelled - Straya Visuals";
    const text = `Hello ${booking.name},

We regret to inform you that your booking has been cancelled. Here are the details:

Name: ${booking.name}
Email: ${booking.email}
Booking ID: ${bookingId}
Date of Service: ${booking.date}
Time Slot: ${booking.timeSlot}

If this is a mistake or you have any questions, feel free to reply.

Best regards,
Straya Visuals Team`;

    const html = `<div style="font-family: Arial, sans-serif; line-height: 1.6;">
      <img src="https://straya-visuals.web.app/images/logo.jpeg" alt="Straya Visuals Logo" style="max-width: 200px;"/>
      <p>Hello ${booking.name},</p>
      <p>We regret to inform you that your booking has been <strong>cancelled</strong>. Here are the details:</p>
      <ul>
        <li><strong>Name:</strong> ${booking.name}</li>
        <li><strong>Email:</strong> ${booking.email}</li>
        <li><strong>Booking ID:</strong> ${bookingId}</li>
        <li><strong>Date of Service:</strong> ${booking.date}</li>
        <li><strong>Time Slot:</strong> ${booking.timeSlot}</li>
      </ul>
      <p>If this is a mistake or you have any questions, feel free to reply.<br/></p>
      <p>Best regards,<br/>Straya Visuals Team</p>
    </div>`;

    await sendEmail(booking.email, subject, text, html);
  },
);

export const sendContactEmail = onDocumentCreated(
  {
    document: "contactMessages/{messageId}",
    region: "us-central1",
    secrets: [
      GMAIL_EMAIL,
      GMAIL_CLIENT_ID,
      GMAIL_CLIENT_SECRET,
      GMAIL_REFRESH_TOKEN,
    ],
  },
  async (event) => {
    const snap = event.data;
    if (!snap) return;

    const data = snap.data();
    const messageId = event.params.messageId;

    const subject = `New Contact Form Submission (ID: ${messageId})`;
    const text = `New contact form submission received:

Name: ${data.name}
Email: ${data.email}
Phone Number: ${data.phoneNumber}
Inquiry Type: ${data.inquiryType === "other" ? `Other (${data.otherInquiryType})` : data.inquiryType}
Inquiry Details: ${data.inquiryDetails}

Submitted At: ${data.submittedAt}
`;

    const html = `<div style="font-family: Arial, sans-serif; line-height: 1.6;">
      <img src="https://straya-visuals.web.app/images/logo.jpeg" alt="Straya Visuals Logo" style="max-width: 200px;"/>
      <h2>New Contact Form Submission</h2>
      <p><strong>Name:</strong> ${data.name}</p>
      <p><strong>Email:</strong> ${data.email}</p>
      <p><strong>Phone Number:</strong> ${data.phoneNumber}</p>
      <p><strong>Inquiry Type:</strong> ${data.inquiryType === "other" ? `Other (${data.otherInquiryType})` : data.inquiryType}</p>
      <p><strong>Inquiry Details:</strong><br/>${data.inquiryDetails}</p>
      <p><em>Submitted At: ${data.submittedAt}</em></p>
    </div>`;

    await sendEmail(GMAIL_EMAIL.value(), subject, text, html);
  },
);
