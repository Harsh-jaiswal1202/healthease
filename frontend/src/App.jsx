import React, { Suspense, lazy } from 'react'
import Navbar from './components/Navbar'
import { Routes, Route, useLocation } from 'react-router-dom'
const Home = lazy(() => import('./pages/Home'))
const Doctors = lazy(() => import('./pages/Doctors'))
const Login = lazy(() => import('./pages/Login'))
const About = lazy(() => import('./pages/About'))
const Contact = lazy(() => import('./pages/Contact'))
const Appointment = lazy(() => import('./pages/Appointment'))
const MyAppointments = lazy(() => import('./pages/MyAppointments'))
const MyProfile = lazy(() => import('./pages/MyProfile'))
const Settings = lazy(() => import('./pages/Settings'))
import Footer from './components/Footer'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const Verify = lazy(() => import('./pages/Verify'))
import ProtectedRoute from './components/ProtectedRoute'
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'))
const VerifyOtp = lazy(() => import('./pages/VerifyOtp'))
const ResetPassword = lazy(() => import('./pages/ResetPassword'))

// const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
const App = () => {
  const location = useLocation()
  const isHomePage = location.pathname === '/'
  const hideNavbarRoutes = ['/login', '/forgot-password', '/verify-otp', '/reset-password']
  const shouldHideNavbar = hideNavbarRoutes.includes(location.pathname)

  return (
    <div className='w-full bg-white dark:bg-gray-900 transition-colors duration-300 min-h-screen'>
      <ToastContainer />
      {!shouldHideNavbar && <Navbar />}
      <Suspense fallback={<div className='min-h-screen flex items-center justify-center p-4'>Loading...</div>}>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/doctors' element={<ProtectedRoute><Doctors /></ProtectedRoute>} />
          <Route path='/doctors/:speciality' element={<ProtectedRoute><Doctors /></ProtectedRoute>} />
          <Route path='/login' element={<Login />} />
          <Route path='/about' element={<About />} />
          <Route path='/contact' element={<Contact />} />
          <Route path='/appointment/:docId' element={<Appointment />} />
          <Route path='/my-appointments' element={<MyAppointments />} />
          <Route path='/my-profile' element={<MyProfile />} />
          <Route path='/settings' element={<Settings />} />
          <Route path='/verify' element={<Verify />} />
          <Route path='/forgot-password' element={<ForgotPassword />} />
          <Route path='/verify-otp' element={<VerifyOtp />} />
          <Route path='/reset-password' element={<ResetPassword />} />
        </Routes>
      </Suspense>
      {isHomePage && <Footer />}
    </div>
  )
}

export default App
