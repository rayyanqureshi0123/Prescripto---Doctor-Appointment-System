# 🏥 Prescripto – Hospital Appointment Management System

Prescripto is a full-stack hospital appointment booking and management system where users can book appointments with doctors and admins can manage doctors, availability, and appointments. The project is built with a real-world production setup using separate deployments for frontend, admin panel, and backend API.

## Live Project Links

User Frontend:  
https://prescripto-frontend-rouge.vercel.app

Admin Panel:  
https://prescripto-ebon-three.vercel.app

Backend API:  
https://prescripto-backend-ay41.onrender.com

Note: The backend is hosted on Render Free Tier, so the first request may take 30–60 seconds due to cold start.

## Project Structure

Prescripto  
├── frontend   (User React App – Vite)  
├── admin      (Admin Dashboard – Vite)  
├── backend    (Node.js + Express API)  

## Tech Stack

Frontend: React, Vite, Axios  
Admin Panel: React, Vite, Axios  
Backend: Node.js, Express.js  
Database: MongoDB Atlas  
Authentication: JWT (token-based)  
Media Storage: Cloudinary  
Deployment: Vercel (Frontend & Admin), Render (Backend)

## Features

User Features:
- View available doctors
- Book appointments
- Choose date and time slots
- User authentication
- Responsive UI

Admin Features:
- Admin authentication
- Add and manage doctors
- Change doctor availability
- View all appointments
- Cancel appointments
- Dashboard overview

## Local Setup (Run on Another Device)

Prerequisites:
- Node.js (v18 or above)
- npm or yarn
- MongoDB Atlas account
- Cloudinary account

### Step 1: Clone the Repository

git clone https://github.com/rayyanqureshi0123/prescripto.git  
cd prescripto

### Step 2: Backend Setup

cd backend  
npm install

Create a file `backend/.env` with the following content:

PORT=4000  
MONGODB_URI=your_mongodb_atlas_uri  
JWT_SECRET=your_jwt_secret  
CLOUDINARY_NAME=your_cloudinary_name  
CLOUDINARY_API_KEY=your_cloudinary_key  
CLOUDINARY_API_SECRET=your_cloudinary_secret  

Start the backend server:

npm run server

Backend will run at:  
http://localhost:4000

### Step 3: Frontend Setup (User App)

cd ../frontend  
npm install

Create a file `frontend/.env`:

VITE_BACKEND_URL=http://localhost:4000

Start frontend:

npm run dev

Frontend will run at:  
http://localhost:5173

### Step 4: Admin Panel Setup

cd ../admin  
npm install

Create a file `admin/.env`:

VITE_BACKEND_URL=http://localhost:4000

Start admin panel:

npm run dev

Admin panel will run at:  
http://localhost:5174

## Authentication Details

- JWT based authentication
- Separate tokens for user and admin
- Tokens passed via request headers
- Admin routes are protected on the backend

## Deployment Notes

- Frontend and Admin are deployed on Vercel
- Backend is deployed on Render
- SPA routing is handled using Vercel rewrite rules
- CORS configured for frontend and admin domains
- Backend may experience cold start delay on inactivity

## Known Limitations

- Render free tier cold start delay
- Custom token headers used instead of standard Authorization header

## Future Improvements

- Use Authorization: Bearer <token> standard
- Role-based access control
- Payment integration
- Email/SMS notifications
- Advanced analytics dashboard

## Author

Mohammed Rayyan Qureshi 
Full-Stack Developer  
India

If you like this project, feel free to star the repository and explore the live demos.
