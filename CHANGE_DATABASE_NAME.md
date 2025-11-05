# How to Change Database Name in MongoDB Atlas

## 📝 Important Note

In MongoDB Atlas, you **don't actually rename databases**. Instead, you just **use a different database name** when connecting. MongoDB creates the database automatically when you first write data to it.

## 🔧 Steps to Change Database Name

### **Option 1: Using Environment Variable (Recommended)**

I've updated your code to use an environment variable for the database name. Follow these steps:

1. **Open your `backend/.env` file**

2. **Add or update the `DB_NAME` variable**:
   ```env
   DB_NAME=your_new_database_name
   ```
   
   For example:
   ```env
   DB_NAME=prescripto_new
   ```
   or
   ```env
   DB_NAME=healthcare_db
   ```

3. **Save the file**

4. **Restart your backend server**
   ```bash
   cd backend
   npm run server
   ```

5. **That's it!** The app will now connect to the new database name.

---

### **Option 2: Directly in Code (Not Recommended)**

If you prefer to hardcode it, you can edit `backend/config/mongodb.js`:

```javascript
await mongoose.connect(`${process.env.MONGODB_URI}/your_new_database_name`)
```

---

## 📋 Complete `.env` Example

```env
# Database Configuration
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net
DB_NAME=your_new_database_name

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here

# Admin Credentials
ADMIN_EMAIL=admin@prescripto.com
ADMIN_PASSWORD=admin123456

# Cloudinary Configuration
CLOUDINARY_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_SECRET_KEY=your_cloudinary_secret_key

# Payment Gateway Configuration
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
RAZORPAY_KEY_ID=rzp_test_your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_secret_key

# Currency Configuration
CURRENCY=INR

# Server Configuration
PORT=4000

# CORS Configuration
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:5174
```

---

## ⚠️ Important Notes

1. **Database Creation**: MongoDB will automatically create the database when you first insert data. You don't need to create it manually in Atlas.

2. **Data Migration**: If you have existing data in the old database (`prescripto`), you'll need to:
   - Export data from the old database
   - Import it into the new database
   - Or keep both databases and migrate data gradually

3. **Default Value**: If you don't set `DB_NAME` in `.env`, it will default to `prescripto` (backward compatible).

4. **No Need to Change in Atlas UI**: You don't need to do anything in the MongoDB Atlas dashboard. Just change the name in your code/environment variables.

---

## 🚀 Quick Steps Summary

1. ✅ Code updated to use `DB_NAME` environment variable
2. Add `DB_NAME=your_new_name` to `backend/.env`
3. Restart backend server
4. Done!

---

## 📊 Viewing Your Database in Atlas

After connecting with the new name and inserting data:

1. Go to **MongoDB Atlas Dashboard**
2. Click **Browse Collections**
3. You'll see your new database name listed
4. Collections will appear once data is inserted

---

## 🔄 If You Want to Migrate Data

If you have existing data in the old database and want to move it:

1. **Use MongoDB Compass** or **Atlas Data Explorer**
2. Export collections from old database
3. Import to new database
4. Or use MongoDB dump/restore tools

That's it! Your database name is now configurable via environment variable.

