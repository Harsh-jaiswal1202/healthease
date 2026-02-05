# Prescripto Deployment Guide

## 📋 Deployment Readiness Checklist

### ✅ **READY TO DEPLOY** (After following this guide)

Your app is now configured for deployment, but you need to complete the following requirements:

---

## 🔧 Requirements Before Deployment

### 1. **Backend Environment Variables**
Create a `.env` file in the `backend` folder with the following variables:

```env
# Database Configuration
MONGODB_URI=mongodb+srv://your_username:your_password@your_cluster.mongodb.net/your_database

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_random

# Admin Credentials
ADMIN_EMAIL=admin@prescripto.com
ADMIN_PASSWORD=your_secure_admin_password

# Cloudinary Configuration (for image uploads)
CLOUDINARY_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_SECRET_KEY=your_cloudinary_secret_key

# Payment Gateway Configuration
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here
# Razorpay has been removed temporarily. Use Stripe or cash for payments.

# Monitoring (optional but recommended)
SENTRY_DSN=your_sentry_dsn_here

# Note: The backend exposes a simple health endpoint at `/health` which returns { ok: true, dbConnected: true } when healthy.


# Currency Configuration
CURRENCY=INR

# Server Configuration
PORT=4000

# CORS Configuration (comma-separated list of allowed origins)
# Replace with your actual frontend and admin URLs after deployment
ALLOWED_ORIGINS=https://your-frontend.vercel.app,https://your-admin.vercel.app
```

**How to get these values:**
- **MongoDB URI**: Create a free cluster at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- **JWT_SECRET**: Generate a random long string (at least 32 characters)
- **Cloudinary**: Sign up at [Cloudinary](https://cloudinary.com/) and get credentials from dashboard
- **Stripe**: Get API keys from [Stripe Dashboard](https://dashboard.stripe.com/apikeys)
- **Cash payments**: No gateway credentials required (handled by app)

### 2. **Frontend Environment Variables**
Create a `.env` file in the `frontend` folder:

```env
VITE_BACKEND_URL=https://your-backend.vercel.app
VITE_CURRENCY=INR
# Optional: Sentry DSN for frontend monitoring
VITE_SENTRY_DSN=https://your_sentry_dsn_here
```

**Asset optimization**: The frontend includes `scripts/optimize-images.js` (uses `sharp`) to create optimized `.webp` versions of large images. Run in the `frontend` folder:

```bash
npm install
npm run optimize-images
```

### 3. **Admin Environment Variables**
Create a `.env` file in the `admin` folder:

```env
VITE_BACKEND_URL=https://your-backend.vercel.app
VITE_CURRENCY=INR
```

**Note**: Replace `https://your-backend.vercel.app` with your actual backend URL after deploying the backend.

---

## 🚀 Deployment Steps

### **Option 1: Deploy to Vercel (Recommended)**

#### **Step 1: Deploy Backend**

1. **Install Vercel CLI** (if not already installed):
   ```bash
   npm install -g vercel
   ```

2. **Navigate to backend folder**:
   ```bash
   cd backend
   ```

3. **Login to Vercel**:
   ```bash
   vercel login
   ```

4. **Deploy backend**:
   ```bash
   vercel
   ```
   - Follow the prompts
   - Say "Yes" to deploy to production
   - Note the deployment URL (e.g., `https://prescripto-backend.vercel.app`)

5. **Add Environment Variables in Vercel Dashboard**:
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Select your backend project
   - Go to Settings → Environment Variables
   - Add all variables from `backend/.env` file
   - **Important**: Update `ALLOWED_ORIGINS` with your frontend and admin URLs after deploying them

6. **Redeploy** after adding environment variables:
   ```bash
   vercel --prod
   ```

#### **Step 2: Deploy Frontend**

1. **Navigate to frontend folder**:
   ```bash
   cd ../frontend
   ```

2. **Create `.env` file** with your backend URL:
   ```env
   VITE_BACKEND_URL=https://your-backend-url.vercel.app
   VITE_CURRENCY=INR
   ```

3. **Deploy frontend**:
   ```bash
   vercel
   ```
   - Follow the prompts
   - Say "Yes" to deploy to production
   - Note the deployment URL

4. **Add Environment Variables in Vercel Dashboard**:
   - Go to your frontend project in Vercel
   - Add environment variables from `frontend/.env`

5. **Redeploy**:
   ```bash
   vercel --prod
   ```

#### **Step 3: Deploy Admin Panel**

1. **Navigate to admin folder**:
   ```bash
   cd ../admin
   ```

2. **Create `.env` file** with your backend URL:
   ```env
   VITE_BACKEND_URL=https://your-backend-url.vercel.app
   VITE_CURRENCY=INR
   ```

3. **Deploy admin**:
   ```bash
   vercel
   ```
   - Follow the prompts
   - Say "Yes" to deploy to production
   - Note the deployment URL

4. **Add Environment Variables in Vercel Dashboard**:
   - Go to your admin project in Vercel
   - Add environment variables from `admin/.env`

5. **Redeploy**:
   ```bash
   vercel --prod
   ```

#### **Step 4: Update CORS Configuration**

1. **Go back to backend in Vercel Dashboard**
2. **Update `ALLOWED_ORIGINS` environment variable**:
   ```
   https://your-frontend-url.vercel.app,https://your-admin-url.vercel.app
   ```
3. **Redeploy backend**:
   ```bash
   cd backend
   vercel --prod
   ```

---

### **Option 2: Deploy via Vercel Dashboard (GUI)**

1. **Go to [Vercel](https://vercel.com)**
2. **Import your GitHub/GitLab/Bitbucket repository**
3. **For each project (backend, frontend, admin)**:
   - Create a new project
   - Set root directory:
     - Backend: `backend`
     - Frontend: `frontend`
     - Admin: `admin`
   - Add environment variables
   - Deploy

---

## 🔍 Post-Deployment Checklist

- [ ] Backend is accessible at `https://your-backend.vercel.app`
- [ ] Frontend is accessible at `https://your-frontend.vercel.app`
- [ ] Admin panel is accessible at `https://your-admin.vercel.app`
- [ ] Backend CORS includes frontend and admin URLs
- [ ] Frontend `.env` has correct backend URL
- [ ] Admin `.env` has correct backend URL
- [ ] MongoDB connection is working
- [ ] Cloudinary integration is working
- [ ] Payment gateways are configured (test mode for development)

---

## 🐛 Troubleshooting

### **CORS Errors**
- Ensure `ALLOWED_ORIGINS` in backend includes your frontend and admin URLs
- URLs must match exactly (including `https://`)

### **Environment Variables Not Working**
- Vercel requires you to add environment variables in the dashboard
- After adding variables, redeploy the project
- For Vite apps, ensure variable names start with `VITE_`

### **Backend Not Responding**
- Check Vercel function logs in the dashboard
- Ensure `server.js` exports the app correctly
- Verify MongoDB connection string is correct

### **Build Errors**
- Check that all dependencies are in `package.json`
- Ensure Node.js version is compatible (Vercel uses Node 18+ by default)

---

## 📝 Additional Notes

- **Never commit `.env` files** to Git
- Use `.env.example` files as templates
- Update `ALLOWED_ORIGINS` after you know your deployment URLs
- Test all features after deployment
- Consider using Vercel's preview deployments for testing

---

## 🔐 Security Best Practices

1. Use strong, random JWT secrets
2. Use production payment gateway keys (not test keys) for live site
3. Keep admin credentials secure
4. Enable MongoDB IP whitelist in MongoDB Atlas
5. Regularly rotate secrets and API keys
6. Monitor Vercel logs for suspicious activity

---

## 📞 Support

If you encounter issues:
1. Check Vercel deployment logs
2. Verify all environment variables are set correctly
3. Test API endpoints using Postman or similar tools
4. Check browser console for frontend errors

---

## 🛡️ Backups & Monitoring Recommendations
- Use **MongoDB Atlas automated backups** (Snapshots) and test restore regularly.
- Configure **Sentry** for frontend (`VITE_SENTRY_DSN`) and backend (`SENTRY_DSN`) to capture errors and performance traces.
- Set up log drains and alerts in your hosting provider (Vercel) to notify on failures and high error rates.
- Consider scheduled health checks hitting `/health` endpoint and automate alerts when down.

