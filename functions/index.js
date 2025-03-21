import { onDocumentCreated } from 'firebase-functions/v2/firestore';
import { defineSecret } from 'firebase-functions/params';
import { initializeApp } from 'firebase-admin/app';
import nodemailer from 'nodemailer';
import { OAuth2Client } from 'google-auth-library';

// Initialize Firebase Admin SDK
initializeApp();

// Define secrets — do NOT access them directly here!
const GMAIL_EMAIL = defineSecret('GMAIL_EMAIL');
const GMAIL_CLIENT_ID = defineSecret('GMAIL_CLIENT_ID');
const GMAIL_CLIENT_SECRET = defineSecret('GMAIL_CLIENT_SECRET');
const GMAIL_REFRESH_TOKEN = defineSecret('GMAIL_REFRESH_TOKEN');

// Booking confirmation function
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
    const oauth2Client = new OAuth2Client(
      clientId,
      clientSecret,
      'https://developers.google.com/oauthplayground'
    );
    oauth2Client.setCredentials({
      refresh_token: refreshToken,
    });

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

    // Prepare the email details
    const mailOptions = {
      from: gmailEmail,
      to: booking.email,
      subject: 'Booking Confirmation - Straya Visuals',
      text: `Hello ${booking.name},

Thank you for booking our ${booking.service}. Your booking date is ${booking.date}. Your booking ID is ${bookingId}.

Best regards,
Straya Visuals Team`,
      html: `<p>Hello ${booking.name},</p>
             <p>Thank you for booking our <strong>${booking.service}</strong>. Your booking date is <strong>${booking.date}</strong>.</p>
             <p>Your booking ID is <strong>${bookingId}</strong>.</p>
             <p>Best regards,<br/>Straya Visuals Team</p>`,
    };

    try {
      const transporter = await getTransporter();
      await transporter.sendMail(mailOptions);
      console.log('✅ Email sent to:', booking.email);
    } catch (error) {
      console.error('❌ Failed to send email:', error);
    }
  }
);
