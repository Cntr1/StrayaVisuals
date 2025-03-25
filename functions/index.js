import { onDocumentCreated, onDocumentUpdated } from 'firebase-functions/v2/firestore';
import { defineSecret } from 'firebase-functions/params';
import { initializeApp } from 'firebase-admin/app';
import nodemailer from 'nodemailer';
import { OAuth2Client } from 'google-auth-library';

// Initialize Firebase Admin SDK
initializeApp();

// Define secrets (no direct .value() calls here!)
const GMAIL_EMAIL = defineSecret('GMAIL_EMAIL');
const GMAIL_CLIENT_ID = defineSecret('GMAIL_CLIENT_ID');
const GMAIL_CLIENT_SECRET = defineSecret('GMAIL_CLIENT_SECRET');
const GMAIL_REFRESH_TOKEN = defineSecret('GMAIL_REFRESH_TOKEN');

// ===============
// 1) Booking Request Confirmation (onCreate)
// ===============
export const sendBookingConfirmation = onDocumentCreated(
  {
    document: 'bookings/{bookingId}',
    region: 'us-central1',
    secrets: [GMAIL_EMAIL, GMAIL_CLIENT_ID, GMAIL_CLIENT_SECRET, GMAIL_REFRESH_TOKEN],
  },
  async (event) => {
    const snap = event.data;
    if (!snap) return;

    const booking = snap.data();
    const bookingId = event.params.bookingId;

    // Retrieve secrets at runtime
    const gmailEmail = GMAIL_EMAIL.value();
    const clientId = GMAIL_CLIENT_ID.value();
    const clientSecret = GMAIL_CLIENT_SECRET.value();
    const refreshToken = GMAIL_REFRESH_TOKEN.value();

    // Create OAuth2 client at runtime
    const oauth2Client = new OAuth2Client(clientId, clientSecret, 'https://developers.google.com/oauthplayground');
    oauth2Client.setCredentials({ refresh_token: refreshToken });

    // Create nodemailer transporter
    async function getTransporter() {
      const accessTokenResponse = await oauth2Client.getAccessToken();
      const accessToken = accessTokenResponse.token;
      return nodemailer.createTransport({
        service: 'gmail',
        auth: {
          type: 'OAuth2',
          user: gmailEmail,
          clientId,
          clientSecret,
          refreshToken,
          accessToken,
        },
      });
    }

    // Prepare the email content
    const mailOptions = {
      from: gmailEmail,
      to: booking.email,
      subject: 'Booking Request - Straya Visuals',
      text: `Hello ${booking.name},

Thank you for your booking request for our ${booking.service} service. 
Your requested booking date is ${booking.date}, and your chosen time slot is ${booking.timeSlot || 'N/A'}.
Your booking ID is ${bookingId}.

Best regards,
Straya Visuals Team`,
      html: `<p>Hello ${booking.name},</p>
             <p>Thank you for your booking request for our <strong>${booking.service}</strong> service.</p>
             <p>Your requested booking date is <strong>${booking.date}</strong>, and your chosen time slot is <strong>${booking.timeSlot || 'N/A'}</strong>.</p>
             <p>Your booking ID is <strong>${bookingId}</strong>.</p>
             <p>Best regards,<br/>Straya Visuals Team</p>`,
    };

    // Send email
    try {
      const transporter = await getTransporter();
      await transporter.sendMail(mailOptions);
      console.log('Booking request email sent to:', booking.email);
    } catch (error) {
      console.error('Failed to send booking request email:', error);
    }
  }
);

// ===============
// 2) Approval Email (onUpdate -> status = "approved")
// ===============
export const sendApprovalEmail = onDocumentUpdated(
  {
    document: 'bookings/{bookingId}',
    region: 'us-central1',
    secrets: [GMAIL_EMAIL, GMAIL_CLIENT_ID, GMAIL_CLIENT_SECRET, GMAIL_REFRESH_TOKEN],
  },
  async (event) => {
    const before = event.data?.before;
    const after = event.data?.after;
    if (!after?.exists) return; // Document was deleted

    const oldStatus = before?.data()?.status;
    const newStatus = after.data().status;
    const booking = after.data();
    const bookingId = event.params.bookingId;

    // Only proceed if status changed AND newStatus is "approved"
    if (oldStatus === newStatus) return;
    if (newStatus !== 'approved') return;

    // Retrieve secrets
    const gmailEmail = GMAIL_EMAIL.value();
    const clientId = GMAIL_CLIENT_ID.value();
    const clientSecret = GMAIL_CLIENT_SECRET.value();
    const refreshToken = GMAIL_REFRESH_TOKEN.value();

    // Create OAuth2 client
    const oauth2Client = new OAuth2Client(clientId, clientSecret, 'https://developers.google.com/oauthplayground');
    oauth2Client.setCredentials({ refresh_token: refreshToken });

    async function getTransporter() {
      const accessTokenResponse = await oauth2Client.getAccessToken();
      const accessToken = accessTokenResponse.token;
      return nodemailer.createTransport({
        service: 'gmail',
        auth: {
          type: 'OAuth2',
          user: gmailEmail,
          clientId,
          clientSecret,
          refreshToken,
          accessToken,
        },
      });
    }

    // Prepare approval email
    const mailOptions = {
      from: gmailEmail,
      to: booking.email,
      subject: 'Booking Approved - Straya Visuals',
      text: `Hello ${booking.name},

Good news! Your booking (ID: ${bookingId}) for ${booking.service} on ${booking.date} 
at ${booking.timeSlot || 'N/A'} has been approved.

We look forward to working with you!

Best regards,
Straya Visuals Team`,
      html: `<p>Hello ${booking.name},</p>
             <p>Good news! Your booking (ID: <strong>${bookingId}</strong>) for <strong>${booking.service}</strong> on <strong>${booking.date}</strong> at <strong>${booking.timeSlot || 'N/A'}</strong> has been <strong>approved</strong>.</p>
             <p>We look forward to working with you!</p>
             <p>Best regards,<br/>Straya Visuals Team</p>`,
    };

    // Send email
    try {
      const transporter = await getTransporter();
      await transporter.sendMail(mailOptions);
      console.log('Approval email sent to:', booking.email);
    } catch (error) {
      console.error('Failed to send approval email:', error);
    }
  }
);

  // ===============
  // 3) Cancellation Email (onUpdate -> status = "cancelled")
  // ===============
  export const sendCancellationEmail = onDocumentUpdated(
  {
    document: 'bookings/{bookingId}',
    region: 'us-central1',
    secrets: [GMAIL_EMAIL, GMAIL_CLIENT_ID, GMAIL_CLIENT_SECRET, GMAIL_REFRESH_TOKEN],
    },
    async (event) => {
    const before = event.data?.before;
    const after = event.data?.after;
    if (!after?.exists) return; // Document was deleted

    const oldStatus = before?.data()?.status;
    const newStatus = after.data().status;
    const booking = after.data();
    const bookingId = event.params.bookingId;

    // Only proceed if status changed AND newStatus is "cancelled"
    if (oldStatus === newStatus) return;
    if (newStatus !== 'cancelled') return;

    // Retrieve secrets
    const gmailEmail = GMAIL_EMAIL.value();
    const clientId = GMAIL_CLIENT_ID.value();
    const clientSecret = GMAIL_CLIENT_SECRET.value();
    const refreshToken = GMAIL_REFRESH_TOKEN.value();

    // Create OAuth2 client
    const oauth2Client = new OAuth2Client(clientId, clientSecret, 'https://developers.google.com/oauthplayground');
    oauth2Client.setCredentials({ refresh_token: refreshToken });

    async function getTransporter() {
      const accessTokenResponse = await oauth2Client.getAccessToken();
      const accessToken = accessTokenResponse.token;
      return nodemailer.createTransport({
        service: 'gmail',
        auth: {
          type: 'OAuth2',
          user: gmailEmail,
          clientId,
          clientSecret,
          refreshToken,
          accessToken,
        },
      });
    }

    // Prepare cancellation email
    const mailOptions = {
      from: gmailEmail,
      to: booking.email,
      subject: 'Booking Cancelled - Straya Visuals',
      text: `Hello ${booking.name},

      Your booking (ID: ${bookingId}) for our ${booking.service} on ${booking.date} 
      at ${booking.timeSlot || 'N/A'} has been cancelled.

      Best regards,
      Straya Visuals Team`,
      html: `<p>Hello ${booking.name},</p>
             <p>Your booking (ID: <strong>${bookingId}</strong>) for our <strong>${booking.service}</strong> on <strong>${booking.date}</strong> at <strong>${booking.timeSlot || 'N/A'}</strong> has been <strong>cancelled</strong>.</p>
             <p>Best regards,<br/>Straya Visuals Team</p>`,
    };

    // Send email
    try {
      const transporter = await getTransporter();
      await transporter.sendMail(mailOptions);
      console.log('Cancellation email sent to:', booking.email);
    } catch (error) {
      console.error('Failed to send cancellation email:', error);
    }
  }
);

  // ===============
// 4) Contact Form Submission Email (onCreate)
// ===============
export const sendContactEmail = onDocumentCreated(
  {
    document: 'contactMessages/{messageId}',
    region: 'us-central1',
    secrets: [GMAIL_EMAIL, GMAIL_CLIENT_ID, GMAIL_CLIENT_SECRET, GMAIL_REFRESH_TOKEN],
  },
  async (event) => {
    const snap = event.data;
    if (!snap) return;

    const data = snap.data();
    const messageId = event.params.messageId;

    const gmailEmail = GMAIL_EMAIL.value();
    const clientId = GMAIL_CLIENT_ID.value();
    const clientSecret = GMAIL_CLIENT_SECRET.value();
    const refreshToken = GMAIL_REFRESH_TOKEN.value();

    const oauth2Client = new OAuth2Client(clientId, clientSecret, 'https://developers.google.com/oauthplayground');
    oauth2Client.setCredentials({ refresh_token: refreshToken });

    const accessTokenResponse = await oauth2Client.getAccessToken();
    const accessToken = accessTokenResponse.token;

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: gmailEmail,
        clientId,
        clientSecret,
        refreshToken,
        accessToken,
      },
    });

    const mailOptions = {
      from: gmailEmail,
      to: gmailEmail, // or a specific admin email like noreply.strayavisuals@gmail.com
      subject: `New Contact Form Submission (ID: ${messageId})`,
      text: `
New contact form submission received:

Name: ${data.name}
Email: ${data.email}
Event Type: ${data.eventType}${data.eventType === "other" ? ` (${data.otherEvent})` : ""}
Date: ${data.eventDate}
Time: ${data.eventTime}
Location: ${data.eventLocation}
Budget: ${data.eventBudget}
Special Requests: ${data.specialRequests || "None"}
Submitted At: ${data.submittedAt}
      `,
    };

    try {
      await transporter.sendMail(mailOptions);
      console.log("Contact email sent successfully.");
    } catch (err) {
      console.error("Failed to send contact email:", err);
    }
  }
);



