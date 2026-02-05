import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import AdminContextProvider from './context/AdminContext.jsx'
import DoctorContextProvider from './context/DoctorContext.jsx'
import AppContextProvider from './context/AppContext.jsx'

import * as Sentry from "@sentry/react"
import { BrowserTracing } from "@sentry/tracing"

if (import.meta.env.VITE_SENTRY_DSN) {
  Sentry.init({
    dsn: import.meta.env.VITE_SENTRY_DSN,
    integrations: [new BrowserTracing()],
    tracesSampleRate: 0.1,
    environment: import.meta.env.MODE
  })
}

const storedTheme = localStorage.getItem('admin-theme') || localStorage.getItem('doctor-theme')
if (storedTheme) {
  const useDark = storedTheme === 'dark'
  document.documentElement.classList.toggle('dark', useDark)
  document.body.classList.toggle('dark', useDark)
  document.getElementById('root')?.classList.toggle('dark', useDark)
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <AdminContextProvider>
      <DoctorContextProvider>
        <AppContextProvider>
          <App />
        </AppContextProvider>
      </DoctorContextProvider>
    </AdminContextProvider>
  </BrowserRouter>,
)
