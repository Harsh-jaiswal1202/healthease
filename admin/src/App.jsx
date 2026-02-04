import React, { useContext } from 'react'
import { DoctorContext } from './context/DoctorContext';
import { AdminContext } from './context/AdminContext';
import { Route, Routes } from 'react-router-dom'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import Dashboard from './pages/Admin/Dashboard';
import AllAppointments from './pages/Admin/AllAppointments';
import AddDoctor from './pages/Admin/AddDoctor';
import DoctorsList from './pages/Admin/DoctorsList';
import DoctorDetails from './pages/Admin/DoctorDetails';
import EditDoctor from './pages/Admin/EditDoctor';
import Settings from './pages/Admin/Settings';
import Landing from './pages/Admin/Landing';
import Login from './pages/Login';
import DoctorAppointments from './pages/Doctor/DoctorAppointments';
import DoctorDashboard from './pages/Doctor/DoctorDashboard';
import DoctorProfile from './pages/Doctor/DoctorProfile';

const App = () => {

  const { dToken } = useContext(DoctorContext)
  const { aToken } = useContext(AdminContext)

  return dToken || aToken ? (
    <div className='bg-[#F8F9FD] dark:bg-slate-950 text-slate-900 dark:text-slate-100 h-screen overflow-hidden'>
      <ToastContainer />
      <Navbar />
        <div className='flex h-[calc(100vh-64px)]'>
          <Sidebar />
        <div className='flex-1 w-full h-full overflow-y-auto min-w-0'>
          <Routes>
          <Route path='/' element={aToken ? <Landing /> : <DoctorDashboard />} />
          <Route path='/admin-dashboard' element={<Dashboard />} />
          <Route path='/all-appointments' element={<AllAppointments />} />
          <Route path='/add-doctor' element={<AddDoctor />} />
          <Route path='/doctor-list' element={<DoctorsList />} />
          <Route path='/settings' element={<Settings />} />
          <Route path='/doctor/:doctorId' element={<DoctorDetails />} />
          <Route path='/edit-doctor/:doctorId' element={<EditDoctor />} />
          <Route path='/doctor-dashboard' element={<DoctorDashboard />} />
          <Route path='/doctor-appointments' element={<DoctorAppointments />} />
          <Route path='/doctor-profile' element={<DoctorProfile />} />
          </Routes>
        </div>
      </div>
    </div>
  ) : (
    <>
      <ToastContainer />
      <Login />
    </>
  )
}

export default App
