# IIT Patna Training and Placement Cell (TPC) Portal

## Overview
The official Training and Placement Committee (TPC) portal for the Indian Institute of Technology (IIT) Patna. This platform is designed to seamlessly connect Students, Companies, and TPC Admins. It aims to streamline the recruitment process for companies and students by providing a centralized hub for events, internships, and placement drives.

## Key Features
- **Student Portal:** Centralized dashboard for accessing announcements, calendar events (internships, placement drives), updating user profiles, and viewing related opportunities.
- **Company Portal:** Advanced filtering and search of the student database to recruit top talent easily. 
- **Admin Dashboard:** Role-based access control (Super Admin, Announcement Admin, Student Admin) to manage users, verify companies, and oversee announcements and activities.
- **Passwordless Authentication:** Secure OTP-based login via email for all user roles.

## Tech Stack
### Frontend
- **Framework:** React.js powered by Vite
- **Styling:** Tailwind CSS & Framer Motion (for animations)
- **Data Visualization:** Recharts
- **Calendar Handling:** React Big Calendar 
- **Routing:** React Router DOM

### Backend
- **Framework:** Node.js, Express.js
- **Database:** MongoDB configured with Mongoose ODM
- **Authentication:** JWT (JSON Web Tokens) and bcryptjs
- **Storage:** Cloudinary plugin for file and image management
- **Email Delivery:** Nodemailer

## Project Structure
```text
TPC/
├── backend/            # Express.js REST API
│   ├── models/         # Mongoose schemas (User, Student, Company, Admin, Event, OTP)
│   ├── routes/         # API endpoints
│   ├── controllers/    # Business logic for routes
│   └── middleware/     # JWT and Role-Based Access Control logic
├── frontend/           # React.js web application
│   ├── src/
│   │   ├── components/ # Reusable UI components
│   │   ├── pages/      # Route pages (Dashboard, Landing, Calendar, etc.)
│   │   └── assets/     # Static file assets
└── README.md
```

## Getting Started

### Prerequisites
- Node.js (v18 or higher recommended)
- MongoDB instance (Atlas or local)
- Cloudinary account (for media storage)

### Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd TPC
   ```

2. **Backend Setup:**
   ```bash
   cd backend
   npm install
   ```
   *Create a `.env` file in the `backend` directory with the following keys:*
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   EMAIL_USER=your_smtp_email
   EMAIL_PASS=your_smtp_password
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   ```
   *Start the backend server:*
   ```bash
   npm run dev
   ```

3. **Frontend Setup:**
   ```bash
   cd ../frontend
   npm install
   ```
   *Create a `.env` file in the `frontend` directory with the following keys:*
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```
   *Start the frontend development server:*
   ```bash
   npm run dev
   ```

## Authorization & Security
This application implements rigorous Route Protection and Role-Based Access Control (RBAC). 
- Companies are subjected to an approval workflow before accessing the Student Database. 
- Admins possess hierarchical permissions determining what data and actions they can access.
- Confidential functionality is completely hidden or disabled for unauthorized users.

## Acknowledgements
Designed and implemented for the Training and Placement Cell, IIT Patna.
