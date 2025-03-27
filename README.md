# Straya Visuals – Booking Platform and Admin Dashboard

Straya Visuals is a full-stack web application designed for a professional videography company based in Australia. The platform facilitates service bookings for clients and provides administrators with tools to manage bookings, view service analytics, automate email communications, and integrate with Google Calendar.

---

## Technologies Used

**Frontend**

- React
- Tailwind CSS
- Vite

**Backend & Services**

- Firebase Authentication
- Firestore Database
- Firebase Cloud Functions
- Google Maps Places API
- Nodemailer with Gmail OAuth2

**Other Libraries**

- FullCalendar (for calendar views)
- Chart.js via react-chartjs-2 (for analytics)
- React Hook Form (for form handling)

---

## Features

### Client-Facing Booking

- Fully responsive, vertically structured booking form
- Google Places Autocomplete (restricted to Australian addresses)
- Dropdown menu for time slot selection
- Firestore integration for storing booking data
- Automated confirmation email upon booking

### Administrative Tools

- Secure Google authentication (restricted to authorized admin email)
- View, approve, cancel, and delete bookings from a centralized dashboard
- FullCalendar integration for viewing all scheduled bookings
- Visual booking analytics with service-based breakdowns
- Manual booking form for direct entry
- Manual email form for sending custom messages via Firebase Cloud Functions

### Automation and Integrations

- Email notifications for booking confirmation, approval, and cancellation
- Automatic creation of Google Calendar events for approved bookings
- Admin-only access to contact submissions and video dashboard sections

---

## Continuous Deployment (CI/CD)

Deployment is handled via GitHub Actions and Firebase Hosting.

On every push to the `main` branch:

- Dependencies are installed via `npm install`
- Production build is created using Vite
- Deployment is executed to Firebase Hosting

Secrets used:

- `FIREBASE_SERVICE_ACCOUNT` – Firebase service account JSON (base64-encoded)
- `GITHUB_TOKEN` – Provided by GitHub for CI execution

---

## Project Structure

```
src/
├── components/          # Reusable UI components
├── pages/               # Route-based components (e.g., Booking, Contact, Services)
├── styles/              # Tailwind and custom CSS files
├── firebase-config.js   # Firebase project configuration
├── App.jsx              # Routing and layout logic
├── main.jsx             # Entry point for the React application
```

---

## Scripts

```bash
npm install         # Install all project dependencies
npm run dev         # Start the development server
npm run build       # Build the project for production
npm run preview     # Preview the production build
```

---

## Administrator Access

Only users authenticated via Google with the email address listed below are granted access to the Admin Dashboard:

```
noreply.strayavisuals@gmail.com
```

All other users are signed out automatically to maintain administrative security.

---

## Environment Variables and GitHub Secrets

Ensure the following secrets are configured in your GitHub repository:

- `FIREBASE_SERVICE_ACCOUNT` – Firebase service account credentials (base64-encoded)
- `GITHUB_TOKEN` – Automatically provided by GitHub Actions during workflow execution

---

## License

This project is owned and maintained by the Straya Visuals development team. All content, code, and assets are subject to internal licensing terms and conditions.
