# Stripe Payment Gateway Setup Guide (Testing)

## 🎯 Quick Setup for Testing

### Step 1: Get Stripe Test API Key

1. **Sign up/Login**: https://dashboard.stripe.com/register
2. **Go to**: Developers → API keys
3. **Toggle**: Make sure you're in **Test mode** (toggle in top right)
4. **Copy**: Secret key (starts with `sk_test_...`)

### Step 2: Update Backend `.env`

Add this line to `backend/.env`:

```env
STRIPE_SECRET_KEY=sk_test_your_actual_key_here
```

**Important Notes:**
- ✅ Use **Secret key** (starts with `sk_test_...`)
- ❌ NOT the Publishable key (starts with `pk_test_...`)
- ✅ Must be in **Test mode** in Stripe dashboard
- ✅ No quotes, no spaces around the key

### Step 3: Restart Backend

```bash
cd backend
npm run server
```

## 🧪 Testing Payment Flow

### Test Card Numbers (Stripe Test Mode)

**✅ Successful Payment:**
- Card Number: `4242 4242 4242 4242`
- Expiry: Any future date (e.g., `12/25`)
- CVC: Any 3 digits (e.g., `123`)
- ZIP: Any 5 digits (e.g., `12345`)

**❌ Declined Payment:**
- Card Number: `4000 0000 0000 0002`

**More Test Cards:** https://stripe.com/docs/testing

### How to Test

1. **Book an appointment** (or use existing one)
2. Go to **"My Appointments"** page
3. Click **"Pay Online"** button
4. Click **Stripe logo** button
5. You'll be redirected to Stripe Checkout
6. Enter test card: `4242 4242 4242 4242`
7. Complete payment
8. You'll be redirected back with success message

## 🔍 How It Works

1. User clicks "Pay Online" → "Stripe" button
2. Frontend calls `/api/user/payment-stripe` with `appointmentId`
3. Backend creates Stripe Checkout Session
4. User redirected to Stripe payment page
5. After payment, Stripe redirects to `/verify?success=true&appointmentId=...`
6. Frontend calls `/api/user/verifyStripe` to confirm payment
7. Appointment marked as paid in database

## 🐛 Troubleshooting

### Error: "Invalid API Key"
- ✅ Check you copied **Secret key** (not Publishable)
- ✅ Ensure it starts with `sk_test_...`
- ✅ No extra spaces/quotes in `.env` file
- ✅ Restart backend after updating `.env`

### Payment Redirects But Doesn't Complete
- Check backend terminal for errors
- Verify `CURRENCY` is set in `.env` (should be `INR` or `USD`)
- Check browser console for frontend errors

### "No such appointment" Error
- Ensure appointment exists and isn't cancelled
- Check appointment ID is correct

## 📝 Environment Variables Needed

In `backend/.env`:

```env
# Stripe (Test Mode)
STRIPE_SECRET_KEY=sk_test_your_key_here

# Currency (required for Stripe)
CURRENCY=INR
```

## 🔐 Security Notes

- ✅ **Test keys** are safe to use in development
- ❌ **Never commit** `.env` file to Git
- ✅ Use **Test mode** for development/testing
- ⚠️ Switch to **Live mode** only for production

## 📚 Additional Resources

- Stripe Testing: https://stripe.com/docs/testing
- Stripe Dashboard: https://dashboard.stripe.com/test/apikeys
- Stripe Docs: https://stripe.com/docs

## ✅ Checklist

- [ ] Stripe account created
- [ ] Test mode enabled in Stripe dashboard
- [ ] Secret key copied (`sk_test_...`)
- [ ] `STRIPE_SECRET_KEY` added to `backend/.env`
- [ ] Backend server restarted
- [ ] Tested payment with card `4242 4242 4242 4242`
- [ ] Payment flow working end-to-end

