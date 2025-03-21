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

    // Runtime secrets
    const gmailEmail = GMAIL_EMAIL.value();
    const clientId = GMAIL_CLIENT_ID.value();
    const clientSecret = GMAIL_CLIENT_SECRET.value();
    const refreshToken = GMAIL_REFRESH_TOKEN.value();

    // Create OAuth2 client at runtime
    const oauth2Client = new OAuth2Client(
      clientId,
      clientSecret,
      'https://developers.google.com/oauthplayground'
    );
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

    // Prepare email details
    const mailOptions = {
      from: gmailEmail,
      to: booking.email,
      subject: 'Booking Request - Straya Visuals',
      text: `Hello ${booking.name},

Thank you for your booking request for our ${booking.service} service. Your requested booking date is ${booking.date}. Your booking ID is ${bookingId}.

Best regards,
Straya Visuals Team`,
      html: `<p>Hello ${booking.name},</p>
             <p>Thank you for your booking request for our <strong>${booking.service}</strong> service. Your requested booking date is <strong>${booking.date}</strong>.</p>
             <p>Your booking ID is <strong>${bookingId}</strong>.</p>
             <p>Best regards,<br/>Straya Visuals Team</p>`,
    };

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
// 2) Approval Email (onUpdate when status -> "approved")
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
    if (!after?.exists) return; // Document was deleted or doesn't exist

    const oldStatus = before?.data()?.status;
    const newStatus = after.data().status;
    const booking = after.data();
    const bookingId = event.params.bookingId;

    // Only proceed if status changed AND newStatus is "approved"
    if (oldStatus === newStatus) return;
    if (newStatus !== 'approved') return;

    // Retrieve secrets at runtime
    const gmailEmail = GMAIL_EMAIL.value();
    const clientId = GMAIL_CLIENT_ID.value();
    const clientSecret = GMAIL_CLIENT_SECRET.value();
    const refreshToken = GMAIL_REFRESH_TOKEN.value();

    // Create OAuth2 client
    const oauth2Client = new OAuth2Client(
      clientId,
      clientSecret,
      'https://developers.google.com/oauthplayground'
    );
    oauth2Client.setCredentials({ refresh_token: refreshToken });

    // Transporter creation
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

    // Prepare the approval email
    const mailOptions = {
      from: gmailEmail,
      to: booking.email,
      subject: 'Booking Approved - Straya Visuals',
      text: `Hello ${booking.name},

Good news! Your booking (ID: ${bookingId}) for ${booking.service} on ${booking.date} has been approved.

We look forward to working with you!

Best regards,
Straya Visuals Team`,
      html: `<p>Hello ${booking.name},</p>
             <p>Good news! Your booking (ID: <strong>${bookingId}</strong>) for <strong>${booking.service}</strong> on <strong>${booking.date}</strong> has been <strong>approved</strong>.</p>
             <p>We look forward to working with you!</p>
             <p>Best regards,<br/>Straya Visuals Team</p>`,
    };

    try {
      const transporter = await getTransporter();
      await transporter.sendMail(mailOptions);
      console.log('Approval email sent to:', booking.email);
    } catch (error) {
      console.error('Failed to send approval email:', error);
    }
  }
);
