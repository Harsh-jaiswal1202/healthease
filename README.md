# Prescripto - Healthcare Appointment System

A full-stack healthcare appointment booking system built with React, Node.js, Express, and MongoDB.

## 📋 Project Structure

```
prescripto-main/
├── backend/          # Node.js/Express API server
├── frontend/         # React frontend application
└── admin/            # React admin panel
```

## 🚀 Quick Start Guide

### Prerequisites

- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **MongoDB Atlas** account (or local MongoDB)
- **Cloudinary** account (for image uploads)
- **Stripe** and **Razorpay** accounts (for payments - optional for development)

### Step 1: Install Dependencies

Install dependencies for all three parts of the application:

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install

# Install admin dependencies
cd ../admin
npm install
```

### Step 2: Configure Environment Variables

#### Backend Configuration

Create a `.env` file in the `backend` folder:

```env
# Database Configuration
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net
DB_NAME=prescripto

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_random

# Admin Credentials
ADMIN_EMAIL=admin@prescripto.com
ADMIN_PASSWORD=your_secure_admin_password

# Cloudinary Configuration (for image uploads)
CLOUDINARY_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_SECRET_KEY=your_cloudinary_secret_key

# Payment Gateway Configuration (optional for development)
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here
RAZORPAY_KEY_ID=rzp_test_your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_secret_key

# Currency Configuration
CURRENCY=INR

# Server Configuration
PORT=4000

# CORS Configuration (for local development)
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:5174
```

**How to get these values:**
- **MongoDB URI**: Create a free cluster at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- **JWT_SECRET**: Generate a random long string (at least 32 characters)
- **Cloudinary**: Sign up at [Cloudinary](https://cloudinary.com/) and get credentials from dashboard
- **Stripe**: Get API keys from [Stripe Dashboard](https://dashboard.stripe.com/apikeys) (test keys for development)
- **Razorpay**: Get keys from [Razorpay Dashboard](https://dashboard.razorpay.com/app/keys) (test keys for development)

#### Frontend Configuration

Create a `.env` file in the `frontend` folder:

```env
VITE_BACKEND_URL=http://localhost:4000
VITE_CURRENCY=INR
```

#### Admin Configuration

Create a `.env` file in the `admin` folder (or copy from `env.example`):

```env
VITE_BACKEND_URL=http://localhost:4000
VITE_CURRENCY=INR
```

### Step 3: Run the Application

You need to run all three parts simultaneously. Open **three separate terminal windows/tabs**:

#### Terminal 1: Backend Server

```bash
cd backend
npm run server
```

The backend will start on `http://localhost:4000`

#### Terminal 2: Frontend Application

```bash
cd frontend
npm run dev
```

The frontend will start on `http://localhost:5173`

#### Terminal 3: Admin Panel

```bash
cd admin
npm run dev
```

The admin panel will start on `http://localhost:5174`

## 🎯 Access the Application

- **Frontend**: http://localhost:5173
- **Admin Panel**: http://localhost:5174
- **Backend API**: http://localhost:4000

## 📝 Available Scripts

### Backend
- `npm start` - Start the production server
- `npm run server` - Start the development server with nodemon (auto-reload)

### Frontend & Admin
- `npm run dev` - Start the development server
- `npm run build` - Build for production
- `npm run preview` - Preview the production build

## 🔧 Development Notes

1. **Database**: The app uses MongoDB. Make sure your MongoDB Atlas cluster is accessible and the connection string is correct.

2. **CORS**: The backend is configured to allow requests from `localhost:5173` (frontend) and `localhost:5174` (admin) by default. Update `ALLOWED_ORIGINS` in backend `.env` if you use different ports.

3. **Admin Access**: Use the credentials specified in `ADMIN_EMAIL` and `ADMIN_PASSWORD` in the backend `.env` file to log in to the admin panel.

4. **Image Uploads**: Cloudinary is used for image storage. Make sure to configure it properly in the backend `.env` file.

## 🐛 Troubleshooting

### Backend won't start
- Check if MongoDB connection string is correct
- Verify all required environment variables are set
- Check if port 4000 is available

### Frontend/Admin can't connect to backend
- Ensure backend is running on port 4000
- Check `VITE_BACKEND_URL` in frontend/admin `.env` files
- Verify CORS settings in backend `.env`

### Database connection errors
- Verify MongoDB Atlas cluster is running
- Check network access in MongoDB Atlas (IP whitelist)
- Ensure connection string includes correct credentials

## 📚 Additional Documentation

- [Deployment Guide](./DEPLOYMENT.md) - Instructions for deploying to production
- [Database Configuration](./CHANGE_DATABASE_NAME.md) - How to change database name

## 🛠️ Tech Stack

- **Frontend**: React, Vite, Tailwind CSS, React Router
- **Admin**: React, Vite, Tailwind CSS
- **Backend**: Node.js, Express, MongoDB, Mongoose
- **Authentication**: JWT
- **File Upload**: Cloudinary, Multer
- **Payments**: Stripe, Razorpay

## 📄 License

ISC

