import express from "express"
import cors from 'cors'
import 'dotenv/config'
import connectDB from "./config/mongodb.js"
import connectCloudinary from "./config/cloudinary.js"
import userRouter from "./routes/userRoute.js"
import doctorRouter from "./routes/doctorRoute.js"
import adminRouter from "./routes/adminRoute.js"

import * as Sentry from '@sentry/node'
import { Integrations } from '@sentry/tracing'
import mongoose from 'mongoose'

// app config
const app = express()
const port = process.env.PORT || 4000

// Sentry init (if DSN provided)
if (process.env.SENTRY_DSN) {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    integrations: [new Integrations.Express({ app }), new Sentry.Integrations.Http({ tracing: true })],
    tracesSampleRate: 0.05
  })
  // Request handler must be the first middleware on the app
  app.use(Sentry.Handlers.requestHandler())
  app.use(Sentry.Handlers.tracingHandler())
}

connectDB()
connectCloudinary()

// middlewares
app.use(express.json())
app.use(cors(
  {
    origin: process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : ["http://localhost:5173", "http://localhost:5174"],
    methods: ["POST", "GET", "PUT", "DELETE", "PATCH"],
    credentials: true
  }
));

// api endpoints
app.use("/api/user", userRouter)
app.use("/api/admin", adminRouter)
app.use("/api/doctor", doctorRouter)

app.get("/", (req, res) => {
  res.send("API Working")
});

// Health check
app.get('/health', (req, res) => {
  try {
    const mongooseReady = mongoose.connection.readyState === 1
    res.json({ ok: true, dbConnected: mongooseReady })
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message })
  }
})

// Sentry error handler (if enabled)
if (process.env.SENTRY_DSN) {
  app.use(Sentry.Handlers.errorHandler())
}

// Export for Vercel serverless
export default app;

// Only listen if not in Vercel environment
if (process.env.VERCEL !== '1') {
  app.listen(port, () => console.log(`Server started on PORT:${port}`))
}