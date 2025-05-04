# Patient Registration App

A frontend-only patient registration application built with React and PGlite for local data storage.

## Features

- Patient registration form with validation
- View list of registered patients
- Local data storage using PGlite
- Responsive design with CSS

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

## Setup Instructions

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser and navigate to `http://localhost:5173`

## PGlite Setup

PGlite is a lightweight PostgreSQL-compatible database that runs entirely in the browser. The app is already configured to use PGlite for local data storage. No additional setup is required.

## Usage

1. Register a new patient:
   - Fill out the registration form with patient details
   - Click "Register Patient" to save the information

2. View registered patients:
   - Navigate to the "View Patients" page
   - See a list of all registered patients
   - Patients are sorted by registration date (newest first)

## Project Structure

- `src/components/`: Contains React components
  - `PatientRegistration.jsx`: Patient registration form
  - `PatientList.jsx`: List of registered patients
  - `Navbar.jsx`: Navigation component
- `src/App.jsx`: Main application component with routing
- `src/index.css`: CSS styles

## Future Improvements

- Add patient search functionality
- Implement patient record editing
- Add data export capabilities
- Implement data backup functionality
- Add user authentication
