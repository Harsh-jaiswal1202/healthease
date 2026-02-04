import React from 'react'
import Navbar from './components/Navbar'
import { Routes, Route, useLocation } from 'react-router-dom'
import Home from './pages/Home'
import Doctors from './pages/Doctors'
import Login from './pages/Login'
import About from './pages/About'
import Contact from './pages/Contact'
import Appointment from './pages/Appointment'
import MyAppointments from './pages/MyAppointments'
import MyProfile from './pages/MyProfile'
import Settings from './pages/Settings'
import Footer from './components/Footer'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Verify from './pages/Verify'
import ProtectedRoute from './components/ProtectedRoute'
import ForgotPassword from './pages/ForgotPassword'
import VerifyOtp from './pages/VerifyOtp'
import ResetPassword from './pages/ResetPassword'

// const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
const App = () => {
  const location = useLocation()
  const isLoginPage = location.pathname === '/login'
  const isHomePage = location.pathname === '/'

  return (
    <div className='w-full bg-white dark:bg-gray-900 transition-colors duration-300 min-h-screen'>
      <ToastContainer />
      {!isLoginPage && <Navbar />}
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
      {isHomePage && <Footer />}
    </div>
  )
}

export default App
